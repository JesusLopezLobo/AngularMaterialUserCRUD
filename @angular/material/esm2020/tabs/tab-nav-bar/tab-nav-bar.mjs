/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Platform } from '@angular/cdk/platform';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { Attribute, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, forwardRef, Inject, Input, NgZone, Optional, QueryList, ViewChild, ViewEncapsulation, } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS, mixinDisabled, mixinDisableRipple, mixinTabIndex, RippleRenderer, } from '@angular/material/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { startWith, takeUntil } from 'rxjs/operators';
import { MatInkBar } from '../ink-bar';
import { MatPaginatedTabHeader } from '../paginated-tab-header';
import * as i0 from "@angular/core";
import * as i1 from "@angular/cdk/bidi";
import * as i2 from "@angular/cdk/scrolling";
import * as i3 from "@angular/cdk/platform";
import * as i4 from "@angular/material/core";
import * as i5 from "@angular/cdk/observers";
import * as i6 from "../ink-bar";
import * as i7 from "@angular/cdk/a11y";
/**
 * Base class with all of the `MatTabNav` functionality.
 * @docs-private
 */
export class _MatTabNavBase extends MatPaginatedTabHeader {
    constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode) {
        super(elementRef, changeDetectorRef, viewportRuler, dir, ngZone, platform, animationMode);
        this._disableRipple = false;
        /** Theme color of the nav bar. */
        this.color = 'primary';
    }
    /** Background color of the tab nav. */
    get backgroundColor() {
        return this._backgroundColor;
    }
    set backgroundColor(value) {
        const classList = this._elementRef.nativeElement.classList;
        classList.remove(`mat-background-${this.backgroundColor}`);
        if (value) {
            classList.add(`mat-background-${value}`);
        }
        this._backgroundColor = value;
    }
    /** Whether the ripple effect is disabled or not. */
    get disableRipple() {
        return this._disableRipple;
    }
    set disableRipple(value) {
        this._disableRipple = coerceBooleanProperty(value);
    }
    _itemSelected() {
        // noop
    }
    ngAfterContentInit() {
        // We need this to run before the `changes` subscription in parent to ensure that the
        // selectedIndex is up-to-date by the time the super class starts looking for it.
        this._items.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
            this.updateActiveLink();
        });
        super.ngAfterContentInit();
    }
    /** Notifies the component that the active link has been changed. */
    updateActiveLink() {
        if (!this._items) {
            return;
        }
        const items = this._items.toArray();
        for (let i = 0; i < items.length; i++) {
            if (items[i].active) {
                this.selectedIndex = i;
                this._changeDetectorRef.markForCheck();
                return;
            }
        }
        // The ink bar should hide itself if no items are active.
        this.selectedIndex = -1;
        this._inkBar.hide();
    }
}
_MatTabNavBase.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: _MatTabNavBase, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i3.Platform }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.????FactoryTarget.Directive });
_MatTabNavBase.??dir = i0.????ngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: _MatTabNavBase, inputs: { backgroundColor: "backgroundColor", disableRipple: "disableRipple", color: "color" }, usesInheritance: true, ngImport: i0 });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: _MatTabNavBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { backgroundColor: [{
                type: Input
            }], disableRipple: [{
                type: Input
            }], color: [{
                type: Input
            }] } });
/**
 * Navigation component matching the styles of the tab group header.
 * Provides anchored navigation with animated ink bar.
 */
