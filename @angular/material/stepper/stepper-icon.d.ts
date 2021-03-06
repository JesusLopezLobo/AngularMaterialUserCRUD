/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { TemplateRef } from '@angular/core';
import { StepState } from '@angular/cdk/stepper';
import * as i0 from "@angular/core";
/** Template context available to an attached `matStepperIcon`. */
export interface MatStepperIconContext {
    /** Index of the step. */
    index: number;
    /** Whether the step is currently active. */
    active: boolean;
    /** Whether the step is optional. */
    optional: boolean;
}
/**
 * Template to be used to override the icons inside the step header.
 */
export declare class MatStepperIcon {
    templateRef: TemplateRef<MatStepperIconContext>;
    /** Name of the icon to be overridden. */
    name: StepState;
    constructor(templateRef: TemplateRef<MatStepperIconContext>);
    static ɵfac: i0.ɵɵFactoryDeclaration<MatStepperIcon, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<MatStepperIcon, "ng-template[matStepperIcon]", never, { "name": "matStepperIcon"; }, {}, never>;
}
