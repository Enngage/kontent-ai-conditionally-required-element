import { AfterViewChecked, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CoreComponent } from './core/core.component';
import { IElementInit, IMultipleChoiceValue, KontentService } from './services/kontent.service';
import { Observable, delay, from, map, of, switchMap, tap } from 'rxjs';
import { createDeliveryClient, Elements } from '@kontent-ai/delivery-sdk';

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

interface IMessage {
    type: 'info' | 'error' | 'loading';
    text: string;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends CoreComponent implements OnInit, AfterViewChecked {
    private readonly previewApiCallDelayInMs: number = 3000;

    // base
    public message?: IMessage;

    // config
    private elementData?: IElementInit;

    private getSourceElementValue: (callback: (value: IMultipleChoiceValue[] | undefined) => void) => void = () => {};

    public currentSourceElementValueCodename?: string;

    constructor(private kontentService: KontentService, cdr: ChangeDetectorRef) {
        super(cdr);
    }

    ngOnInit(): void {
        if (this.isKontentContext()) {
            this.kontentService.initCustomElement(
                (data) => {
                    // get codename of current course content item
                    this.elementData = data;

                    this.getSourceElementValue = (callback) =>
                        data.getElementValue(data.sourceElementCodename, callback);

                    data.observeElementChanges(
                        [data.sourceElementCodename, data.requiredElementCodename],
                        (changedElementCodenames) => {
                            // source element value changed
                            this.checkForNewValue();
                            super.detectChanges();
                        }
                    );

                    this.checkForNewValue();

                    super.detectChanges();
                },
                (error) => {
                    console.error(error);
                    this.message = {
                        text: `Could not initialize custom element. Custom elements can only be embedded in an iframe`,
                        type: 'error'
                    };
                    super.detectChanges();
                }
            );
        } else {
            this.message = {
                text: `Could not initialize custom element. This element only works when deployed`,
                type: 'error'
            };
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

    public checkForNewValue(): void {
        this.getSourceElementValue((sourceElementValue) => {
            this.currentSourceElementValueCodename = sourceElementValue?.[0]?.codename;

            if (this.currentSourceElementValueCodename?.toLowerCase() === this.elementData?.sourceElementValue) {
                // element is required
                // check the value of required element codename
                super.subscribeToObservable(
                    of(undefined).pipe(
                        tap(() => {
                            this.message = {
                                text: `Checking validity`,
                                type: 'loading'
                            };

                            this.kontentService.setValue(null);

                            super.detectChanges();
                        }),
                        delay(this.previewApiCallDelayInMs),
                        switchMap(() => {
                            return this.isRequiredElementEmpty();
                        }),
                        map((isRequiredElementEmpty) => {
                            if (isRequiredElementEmpty) {
                                this.message = {
                                    text: `Item is incomplete because element '${this.elementData?.requiredElementCodename}' is required, but is empty.`,
                                    type: 'error'
                                };

                                this.kontentService.setValue(null);
                            } else {
                                this.message = {
                                    text: `Item is valid because '${this.elementData?.requiredElementCodename}' is both required and set`,
                                    type: 'info'
                                };

                                this.kontentService.setValue('1');
                            }

                            super.detectChanges();
                        })
                    )
                );
            } else {
                this.message = {
                    text: `Item is valid because '${this.elementData?.requiredElementCodename}' is not required`,
                    type: 'info'
                };
                // element is not required
                // store some value
                this.kontentService.setValue('1');
            }

            super.detectChanges();
        });
    }

    private isKontentContext(): boolean {
        return environment.production;
    }

    private isRequiredElementEmpty(): Observable<boolean> {
        const elementData = this.elementData;
        if (!elementData) {
            throw Error(`Invalid element data`);
        }
        const client = createDeliveryClient({
            environmentId: elementData.context.projectId,
            previewApiKey: elementData.previewApiKey,
            defaultQueryConfig: {
                usePreviewMode: true,
                waitForLoadingNewContent: true
            }
        });

        return from(
            client
                .item(elementData.context.item.codename)
                .languageParameter(elementData.context.variant.codename)
                .toPromise()
        ).pipe(
            map((response) => {
                const requiredElement = response.data.item.elements[
                    elementData.requiredElementCodename
                ] as Elements.LinkedItemsElement;

                if (requiredElement.value.length) {
                    return false;
                }

                return true;
            })
        );
    }
}