export class MatTabNav extends _MatTabNavBase {
    constructor(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode) {
        super(elementRef, dir, ngZone, changeDetectorRef, viewportRuler, platform, animationMode);
    }
}
MatTabNav.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatTabNav, deps: [{ token: i0.ElementRef }, { token: i1.Directionality, optional: true }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }, { token: i2.ViewportRuler }, { token: i3.Platform }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.????FactoryTarget.Component });
MatTabNav.??cmp = i0.????ngDeclareComponent({ minVersion: "12.0.0", version: "13.0.1", type: MatTabNav, selector: "[mat-tab-nav-bar]", inputs: { color: "color" }, host: { properties: { "class.mat-tab-header-pagination-controls-enabled": "_showPaginationControls", "class.mat-tab-header-rtl": "_getLayoutDirection() == 'rtl'", "class.mat-primary": "color !== \"warn\" && color !== \"accent\"", "class.mat-accent": "color === \"accent\"", "class.mat-warn": "color === \"warn\"" }, classAttribute: "mat-tab-nav-bar mat-tab-header" }, queries: [{ propertyName: "_items", predicate: i0.forwardRef(function () { return MatTabLink; }), descendants: true }], viewQueries: [{ propertyName: "_inkBar", first: true, predicate: MatInkBar, descendants: true, static: true }, { propertyName: "_tabListContainer", first: true, predicate: ["tabListContainer"], descendants: true, static: true }, { propertyName: "_tabList", first: true, predicate: ["tabList"], descendants: true, static: true }, { propertyName: "_tabListInner", first: true, predicate: ["tabListInner"], descendants: true, static: true }, { propertyName: "_nextPaginator", first: true, predicate: ["nextPaginator"], descendants: true }, { propertyName: "_previousPaginator", first: true, predicate: ["previousPaginator"], descendants: true }], exportAs: ["matTabNavBar", "matTabNav"], usesInheritance: true, ngImport: i0, template: "<div class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before', $event)\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n\n<div class=\"mat-tab-link-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div\n    class=\"mat-tab-list\"\n    [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n    #tabList\n    (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-tab-links\" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n    <mat-ink-bar></mat-ink-bar>\n  </div>\n</div>\n\n<div class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     (mousedown)=\"_handlePaginatorPress('after', $event)\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n", styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;-moz-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:\"\";height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-tab-links{display:flex}[mat-align-tabs=center]>.mat-tab-link-container .mat-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-tab-link-container .mat-tab-links{justify-content:flex-end}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .mat-ink-bar{outline:solid 2px;height:0}.mat-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-link{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}.mat-tab-link:focus{outline:none}.mat-tab-link:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-link:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-link.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-link.mat-tab-disabled{opacity:.5}.mat-tab-link .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-link{opacity:1}[mat-stretch-tabs] .mat-tab-link{flex-basis:0;flex-grow:1}.mat-tab-link.mat-tab-disabled{pointer-events:none}@media(max-width: 599px){.mat-tab-link{min-width:72px}}\n"], directives: [{ type: i4.MatRipple, selector: "[mat-ripple], [matRipple]", inputs: ["matRippleColor", "matRippleUnbounded", "matRippleCentered", "matRippleRadius", "matRippleAnimation", "matRippleDisabled", "matRippleTrigger"], exportAs: ["matRipple"] }, { type: i5.CdkObserveContent, selector: "[cdkObserveContent]", inputs: ["cdkObserveContentDisabled", "debounce"], outputs: ["cdkObserveContent"], exportAs: ["cdkObserveContent"] }, { type: i6.MatInkBar, selector: "mat-ink-bar" }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatTabNav, decorators: [{
            type: Component,
            args: [{ selector: '[mat-tab-nav-bar]', exportAs: 'matTabNavBar, matTabNav', inputs: ['color'], host: {
                        'class': 'mat-tab-nav-bar mat-tab-header',
                        '[class.mat-tab-header-pagination-controls-enabled]': '_showPaginationControls',
                        '[class.mat-tab-header-rtl]': "_getLayoutDirection() == 'rtl'",
                        '[class.mat-primary]': 'color !== "warn" && color !== "accent"',
                        '[class.mat-accent]': 'color === "accent"',
                        '[class.mat-warn]': 'color === "warn"',
                    }, encapsulation: ViewEncapsulation.None, changeDetection: ChangeDetectionStrategy.Default, template: "<div class=\"mat-tab-header-pagination mat-tab-header-pagination-before mat-elevation-z4\"\n     #previousPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollBefore || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollBefore\"\n     (click)=\"_handlePaginatorClick('before')\"\n     (mousedown)=\"_handlePaginatorPress('before', $event)\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n\n<div class=\"mat-tab-link-container\" #tabListContainer (keydown)=\"_handleKeydown($event)\">\n  <div\n    class=\"mat-tab-list\"\n    [class._mat-animation-noopable]=\"_animationMode === 'NoopAnimations'\"\n    #tabList\n    (cdkObserveContent)=\"_onContentChanges()\">\n    <div class=\"mat-tab-links\" #tabListInner>\n      <ng-content></ng-content>\n    </div>\n    <mat-ink-bar></mat-ink-bar>\n  </div>\n</div>\n\n<div class=\"mat-tab-header-pagination mat-tab-header-pagination-after mat-elevation-z4\"\n     #nextPaginator\n     aria-hidden=\"true\"\n     mat-ripple [matRippleDisabled]=\"_disableScrollAfter || disableRipple\"\n     [class.mat-tab-header-pagination-disabled]=\"_disableScrollAfter\"\n     (mousedown)=\"_handlePaginatorPress('after', $event)\"\n     (click)=\"_handlePaginatorClick('after')\"\n     (touchend)=\"_stopInterval()\">\n  <div class=\"mat-tab-header-pagination-chevron\"></div>\n</div>\n", styles: [".mat-tab-header{display:flex;overflow:hidden;position:relative;flex-shrink:0}.mat-tab-header-pagination{-webkit-user-select:none;-moz-user-select:none;user-select:none;position:relative;display:none;justify-content:center;align-items:center;min-width:32px;cursor:pointer;z-index:2;-webkit-tap-highlight-color:transparent;touch-action:none}.mat-tab-header-pagination-controls-enabled .mat-tab-header-pagination{display:flex}.mat-tab-header-pagination-before,.mat-tab-header-rtl .mat-tab-header-pagination-after{padding-left:4px}.mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-rtl .mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(-135deg)}.mat-tab-header-rtl .mat-tab-header-pagination-before,.mat-tab-header-pagination-after{padding-right:4px}.mat-tab-header-rtl .mat-tab-header-pagination-before .mat-tab-header-pagination-chevron,.mat-tab-header-pagination-after .mat-tab-header-pagination-chevron{transform:rotate(45deg)}.mat-tab-header-pagination-chevron{border-style:solid;border-width:2px 2px 0 0;content:\"\";height:8px;width:8px}.mat-tab-header-pagination-disabled{box-shadow:none;cursor:default}.mat-tab-list{flex-grow:1;position:relative;transition:transform 500ms cubic-bezier(0.35, 0, 0.25, 1)}.mat-tab-links{display:flex}[mat-align-tabs=center]>.mat-tab-link-container .mat-tab-links{justify-content:center}[mat-align-tabs=end]>.mat-tab-link-container .mat-tab-links{justify-content:flex-end}.mat-ink-bar{position:absolute;bottom:0;height:2px;transition:500ms cubic-bezier(0.35, 0, 0.25, 1)}._mat-animation-noopable.mat-ink-bar{transition:none;animation:none}.mat-tab-group-inverted-header .mat-ink-bar{bottom:auto;top:0}.cdk-high-contrast-active .mat-ink-bar{outline:solid 2px;height:0}.mat-tab-link-container{display:flex;flex-grow:1;overflow:hidden;z-index:1}.mat-tab-link{height:48px;padding:0 24px;cursor:pointer;box-sizing:border-box;opacity:.6;min-width:160px;text-align:center;display:inline-flex;justify-content:center;align-items:center;white-space:nowrap;vertical-align:top;text-decoration:none;position:relative;overflow:hidden;-webkit-tap-highlight-color:transparent}.mat-tab-link:focus{outline:none}.mat-tab-link:focus:not(.mat-tab-disabled){opacity:1}.cdk-high-contrast-active .mat-tab-link:focus{outline:dotted 2px;outline-offset:-2px}.mat-tab-link.mat-tab-disabled{cursor:default}.cdk-high-contrast-active .mat-tab-link.mat-tab-disabled{opacity:.5}.mat-tab-link .mat-tab-label-content{display:inline-flex;justify-content:center;align-items:center;white-space:nowrap}.cdk-high-contrast-active .mat-tab-link{opacity:1}[mat-stretch-tabs] .mat-tab-link{flex-basis:0;flex-grow:1}.mat-tab-link.mat-tab-disabled{pointer-events:none}@media(max-width: 599px){.mat-tab-link{min-width:72px}}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.Directionality, decorators: [{
                    type: Optional
                }] }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }, { type: i2.ViewportRuler }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { _items: [{
                type: ContentChildren,
                args: [forwardRef(() => MatTabLink), { descendants: true }]
            }], _inkBar: [{
                type: ViewChild,
                args: [MatInkBar, { static: true }]
            }], _tabListContainer: [{
                type: ViewChild,
                args: ['tabListContainer', { static: true }]
            }], _tabList: [{
                type: ViewChild,
                args: ['tabList', { static: true }]
            }], _tabListInner: [{
                type: ViewChild,
                args: ['tabListInner', { static: true }]
            }], _nextPaginator: [{
                type: ViewChild,
                args: ['nextPaginator']
            }], _previousPaginator: [{
                type: ViewChild,
                args: ['previousPaginator']
            }] } });
// Boilerplate for applying mixins to MatTabLink.
const _MatTabLinkMixinBase = mixinTabIndex(mixinDisableRipple(mixinDisabled(class {
})));
/** Base class with all of the `MatTabLink` functionality. */
export class _MatTabLinkBase extends _MatTabLinkMixinBase {
    constructor(_tabNavBar, 
    /** @docs-private */ elementRef, globalRippleOptions, tabIndex, _focusMonitor, animationMode) {
        super();
        this._tabNavBar = _tabNavBar;
        this.elementRef = elementRef;
        this._focusMonitor = _focusMonitor;
        /** Whether the tab link is active or not. */
        this._isActive = false;
        this.rippleConfig = globalRippleOptions || {};
        this.tabIndex = parseInt(tabIndex) || 0;
        if (animationMode === 'NoopAnimations') {
            this.rippleConfig.animation = { enterDuration: 0, exitDuration: 0 };
        }
    }
    /** Whether the link is active. */
    get active() {
        return this._isActive;
    }
    set active(value) {
        const newValue = coerceBooleanProperty(value);
        if (newValue !== this._isActive) {
            this._isActive = value;
            this._tabNavBar.updateActiveLink();
        }
    }
    /**
     * Whether ripples are disabled on interaction.
     * @docs-private
     */
    get rippleDisabled() {
        return (this.disabled ||
            this.disableRipple ||
            this._tabNavBar.disableRipple ||
            !!this.rippleConfig.disabled);
    }
    /** Focuses the tab link. */
    focus() {
        this.elementRef.nativeElement.focus();
    }
    ngAfterViewInit() {
        this._focusMonitor.monitor(this.elementRef);
    }
    ngOnDestroy() {
        this._focusMonitor.stopMonitoring(this.elementRef);
    }
    _handleFocus() {
        // Since we allow navigation through tabbing in the nav bar, we
        // have to update the focused index whenever the link receives focus.
        this._tabNavBar.focusIndex = this._tabNavBar._items.toArray().indexOf(this);
    }
}
_MatTabLinkBase.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: _MatTabLinkBase, deps: [{ token: _MatTabNavBase }, { token: i0.ElementRef }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: 'tabindex', attribute: true }, { token: i7.FocusMonitor }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.????FactoryTarget.Directive });
_MatTabLinkBase.??dir = i0.????ngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: _MatTabLinkBase, inputs: { active: "active" }, usesInheritance: true, ngImport: i0 });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: _MatTabLinkBase, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: _MatTabNavBase }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: i7.FocusMonitor }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; }, propDecorators: { active: [{
                type: Input
            }] } });
