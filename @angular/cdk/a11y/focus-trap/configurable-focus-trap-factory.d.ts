import { NgZone } from '@angular/core';
import { InteractivityChecker } from '../interactivity-checker/interactivity-checker';
import { ConfigurableFocusTrap } from './configurable-focus-trap';
import { ConfigurableFocusTrapConfig } from './configurable-focus-trap-config';
import { FocusTrapInertStrategy } from './focus-trap-inert-strategy';
import { FocusTrapManager } from './focus-trap-manager';
import * as i0 from "@angular/core";
/** Factory that allows easy instantiation of configurable focus traps. */
export declare class ConfigurableFocusTrapFactory {
    private _checker;
    private _ngZone;
    private _focusTrapManager;
    private _document;
    private _inertStrategy;
    constructor(_checker: InteractivityChecker, _ngZone: NgZone, _focusTrapManager: FocusTrapManager, _document: any, _inertStrategy?: FocusTrapInertStrategy);
    /**
     * Creates a focus-trapped region around the given element.
     * @param element The element around which focus will be trapped.
     * @param config The focus trap configuration.
     * @returns The created focus trap instance.
     */
    create(element: HTMLElement, config?: ConfigurableFocusTrapConfig): ConfigurableFocusTrap;
    /**
     * @deprecated Pass a config object instead of the `deferCaptureElements` flag.
     * @breaking-change 11.0.0
     */
    create(element: HTMLElement, deferCaptureElements: boolean): ConfigurableFocusTrap;
    static ɵfac: i0.ɵɵFactoryDeclaration<ConfigurableFocusTrapFactory, [null, null, null, null, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ConfigurableFocusTrapFactory>;
}
