import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CoreComponent } from './core/core.component';
import { KontentService } from './services/kontent.service';
import { catchError, map, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { saveAs } from 'file-saver';

export interface IBuildResponse {
    data: {
        executionTime: string;
        gitHubResult: string;
        isDebug: boolean;
        isPreview: boolean;
        storeOnGithub: boolean;
        root: string;
        filename: string;
        branch: string;
        warnings: string[];
        openApiJson: any;
    };
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent extends CoreComponent implements OnInit, AfterViewChecked {
    // base
    public errorMessage?: string;
    public infoMessage?: string;

    // config
    public requiredElementCodename?: string;
    public sourceElementCodename?: string;
    public sourceElementValue?: string;

    constructor(private kontentService: KontentService, private httpClient: HttpClient, cdr: ChangeDetectorRef) {
        super(cdr);
    }

    ngOnInit(): void {
        if (this.isKontentContext()) {
            this.kontentService.initCustomElement(
                (data) => {
                    // get codename of current course content item
                    this.requiredElementCodename = data.requiredElementCodename;
                    this.sourceElementCodename = data.sourceElementCodename;
                    this.sourceElementValue = data.sourceElementValue;
                    super.detectChanges();
                },
                (error) => {
                    console.error(error);
                    this.errorMessage = `Could not initialize custom element. Custom elements can only be embedded in an iframe`;
                    super.detectChanges();
                }
            );
        } else {
            this.errorMessage = `Could not initialize custom element. This element only works when deployed`;
        }
    }

    ngAfterViewChecked(): void {
        // update size of Kontent UI
        if (this.isKontentContext()) {
            // this is required because otherwise the offsetHeight can return 0 in some circumstances
            // https://stackoverflow.com/questions/294250/how-do-i-retrieve-an-html-elements-actual-width-and-height
            setTimeout(() => {
                const htmlElement = document.getElementById('htmlElem');
                if (htmlElement) {
                    const height = htmlElement.offsetHeight;
                    this.kontentService.updateSizeToMatchHtml(height);
                }
            }, 50);
        }
    }

    private isKontentContext(): boolean {
        return environment.production;
    }
}
