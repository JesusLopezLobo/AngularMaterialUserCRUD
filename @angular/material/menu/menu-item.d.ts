/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusableOption, FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { ElementRef, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CanDisable, CanDisableRipple } from '@angular/material/core';
import { Subject } from 'rxjs';
import { MatMenuPanel } from './menu-panel';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatMenuItemBase: import("@angular/material/core")._Constructor<CanDisableRipple> & import("@angular/material/core")._AbstractConstructor<CanDisableRipple> & import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (): {};
};
/**
 * Single item inside of a `mat-menu`. Provides the menu item styling and accessibility treatment.
 */
export declare class MatMenuItem extends _MatMenuItemBase implements FocusableOption, CanDisable, CanDisableRipple, AfterViewInit, OnDestroy {
    private _elementRef;
    private _focusMonitor?;
    _parentMenu?: MatMenuPanel<MatMenuItem> | undefined;
    /**
     * @deprecated `_changeDetectorRef` to become a required parameter.
     * @breaking-change 14.0.0
     */
    private _changeDetectorRef?;
    /** ARIA role for the menu item. */
    role: 'menuitem' | 'menuitemradio' | 'menuitemcheckbox';
    /** Stream that emits when the menu item is hovered. */
    readonly _hovered: Subject<MatMenuItem>;
    /** Stream that emits when the menu item is focused. */
    readonly _focused: Subject<MatMenuItem>;
    /** Whether the menu item is highlighted. */
    _highlighted: boolean;
    /** Whether the menu item acts as a trigger for a sub-menu. */
    _triggersSubmenu: boolean;
    constructor(_elementRef: ElementRef<HTMLElement>, 
    /**
     * @deprecated `_document` parameter is no longer being used and will be removed.
     * @breaking-change 12.0.0
     */
    _document?: any, _focusMonitor?: FocusMonitor | undefined, _parentMenu?: MatMenuPanel<MatMenuItem> | undefined, 
    /**
     * @deprecated `_changeDetectorRef` to become a required parameter.
     * @breaking-change 14.0.0
     */
    _changeDetectorRef?: ChangeDetectorRef | undefined);
    /** Focuses the menu item. */
    focus(origin?: FocusOrigin, options?: FocusOptions): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /** Used to set the `tabindex`. */
    _getTabIndex(): string;
    /** Returns the host DOM element. */
    _getHostElement(): HTMLElement;
    /** Prevents the default element actions if it is disabled. */
    _checkDisabled(event: Event): void;
    /** Emits to the hover stream. */
    _handleMouseEnter(): void;
    /** Gets the label to be used when determining whether the option should be focused. */
    getLabel(): string;
    _setHighlighted(isHighlighted: boolean): void;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_disableRipple: BooleanInput;
    static ??fac: i0.????FactoryDeclaration<MatMenuItem, [null, null, null, { optional: true; }, null]>;
    static ??cmp: i0.????ComponentDeclaration<MatMenuItem, "[mat-menu-item]", ["matMenuItem"], { "disabled": "disabled"; "disableRipple": "disableRipple"; "role": "role"; }, {}, never, ["*"]>;
}
export {};