/**
 * Link inside of a `mat-tab-nav-bar`.
 */
export class MatTabLink extends _MatTabLinkBase {
    constructor(tabNavBar, elementRef, ngZone, platform, globalRippleOptions, tabIndex, focusMonitor, animationMode) {
        super(tabNavBar, elementRef, globalRippleOptions, tabIndex, focusMonitor, animationMode);
        this._tabLinkRipple = new RippleRenderer(this, ngZone, elementRef, platform);
        this._tabLinkRipple.setupTriggerEvents(elementRef.nativeElement);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this._tabLinkRipple._removeTriggerEvents();
    }
}
MatTabLink.??fac = i0.????ngDeclareFactory({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatTabLink, deps: [{ token: MatTabNav }, { token: i0.ElementRef }, { token: i0.NgZone }, { token: i3.Platform }, { token: MAT_RIPPLE_GLOBAL_OPTIONS, optional: true }, { token: 'tabindex', attribute: true }, { token: i7.FocusMonitor }, { token: ANIMATION_MODULE_TYPE, optional: true }], target: i0.????FactoryTarget.Directive });
MatTabLink.??dir = i0.????ngDeclareDirective({ minVersion: "12.0.0", version: "13.0.1", type: MatTabLink, selector: "[mat-tab-link], [matTabLink]", inputs: { disabled: "disabled", disableRipple: "disableRipple", tabIndex: "tabIndex" }, host: { listeners: { "focus": "_handleFocus()" }, properties: { "attr.aria-current": "active ? \"page\" : null", "attr.aria-disabled": "disabled", "attr.tabIndex": "tabIndex", "class.mat-tab-disabled": "disabled", "class.mat-tab-label-active": "active" }, classAttribute: "mat-tab-link mat-focus-indicator" }, exportAs: ["matTabLink"], usesInheritance: true, ngImport: i0 });
i0.????ngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.0.1", ngImport: i0, type: MatTabLink, decorators: [{
            type: Directive,
            args: [{
                    selector: '[mat-tab-link], [matTabLink]',
                    exportAs: 'matTabLink',
                    inputs: ['disabled', 'disableRipple', 'tabIndex'],
                    host: {
                        'class': 'mat-tab-link mat-focus-indicator',
                        '[attr.aria-current]': 'active ? "page" : null',
                        '[attr.aria-disabled]': 'disabled',
                        '[attr.tabIndex]': 'tabIndex',
                        '[class.mat-tab-disabled]': 'disabled',
                        '[class.mat-tab-label-active]': 'active',
                        '(focus)': '_handleFocus()',
                    },
                }]
        }], ctorParameters: function () { return [{ type: MatTabNav }, { type: i0.ElementRef }, { type: i0.NgZone }, { type: i3.Platform }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [MAT_RIPPLE_GLOBAL_OPTIONS]
                }] }, { type: undefined, decorators: [{
                    type: Attribute,
                    args: ['tabindex']
                }] }, { type: i7.FocusMonitor }, { type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [ANIMATION_MODULE_TYPE]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbWF0ZXJpYWwvdGFicy90YWItbmF2LWJhci90YWItbmF2LWJhci50cyIsIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC90YWJzL3RhYi1uYXYtYmFyL3RhYi1uYXYtYmFyLmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFrQixZQUFZLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUNoRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFlLHFCQUFxQixFQUFjLE1BQU0sdUJBQXVCLENBQUM7QUFDdkYsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQy9DLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNyRCxPQUFPLEVBSUwsU0FBUyxFQUNULHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLFVBQVUsRUFDVixNQUFNLEVBQ04sS0FBSyxFQUNMLE1BQU0sRUFFTixRQUFRLEVBQ1IsU0FBUyxFQUNULFNBQVMsRUFDVCxpQkFBaUIsR0FDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUlMLHlCQUF5QixFQUN6QixhQUFhLEVBQ2Isa0JBQWtCLEVBQ2xCLGFBQWEsRUFHYixjQUFjLEdBR2YsTUFBTSx3QkFBd0IsQ0FBQztBQUNoQyxPQUFPLEVBQUMscUJBQXFCLEVBQUMsTUFBTSxzQ0FBc0MsQ0FBQztBQUMzRSxPQUFPLEVBQUMsU0FBUyxFQUFFLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3BELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDckMsT0FBTyxFQUFDLHFCQUFxQixF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LEVBQUUsUUFBUTt3QkFDeEMsU0FBUyxFQUFFLGdCQUFnQjtxQkFDNUI7aUJBQ0Y7MERBTWMsU0FBUzswQkFJbkIsUUFBUTs7MEJBQUksTUFBTTsyQkFBQyx5QkFBeUI7OzBCQUM1QyxTQUFTOzJCQUFDLFVBQVU7OzBCQUVwQixRQUFROzswQkFBSSxNQUFNOzJCQUFDLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtGb2N1c2FibGVPcHRpb24sIEZvY3VzTW9uaXRvcn0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHtEaXJlY3Rpb25hbGl0eX0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHtCb29sZWFuSW5wdXQsIGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSwgTnVtYmVySW5wdXR9IGZyb20gJ0Bhbmd1bGFyL2Nkay9jb2VyY2lvbic7XG5pbXBvcnQge1BsYXRmb3JtfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtWaWV3cG9ydFJ1bGVyfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyQ29udGVudEluaXQsXG4gIEFmdGVyVmlld0luaXQsXG4gIEF0dHJpYnV0ZSxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBmb3J3YXJkUmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIFF1ZXJ5TGlzdCxcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBDYW5EaXNhYmxlLFxuICBDYW5EaXNhYmxlUmlwcGxlLFxuICBIYXNUYWJJbmRleCxcbiAgTUFUX1JJUFBMRV9HTE9CQUxfT1BUSU9OUyxcbiAgbWl4aW5EaXNhYmxlZCxcbiAgbWl4aW5EaXNhYmxlUmlwcGxlLFxuICBtaXhpblRhYkluZGV4LFxuICBSaXBwbGVDb25maWcsXG4gIFJpcHBsZUdsb2JhbE9wdGlvbnMsXG4gIFJpcHBsZVJlbmRlcmVyLFxuICBSaXBwbGVUYXJnZXQsXG4gIFRoZW1lUGFsZXR0ZSxcbn0gZnJvbSAnQGFuZ3VsYXIvbWF0ZXJpYWwvY29yZSc7XG5pbXBvcnQge0FOSU1BVElPTl9NT0RVTEVfVFlQRX0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7c3RhcnRXaXRoLCB0YWtlVW50aWx9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7TWF0SW5rQmFyfSBmcm9tICcuLi9pbmstYmFyJztcbmltcG9ydCB7TWF0UGFnaW5hdGVkVGFiSGVhZGVyLCBNYXRQYWdpbmF0ZWRUYWJIZWFkZXJJdGVtfSBmcm9tICcuLi9wYWdpbmF0ZWQtdGFiLWhlYWRlcic7XG5cbi8qKlxuICogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFRhYk5hdmAgZnVuY3Rpb25hbGl0eS5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgX01hdFRhYk5hdkJhc2VcbiAgZXh0ZW5kcyBNYXRQYWdpbmF0ZWRUYWJIZWFkZXJcbiAgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRDaGVja2VkLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3lcbntcbiAgLyoqIFF1ZXJ5IGxpc3Qgb2YgYWxsIHRhYiBsaW5rcyBvZiB0aGUgdGFiIG5hdmlnYXRpb24uICovXG4gIGFic3RyYWN0IG92ZXJyaWRlIF9pdGVtczogUXVlcnlMaXN0PE1hdFBhZ2luYXRlZFRhYkhlYWRlckl0ZW0gJiB7YWN0aXZlOiBib29sZWFufT47XG5cbiAgLyoqIEJhY2tncm91bmQgY29sb3Igb2YgdGhlIHRhYiBuYXYuICovXG4gIEBJbnB1dCgpXG4gIGdldCBiYWNrZ3JvdW5kQ29sb3IoKTogVGhlbWVQYWxldHRlIHtcbiAgICByZXR1cm4gdGhpcy5fYmFja2dyb3VuZENvbG9yO1xuICB9XG4gIHNldCBiYWNrZ3JvdW5kQ29sb3IodmFsdWU6IFRoZW1lUGFsZXR0ZSkge1xuICAgIGNvbnN0IGNsYXNzTGlzdCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3Q7XG4gICAgY2xhc3NMaXN0LnJlbW92ZShgbWF0LWJhY2tncm91bmQtJHt0aGlzLmJhY2tncm91bmRDb2xvcn1gKTtcblxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgY2xhc3NMaXN0LmFkZChgbWF0LWJhY2tncm91bmQtJHt2YWx1ZX1gKTtcbiAgICB9XG5cbiAgICB0aGlzLl9iYWNrZ3JvdW5kQ29sb3IgPSB2YWx1ZTtcbiAgfVxuICBwcml2YXRlIF9iYWNrZ3JvdW5kQ29sb3I6IFRoZW1lUGFsZXR0ZTtcblxuICAvKiogV2hldGhlciB0aGUgcmlwcGxlIGVmZmVjdCBpcyBkaXNhYmxlZCBvciBub3QuICovXG4gIEBJbnB1dCgpXG4gIGdldCBkaXNhYmxlUmlwcGxlKCkge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlUmlwcGxlO1xuICB9XG4gIHNldCBkaXNhYmxlUmlwcGxlKHZhbHVlOiBhbnkpIHtcbiAgICB0aGlzLl9kaXNhYmxlUmlwcGxlID0gY29lcmNlQm9vbGVhblByb3BlcnR5KHZhbHVlKTtcbiAgfVxuICBwcml2YXRlIF9kaXNhYmxlUmlwcGxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIFRoZW1lIGNvbG9yIG9mIHRoZSBuYXYgYmFyLiAqL1xuICBASW5wdXQoKSBjb2xvcjogVGhlbWVQYWxldHRlID0gJ3ByaW1hcnknO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGNoYW5nZURldGVjdG9yUmVmLCB2aWV3cG9ydFJ1bGVyLCBkaXIsIG5nWm9uZSwgcGxhdGZvcm0sIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9pdGVtU2VsZWN0ZWQoKSB7XG4gICAgLy8gbm9vcFxuICB9XG5cbiAgb3ZlcnJpZGUgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgIC8vIFdlIG5lZWQgdGhpcyB0byBydW4gYmVmb3JlIHRoZSBgY2hhbmdlc2Agc3Vic2NyaXB0aW9uIGluIHBhcmVudCB0byBlbnN1cmUgdGhhdCB0aGVcbiAgICAvLyBzZWxlY3RlZEluZGV4IGlzIHVwLXRvLWRhdGUgYnkgdGhlIHRpbWUgdGhlIHN1cGVyIGNsYXNzIHN0YXJ0cyBsb29raW5nIGZvciBpdC5cbiAgICB0aGlzLl9pdGVtcy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5fZGVzdHJveWVkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlQWN0aXZlTGluaygpO1xuICAgIH0pO1xuXG4gICAgc3VwZXIubmdBZnRlckNvbnRlbnRJbml0KCk7XG4gIH1cblxuICAvKiogTm90aWZpZXMgdGhlIGNvbXBvbmVudCB0aGF0IHRoZSBhY3RpdmUgbGluayBoYXMgYmVlbiBjaGFuZ2VkLiAqL1xuICB1cGRhdGVBY3RpdmVMaW5rKCkge1xuICAgIGlmICghdGhpcy5faXRlbXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuX2l0ZW1zLnRvQXJyYXkoKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpdGVtc1tpXS5hY3RpdmUpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgdGhpcy5fY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGUgaW5rIGJhciBzaG91bGQgaGlkZSBpdHNlbGYgaWYgbm8gaXRlbXMgYXJlIGFjdGl2ZS5cbiAgICB0aGlzLnNlbGVjdGVkSW5kZXggPSAtMTtcbiAgICB0aGlzLl9pbmtCYXIuaGlkZSgpO1xuICB9XG59XG5cbi8qKlxuICogTmF2aWdhdGlvbiBjb21wb25lbnQgbWF0Y2hpbmcgdGhlIHN0eWxlcyBvZiB0aGUgdGFiIGdyb3VwIGhlYWRlci5cbiAqIFByb3ZpZGVzIGFuY2hvcmVkIG5hdmlnYXRpb24gd2l0aCBhbmltYXRlZCBpbmsgYmFyLlxuICovXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbWF0LXRhYi1uYXYtYmFyXScsXG4gIGV4cG9ydEFzOiAnbWF0VGFiTmF2QmFyLCBtYXRUYWJOYXYnLFxuICBpbnB1dHM6IFsnY29sb3InXSxcbiAgdGVtcGxhdGVVcmw6ICd0YWItbmF2LWJhci5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJ3RhYi1uYXYtYmFyLmNzcyddLFxuICBob3N0OiB7XG4gICAgJ2NsYXNzJzogJ21hdC10YWItbmF2LWJhciBtYXQtdGFiLWhlYWRlcicsXG4gICAgJ1tjbGFzcy5tYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWNvbnRyb2xzLWVuYWJsZWRdJzogJ19zaG93UGFnaW5hdGlvbkNvbnRyb2xzJyxcbiAgICAnW2NsYXNzLm1hdC10YWItaGVhZGVyLXJ0bF0nOiBcIl9nZXRMYXlvdXREaXJlY3Rpb24oKSA9PSAncnRsJ1wiLFxuICAgICdbY2xhc3MubWF0LXByaW1hcnldJzogJ2NvbG9yICE9PSBcIndhcm5cIiAmJiBjb2xvciAhPT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtYWNjZW50XSc6ICdjb2xvciA9PT0gXCJhY2NlbnRcIicsXG4gICAgJ1tjbGFzcy5tYXQtd2Fybl0nOiAnY29sb3IgPT09IFwid2FyblwiJyxcbiAgfSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnZhbGlkYXRlLWRlY29yYXRvcnNcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJOYXYgZXh0ZW5kcyBfTWF0VGFiTmF2QmFzZSB7XG4gIEBDb250ZW50Q2hpbGRyZW4oZm9yd2FyZFJlZigoKSA9PiBNYXRUYWJMaW5rKSwge2Rlc2NlbmRhbnRzOiB0cnVlfSkgX2l0ZW1zOiBRdWVyeUxpc3Q8TWF0VGFiTGluaz47XG4gIEBWaWV3Q2hpbGQoTWF0SW5rQmFyLCB7c3RhdGljOiB0cnVlfSkgX2lua0JhcjogTWF0SW5rQmFyO1xuICBAVmlld0NoaWxkKCd0YWJMaXN0Q29udGFpbmVyJywge3N0YXRpYzogdHJ1ZX0pIF90YWJMaXN0Q29udGFpbmVyOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJMaXN0Jywge3N0YXRpYzogdHJ1ZX0pIF90YWJMaXN0OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJMaXN0SW5uZXInLCB7c3RhdGljOiB0cnVlfSkgX3RhYkxpc3RJbm5lcjogRWxlbWVudFJlZjtcbiAgQFZpZXdDaGlsZCgnbmV4dFBhZ2luYXRvcicpIF9uZXh0UGFnaW5hdG9yOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgncHJldmlvdXNQYWdpbmF0b3InKSBfcHJldmlvdXNQYWdpbmF0b3I6IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgZGlyOiBEaXJlY3Rpb25hbGl0eSxcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBjaGFuZ2VEZXRlY3RvclJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGRpciwgbmdab25lLCBjaGFuZ2VEZXRlY3RvclJlZiwgdmlld3BvcnRSdWxlciwgcGxhdGZvcm0sIGFuaW1hdGlvbk1vZGUpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbn1cblxuLy8gQm9pbGVycGxhdGUgZm9yIGFwcGx5aW5nIG1peGlucyB0byBNYXRUYWJMaW5rLlxuY29uc3QgX01hdFRhYkxpbmtNaXhpbkJhc2UgPSBtaXhpblRhYkluZGV4KG1peGluRGlzYWJsZVJpcHBsZShtaXhpbkRpc2FibGVkKGNsYXNzIHt9KSkpO1xuXG4vKiogQmFzZSBjbGFzcyB3aXRoIGFsbCBvZiB0aGUgYE1hdFRhYkxpbmtgIGZ1bmN0aW9uYWxpdHkuICovXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBjbGFzcyBfTWF0VGFiTGlua0Jhc2VcbiAgZXh0ZW5kcyBfTWF0VGFiTGlua01peGluQmFzZVxuICBpbXBsZW1lbnRzXG4gICAgQWZ0ZXJWaWV3SW5pdCxcbiAgICBPbkRlc3Ryb3ksXG4gICAgQ2FuRGlzYWJsZSxcbiAgICBDYW5EaXNhYmxlUmlwcGxlLFxuICAgIEhhc1RhYkluZGV4LFxuICAgIFJpcHBsZVRhcmdldCxcbiAgICBGb2N1c2FibGVPcHRpb25cbntcbiAgLyoqIFdoZXRoZXIgdGhlIHRhYiBsaW5rIGlzIGFjdGl2ZSBvciBub3QuICovXG4gIHByb3RlY3RlZCBfaXNBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgbGluayBpcyBhY3RpdmUuICovXG4gIEBJbnB1dCgpXG4gIGdldCBhY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX2lzQWN0aXZlO1xuICB9XG4gIHNldCBhY3RpdmUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBuZXdWYWx1ZSA9IGNvZXJjZUJvb2xlYW5Qcm9wZXJ0eSh2YWx1ZSk7XG5cbiAgICBpZiAobmV3VmFsdWUgIT09IHRoaXMuX2lzQWN0aXZlKSB7XG4gICAgICB0aGlzLl9pc0FjdGl2ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5fdGFiTmF2QmFyLnVwZGF0ZUFjdGl2ZUxpbmsoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmlwcGxlIGNvbmZpZ3VyYXRpb24gZm9yIHJpcHBsZXMgdGhhdCBhcmUgbGF1bmNoZWQgb24gcG9pbnRlciBkb3duLiBUaGUgcmlwcGxlIGNvbmZpZ1xuICAgKiBpcyBzZXQgdG8gdGhlIGdsb2JhbCByaXBwbGUgb3B0aW9ucyBzaW5jZSB3ZSBkb24ndCBoYXZlIGFueSBjb25maWd1cmFibGUgb3B0aW9ucyBmb3JcbiAgICogdGhlIHRhYiBsaW5rIHJpcHBsZXMuXG4gICAqIEBkb2NzLXByaXZhdGVcbiAgICovXG4gIHJpcHBsZUNvbmZpZzogUmlwcGxlQ29uZmlnICYgUmlwcGxlR2xvYmFsT3B0aW9ucztcblxuICAvKipcbiAgICogV2hldGhlciByaXBwbGVzIGFyZSBkaXNhYmxlZCBvbiBpbnRlcmFjdGlvbi5cbiAgICogQGRvY3MtcHJpdmF0ZVxuICAgKi9cbiAgZ2V0IHJpcHBsZURpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLmRpc2FibGVkIHx8XG4gICAgICB0aGlzLmRpc2FibGVSaXBwbGUgfHxcbiAgICAgIHRoaXMuX3RhYk5hdkJhci5kaXNhYmxlUmlwcGxlIHx8XG4gICAgICAhIXRoaXMucmlwcGxlQ29uZmlnLmRpc2FibGVkXG4gICAgKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgX3RhYk5hdkJhcjogX01hdFRhYk5hdkJhc2UsXG4gICAgLyoqIEBkb2NzLXByaXZhdGUgKi8gcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKSBnbG9iYWxSaXBwbGVPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zIHwgbnVsbCxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgcHJpdmF0ZSBfZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLnJpcHBsZUNvbmZpZyA9IGdsb2JhbFJpcHBsZU9wdGlvbnMgfHwge307XG4gICAgdGhpcy50YWJJbmRleCA9IHBhcnNlSW50KHRhYkluZGV4KSB8fCAwO1xuXG4gICAgaWYgKGFuaW1hdGlvbk1vZGUgPT09ICdOb29wQW5pbWF0aW9ucycpIHtcbiAgICAgIHRoaXMucmlwcGxlQ29uZmlnLmFuaW1hdGlvbiA9IHtlbnRlckR1cmF0aW9uOiAwLCBleGl0RHVyYXRpb246IDB9O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBGb2N1c2VzIHRoZSB0YWIgbGluay4gKi9cbiAgZm9jdXMoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICB0aGlzLl9mb2N1c01vbml0b3IubW9uaXRvcih0aGlzLmVsZW1lbnRSZWYpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5fZm9jdXNNb25pdG9yLnN0b3BNb25pdG9yaW5nKHRoaXMuZWxlbWVudFJlZik7XG4gIH1cblxuICBfaGFuZGxlRm9jdXMoKSB7XG4gICAgLy8gU2luY2Ugd2UgYWxsb3cgbmF2aWdhdGlvbiB0aHJvdWdoIHRhYmJpbmcgaW4gdGhlIG5hdiBiYXIsIHdlXG4gICAgLy8gaGF2ZSB0byB1cGRhdGUgdGhlIGZvY3VzZWQgaW5kZXggd2hlbmV2ZXIgdGhlIGxpbmsgcmVjZWl2ZXMgZm9jdXMuXG4gICAgdGhpcy5fdGFiTmF2QmFyLmZvY3VzSW5kZXggPSB0aGlzLl90YWJOYXZCYXIuX2l0ZW1zLnRvQXJyYXkoKS5pbmRleE9mKHRoaXMpO1xuICB9XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2FjdGl2ZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfZGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX2Rpc2FibGVSaXBwbGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX3RhYkluZGV4OiBOdW1iZXJJbnB1dDtcbn1cblxuLyoqXG4gKiBMaW5rIGluc2lkZSBvZiBhIGBtYXQtdGFiLW5hdi1iYXJgLlxuICovXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbWF0LXRhYi1saW5rXSwgW21hdFRhYkxpbmtdJyxcbiAgZXhwb3J0QXM6ICdtYXRUYWJMaW5rJyxcbiAgaW5wdXRzOiBbJ2Rpc2FibGVkJywgJ2Rpc2FibGVSaXBwbGUnLCAndGFiSW5kZXgnXSxcbiAgaG9zdDoge1xuICAgICdjbGFzcyc6ICdtYXQtdGFiLWxpbmsgbWF0LWZvY3VzLWluZGljYXRvcicsXG4gICAgJ1thdHRyLmFyaWEtY3VycmVudF0nOiAnYWN0aXZlID8gXCJwYWdlXCIgOiBudWxsJyxcbiAgICAnW2F0dHIuYXJpYS1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbYXR0ci50YWJJbmRleF0nOiAndGFiSW5kZXgnLFxuICAgICdbY2xhc3MubWF0LXRhYi1kaXNhYmxlZF0nOiAnZGlzYWJsZWQnLFxuICAgICdbY2xhc3MubWF0LXRhYi1sYWJlbC1hY3RpdmVdJzogJ2FjdGl2ZScsXG4gICAgJyhmb2N1cyknOiAnX2hhbmRsZUZvY3VzKCknLFxuICB9LFxufSlcbmV4cG9ydCBjbGFzcyBNYXRUYWJMaW5rIGV4dGVuZHMgX01hdFRhYkxpbmtCYXNlIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgLyoqIFJlZmVyZW5jZSB0byB0aGUgUmlwcGxlUmVuZGVyZXIgZm9yIHRoZSB0YWItbGluay4gKi9cbiAgcHJpdmF0ZSBfdGFiTGlua1JpcHBsZTogUmlwcGxlUmVuZGVyZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgdGFiTmF2QmFyOiBNYXRUYWJOYXYsXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChNQVRfUklQUExFX0dMT0JBTF9PUFRJT05TKSBnbG9iYWxSaXBwbGVPcHRpb25zOiBSaXBwbGVHbG9iYWxPcHRpb25zIHwgbnVsbCxcbiAgICBAQXR0cmlidXRlKCd0YWJpbmRleCcpIHRhYkluZGV4OiBzdHJpbmcsXG4gICAgZm9jdXNNb25pdG9yOiBGb2N1c01vbml0b3IsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChBTklNQVRJT05fTU9EVUxFX1RZUEUpIGFuaW1hdGlvbk1vZGU/OiBzdHJpbmcsXG4gICkge1xuICAgIHN1cGVyKHRhYk5hdkJhciwgZWxlbWVudFJlZiwgZ2xvYmFsUmlwcGxlT3B0aW9ucywgdGFiSW5kZXgsIGZvY3VzTW9uaXRvciwgYW5pbWF0aW9uTW9kZSk7XG4gICAgdGhpcy5fdGFiTGlua1JpcHBsZSA9IG5ldyBSaXBwbGVSZW5kZXJlcih0aGlzLCBuZ1pvbmUsIGVsZW1lbnRSZWYsIHBsYXRmb3JtKTtcbiAgICB0aGlzLl90YWJMaW5rUmlwcGxlLnNldHVwVHJpZ2dlckV2ZW50cyhlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgb3ZlcnJpZGUgbmdPbkRlc3Ryb3koKSB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLl90YWJMaW5rUmlwcGxlLl9yZW1vdmVUcmlnZ2VyRXZlbnRzKCk7XG4gIH1cbn1cbiIsIjxkaXYgY2xhc3M9XCJtYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uIG1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tYmVmb3JlIG1hdC1lbGV2YXRpb24tejRcIlxuICAgICAjcHJldmlvdXNQYWdpbmF0b3JcbiAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgbWF0LXJpcHBsZSBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxCZWZvcmUgfHwgZGlzYWJsZVJpcHBsZVwiXG4gICAgIFtjbGFzcy5tYXQtdGFiLWhlYWRlci1wYWdpbmF0aW9uLWRpc2FibGVkXT1cIl9kaXNhYmxlU2Nyb2xsQmVmb3JlXCJcbiAgICAgKGNsaWNrKT1cIl9oYW5kbGVQYWdpbmF0b3JDbGljaygnYmVmb3JlJylcIlxuICAgICAobW91c2Vkb3duKT1cIl9oYW5kbGVQYWdpbmF0b3JQcmVzcygnYmVmb3JlJywgJGV2ZW50KVwiXG4gICAgICh0b3VjaGVuZCk9XCJfc3RvcEludGVydmFsKClcIj5cbiAgPGRpdiBjbGFzcz1cIm1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tY2hldnJvblwiPjwvZGl2PlxuPC9kaXY+XG5cbjxkaXYgY2xhc3M9XCJtYXQtdGFiLWxpbmstY29udGFpbmVyXCIgI3RhYkxpc3RDb250YWluZXIgKGtleWRvd24pPVwiX2hhbmRsZUtleWRvd24oJGV2ZW50KVwiPlxuICA8ZGl2XG4gICAgY2xhc3M9XCJtYXQtdGFiLWxpc3RcIlxuICAgIFtjbGFzcy5fbWF0LWFuaW1hdGlvbi1ub29wYWJsZV09XCJfYW5pbWF0aW9uTW9kZSA9PT0gJ05vb3BBbmltYXRpb25zJ1wiXG4gICAgI3RhYkxpc3RcbiAgICAoY2RrT2JzZXJ2ZUNvbnRlbnQpPVwiX29uQ29udGVudENoYW5nZXMoKVwiPlxuICAgIDxkaXYgY2xhc3M9XCJtYXQtdGFiLWxpbmtzXCIgI3RhYkxpc3RJbm5lcj5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L2Rpdj5cbiAgICA8bWF0LWluay1iYXI+PC9tYXQtaW5rLWJhcj5cbiAgPC9kaXY+XG48L2Rpdj5cblxuPGRpdiBjbGFzcz1cIm1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24gbWF0LXRhYi1oZWFkZXItcGFnaW5hdGlvbi1hZnRlciBtYXQtZWxldmF0aW9uLXo0XCJcbiAgICAgI25leHRQYWdpbmF0b3JcbiAgICAgYXJpYS1oaWRkZW49XCJ0cnVlXCJcbiAgICAgbWF0LXJpcHBsZSBbbWF0UmlwcGxlRGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxBZnRlciB8fCBkaXNhYmxlUmlwcGxlXCJcbiAgICAgW2NsYXNzLm1hdC10YWItaGVhZGVyLXBhZ2luYXRpb24tZGlzYWJsZWRdPVwiX2Rpc2FibGVTY3JvbGxBZnRlclwiXG4gICAgIChtb3VzZWRvd24pPVwiX2hhbmRsZVBhZ2luYXRvclByZXNzKCdhZnRlcicsICRldmVudClcIlxuICAgICAoY2xpY2spPVwiX2hhbmRsZVBhZ2luYXRvckNsaWNrKCdhZnRlcicpXCJcbiAgICAgKHRvdWNoZW5kKT1cIl9zdG9wSW50ZXJ2YWwoKVwiPlxuICA8ZGl2IGNsYXNzPVwibWF0LXRhYi1oZWFkZXItcGFnaW5hdGlvbi1jaGV2cm9uXCI+PC9kaXY+XG48L2Rpdj5cbiJdfQ==