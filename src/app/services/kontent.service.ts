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

export interface IMultipleChoiceValue {
    codename: string;
    id: string;
    name: string;
}

export interface IElementInit {
    isDisabled: boolean;
    value?: string;
    context: ICustomElementContext;
    getElementValue: (elementCodename: string, callback: (value: IMultipleChoiceValue[] | undefined) => void) => void;
    observeElementChanges: (elementCodenames: string[], callback: (changedElementCodenames: string[]) => void) => void;
    requiredElementCodename: string;
    sourceElementCodename: string;
    sourceElementValue: string;
    previewApiKey: string;
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
                    getElementValue: (elementCodename, callback) => {
                        return CustomElement.getElementValue(elementCodename, (value: any) => {
                            callback(value);
                        });
                    },
                    observeElementChanges: (elementCodenames, callback) => {
                        return CustomElement.observeElementChanges(elementCodenames, (value: any) => {
                            callback(value);
                        });
                    },
                    requiredElementCodename: element.config.requiredElementCodename,
                    sourceElementCodename: element.config.sourceElementCodename,
                    sourceElementValue: element.config.sourceElementValue,
                    previewApiKey: element.config.previewApiKey,
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
