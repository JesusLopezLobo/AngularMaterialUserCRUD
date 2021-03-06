/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { AriaDescriber } from '@angular/cdk/a11y';
import { BooleanInput } from '@angular/cdk/coercion';
import { ElementRef, NgZone, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { CanDisable, ThemePalette } from '@angular/material/core';
import * as i0 from "@angular/core";
/** @docs-private */
declare const _MatBadgeBase: import("@angular/material/core")._Constructor<CanDisable> & import("@angular/material/core")._AbstractConstructor<CanDisable> & {
    new (): {};
};
/** Allowed position options for matBadgePosition */
export declare type MatBadgePosition = 'above after' | 'above before' | 'below before' | 'below after' | 'before' | 'after' | 'above' | 'below';
/** Allowed size options for matBadgeSize */
export declare type MatBadgeSize = 'small' | 'medium' | 'large';
/** Directive to display a text badge. */
export declare class MatBadge extends _MatBadgeBase implements OnInit, OnDestroy, CanDisable {
    private _ngZone;
    private _elementRef;
    private _ariaDescriber;
    private _renderer;
    private _animationMode?;
    /** The color of the badge. Can be `primary`, `accent`, or `warn`. */
    get color(): ThemePalette;
    set color(value: ThemePalette);
    private _color;
    /** Whether the badge should overlap its contents or not */
    get overlap(): boolean;
    set overlap(val: boolean);
    private _overlap;
    /**
     * Position the badge should reside.
     * Accepts any combination of 'above'|'below' and 'before'|'after'
     */
    position: MatBadgePosition;
    /** The content for the badge */
    get content(): string | number | undefined | null;
    set content(newContent: string | number | undefined | null);
    private _content;
    /** Message used to describe the decorated element via aria-describedby */
    get description(): string;
    set description(newDescription: string);
    private _description;
    /** Size of the badge. Can be 'small', 'medium', or 'large'. */
    size: MatBadgeSize;
    /** Whether the badge is hidden. */
    get hidden(): boolean;
    set hidden(val: boolean);
    private _hidden;
    /** Unique id for the badge */
    _id: number;
    /** Visible badge element. */
    private _badgeElement;
    /** Whether the OnInit lifecycle hook has run yet */
    private _isInitialized;
    constructor(_ngZone: NgZone, _elementRef: ElementRef<HTMLElement>, _ariaDescriber: AriaDescriber, _renderer: Renderer2, _animationMode?: string | undefined);
    /** Whether the badge is above the host or not */
    isAbove(): boolean;
    /** Whether the badge is after the host or not */
    isAfter(): boolean;
    /**
     * Gets the element into which the badge's content is being rendered. Undefined if the element
     * hasn't been created (e.g. if the badge doesn't have content).
     */
    getBadgeElement(): HTMLElement | undefined;
    ngOnInit(): void;
    ngOnDestroy(): void;
    /** Creates the badge element */
    private _createBadgeElement;
    /** Update the text content of the badge element in the DOM, creating the element if necessary. */
    private _updateRenderedContent;
    /** Updates the host element's aria description via AriaDescriber. */
    private _updateHostAriaDescription;
    /** Adds css theme class given the color to the component host */
    private _setColor;
    /** Clears any existing badges that might be left over from server-side rendering. */
    private _clearExistingBadges;
    static ngAcceptInputType_disabled: BooleanInput;
    static ngAcceptInputType_hidden: BooleanInput;
    static ngAcceptInputType_overlap: BooleanInput;
    static ??fac: i0.????FactoryDeclaration<MatBadge, [null, null, null, null, { optional: true; }]>;
    static ??dir: i0.????DirectiveDeclaration<MatBadge, "[matBadge]", never, { "disabled": "matBadgeDisabled"; "color": "matBadgeColor"; "overlap": "matBadgeOverlap"; "position": "matBadgePosition"; "content": "matBadge"; "description": "matBadgeDescription"; "size": "matBadgeSize"; "hidden": "matBadgeHidden"; }, {}, never>;
}
export {};
