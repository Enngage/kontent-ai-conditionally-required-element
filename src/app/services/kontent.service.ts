import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare const CustomElement: any;

export interface ICustomElementContext {
    item: {
        codename: string;
        id: string;
        name: string;
    };
    projectId: string;
    variant: {
        id: string;
        codename: string;
    };
}

interface IElementInit {
    isDisabled: boolean;
    value?: string;
    context: ICustomElementContext;
    getElementValue: (elementCodename: string) => string | undefined;
    requiredElementCodename: string;
    sourceElementCodename: string;
    sourceElementValue: string;
}

@Injectable({ providedIn: 'root' })
export class KontentService {
    public disabledChanged = new Subject<boolean>();
    private initialized: boolean = false;

    constructor() {}

    initCustomElement(onInit: (data: IElementInit) => void, onError: (error: any) => void): void {
        try {
            CustomElement.init((element: any, context: ICustomElementContext) => {
                this.initialized = true;

                CustomElement.onDisabledChanged((disabled: boolean) => {
                    this.disabledChanged.next(disabled);
                });

                onInit({
                    context: context,
                    value: element.value,
                    isDisabled: element.disabled,
                    getElementValue: (elementCodename) => CustomElement.getElementValue(elementCodename),
                    requiredElementCodename: element.config.requiredElementCodename,
                    sourceElementCodename: element.config.sourceElementCodename,
                    sourceElementValue: element.config.sourceElementValue
                });
            });
        } catch (error) {
            onError(error);
        }
    }

    setValue(value: string | null): void {
        if (this.initialized) {
            CustomElement.setValue(value);
        }
    }

    updateSizeToMatchHtml(height: number): void {
        if (this.initialized) {
            CustomElement.setHeight(height);
        }
    }
}
