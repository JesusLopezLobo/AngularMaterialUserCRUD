/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as keyCodes from '@angular/cdk/keycodes';
import { _getTextWithExcludedElements, TestKey, } from '@angular/cdk/testing';
import { clearElement, createFakeEvent, dispatchFakeEvent, dispatchMouseEvent, dispatchPointerEvent, isTextInput, triggerBlur, triggerFocus, typeInElement, dispatchEvent, } from './fake-events';
/** Maps `TestKey` constants to the `keyCode` and `key` values used by native browser events. */
const keyMap = {
    [TestKey.BACKSPACE]: { keyCode: keyCodes.BACKSPACE, key: 'Backspace' },
    [TestKey.TAB]: { keyCode: keyCodes.TAB, key: 'Tab' },
    [TestKey.ENTER]: { keyCode: keyCodes.ENTER, key: 'Enter' },
    [TestKey.SHIFT]: { keyCode: keyCodes.SHIFT, key: 'Shift' },
    [TestKey.CONTROL]: { keyCode: keyCodes.CONTROL, key: 'Control' },
    [TestKey.ALT]: { keyCode: keyCodes.ALT, key: 'Alt' },
    [TestKey.ESCAPE]: { keyCode: keyCodes.ESCAPE, key: 'Escape' },
    [TestKey.PAGE_UP]: { keyCode: keyCodes.PAGE_UP, key: 'PageUp' },
    [TestKey.PAGE_DOWN]: { keyCode: keyCodes.PAGE_DOWN, key: 'PageDown' },
    [TestKey.END]: { keyCode: keyCodes.END, key: 'End' },
    [TestKey.HOME]: { keyCode: keyCodes.HOME, key: 'Home' },
    [TestKey.LEFT_ARROW]: { keyCode: keyCodes.LEFT_ARROW, key: 'ArrowLeft' },
    [TestKey.UP_ARROW]: { keyCode: keyCodes.UP_ARROW, key: 'ArrowUp' },
    [TestKey.RIGHT_ARROW]: { keyCode: keyCodes.RIGHT_ARROW, key: 'ArrowRight' },
    [TestKey.DOWN_ARROW]: { keyCode: keyCodes.DOWN_ARROW, key: 'ArrowDown' },
    [TestKey.INSERT]: { keyCode: keyCodes.INSERT, key: 'Insert' },
    [TestKey.DELETE]: { keyCode: keyCodes.DELETE, key: 'Delete' },
    [TestKey.F1]: { keyCode: keyCodes.F1, key: 'F1' },
    [TestKey.F2]: { keyCode: keyCodes.F2, key: 'F2' },
    [TestKey.F3]: { keyCode: keyCodes.F3, key: 'F3' },
    [TestKey.F4]: { keyCode: keyCodes.F4, key: 'F4' },
    [TestKey.F5]: { keyCode: keyCodes.F5, key: 'F5' },
    [TestKey.F6]: { keyCode: keyCodes.F6, key: 'F6' },
    [TestKey.F7]: { keyCode: keyCodes.F7, key: 'F7' },
    [TestKey.F8]: { keyCode: keyCodes.F8, key: 'F8' },
    [TestKey.F9]: { keyCode: keyCodes.F9, key: 'F9' },
    [TestKey.F10]: { keyCode: keyCodes.F10, key: 'F10' },
    [TestKey.F11]: { keyCode: keyCodes.F11, key: 'F11' },
    [TestKey.F12]: { keyCode: keyCodes.F12, key: 'F12' },
    [TestKey.META]: { keyCode: keyCodes.META, key: 'Meta' },
};
/** A `TestElement` implementation for unit tests. */
export class UnitTestElement {
    constructor(element, _stabilize) {
        this.element = element;
        this._stabilize = _stabilize;
    }
    /** Blur the element. */
    async blur() {
        triggerBlur(this.element);
        await this._stabilize();
    }
    /** Clear the element's input (for input and textarea elements only). */
    async clear() {
        if (!isTextInput(this.element)) {
            throw Error('Attempting to clear an invalid element');
        }
        clearElement(this.element);
        await this._stabilize();
    }
    async click(...args) {
        await this._dispatchMouseEventSequence('click', args, 0);
        await this._stabilize();
    }
    async rightClick(...args) {
        await this._dispatchMouseEventSequence('contextmenu', args, 2);
        await this._stabilize();
    }
    /** Focus the element. */
    async focus() {
        triggerFocus(this.element);
        await this._stabilize();
    }
    /** Get the computed value of the given CSS property for the element. */
    async getCssValue(property) {
        await this._stabilize();
        // TODO(mmalerba): Consider adding value normalization if we run into common cases where its
        //  needed.
        return getComputedStyle(this.element).getPropertyValue(property);
    }
    /** Hovers the mouse over the element. */
    async hover() {
        this._dispatchPointerEventIfSupported('pointerenter');
        dispatchMouseEvent(this.element, 'mouseenter');
        await this._stabilize();
    }
    /** Moves the mouse away from the element. */
    async mouseAway() {
        this._dispatchPointerEventIfSupported('pointerleave');
        dispatchMouseEvent(this.element, 'mouseleave');
        await this._stabilize();
    }
    async sendKeys(...modifiersAndKeys) {
        const args = modifiersAndKeys.map(k => (typeof k === 'number' ? keyMap[k] : k));
        typeInElement(this.element, ...args);
        await this._stabilize();
    }
    /**
     * Gets the text from the element.
     * @param options Options that affect what text is included.
     */
    async text(options) {
        await this._stabilize();
        if (options?.exclude) {
            return _getTextWithExcludedElements(this.element, options.exclude);
        }
        return (this.element.textContent || '').trim();
    }
    /** Gets the value for the given attribute from the element. */
    async getAttribute(name) {
        await this._stabilize();
        return this.element.getAttribute(name);
    }
    /** Checks whether the element has the given class. */
    async hasClass(name) {
        await this._stabilize();
        return this.element.classList.contains(name);
    }
    /** Gets the dimensions of the element. */
    async getDimensions() {
        await this._stabilize();
        return this.element.getBoundingClientRect();
    }
    /** Gets the value of a property of an element. */
    async getProperty(name) {
        await this._stabilize();
        return this.element[name];
    }
    /** Sets the value of a property of an input. */
    async setInputValue(value) {
        this.element.value = value;
        await this._stabilize();
    }
    /** Selects the options at the specified indexes inside of a native `select` element. */
    async selectOptions(...optionIndexes) {
        let hasChanged = false;
        const options = this.element.querySelectorAll('option');
        const indexes = new Set(optionIndexes); // Convert to a set to remove duplicates.
        for (let i = 0; i < options.length; i++) {
            const option = options[i];
            const wasSelected = option.selected;
            // We have to go through `option.selected`, because `HTMLSelectElement.value` doesn't
            // allow for multiple options to be selected, even in `multiple` mode.
            option.selected = indexes.has(i);
            if (option.selected !== wasSelected) {
                hasChanged = true;
                dispatchFakeEvent(this.element, 'change');
            }
        }
        if (hasChanged) {
            await this._stabilize();
        }
    }
    /** Checks whether this element matches the given selector. */
    async matchesSelector(selector) {
        await this._stabilize();
        const elementPrototype = Element.prototype;
        return (elementPrototype['matches'] || elementPrototype['msMatchesSelector']).call(this.element, selector);
    }
    /** Checks whether the element is focused. */
    async isFocused() {
        await this._stabilize();
        return document.activeElement === this.element;
    }
    /**
     * Dispatches an event with a particular name.
     * @param name Name of the event to be dispatched.
     */
    async dispatchEvent(name, data) {
        const event = createFakeEvent(name);
        if (data) {
            // tslint:disable-next-line:ban Have to use `Object.assign` to preserve the original object.
            Object.assign(event, data);
        }
        dispatchEvent(this.element, event);
        await this._stabilize();
    }
    /**
     * Dispatches a pointer event on the current element if the browser supports it.
     * @param name Name of the pointer event to be dispatched.
     * @param clientX Coordinate of the user's pointer along the X axis.
     * @param clientY Coordinate of the user's pointer along the Y axis.
     * @param button Mouse button that should be pressed when dispatching the event.
     */
    _dispatchPointerEventIfSupported(name, clientX, clientY, button) {
        // The latest versions of all browsers we support have the new `PointerEvent` API.
        // Though since we capture the two most recent versions of these browsers, we also
        // need to support Safari 12 at time of writing. Safari 12 does not have support for this,
        // so we need to conditionally create and dispatch these events based on feature detection.
        if (typeof PointerEvent !== 'undefined' && PointerEvent) {
            dispatchPointerEvent(this.element, name, clientX, clientY, { isPrimary: true, button });
        }
    }
    /** Dispatches all the events that are part of a mouse event sequence. */
    async _dispatchMouseEventSequence(name, args, button) {
        let clientX = undefined;
        let clientY = undefined;
        let modifiers = {};
        if (args.length && typeof args[args.length - 1] === 'object') {
            modifiers = args.pop();
        }
        if (args.length) {
            const { left, top, width, height } = await this.getDimensions();
            const relativeX = args[0] === 'center' ? width / 2 : args[0];
            const relativeY = args[0] === 'center' ? height / 2 : args[1];
            // Round the computed click position as decimal pixels are not
            // supported by mouse events and could lead to unexpected results.
            clientX = Math.round(left + relativeX);
            clientY = Math.round(top + relativeY);
        }
        this._dispatchPointerEventIfSupported('pointerdown', clientX, clientY, button);
        dispatchMouseEvent(this.element, 'mousedown', clientX, clientY, button, modifiers);
        this._dispatchPointerEventIfSupported('pointerup', clientX, clientY, button);
        dispatchMouseEvent(this.element, 'mouseup', clientX, clientY, button, modifiers);
        dispatchMouseEvent(this.element, name, clientX, clientY, button, modifiers);
        // This call to _stabilize should not be needed since the callers will already do that them-
        // selves. Nevertheless it breaks some tests in g3 without it. It needs to be investigated
        // why removing breaks those tests.
        await this._stabilize();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidW5pdC10ZXN0LWVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvY2RrL3Rlc3RpbmcvdGVzdGJlZC91bml0LXRlc3QtZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEtBQUssUUFBUSxNQUFNLHVCQUF1QixDQUFDO0FBQ2xELE9BQU8sRUFDTCw0QkFBNEIsRUFJNUIsT0FBTyxHQUdSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUNMLFlBQVksRUFDWixlQUFlLEVBQ2YsaUJBQWlCLEVBQ2pCLGtCQUFrQixFQUNsQixvQkFBb0IsRUFDcEIsV0FBVyxFQUNYLFdBQVcsRUFDWCxZQUFZLEVBQ1osYUFBYSxFQUNiLGFBQWEsR0FDZCxNQUFNLGVBQWUsQ0FBQztBQUV2QixnR0FBZ0c7QUFDaEcsTUFBTSxNQUFNLEdBQUc7SUFDYixDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUM7SUFDcEUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFDO0lBQ2xELENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBQztJQUN4RCxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUM7SUFDeEQsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFDO0lBQzlELENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBQztJQUNsRCxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUM7SUFDM0QsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFDO0lBQzdELENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBQztJQUNuRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUM7SUFDbEQsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFDO0lBQ3JELENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBQztJQUN0RSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUM7SUFDaEUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLFdBQVcsRUFBRSxHQUFHLEVBQUUsWUFBWSxFQUFDO0lBQ3pFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBQztJQUN0RSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxRQUFRLEVBQUM7SUFDM0QsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFDO0lBQzNELENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQztJQUMvQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUM7SUFDL0MsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDO0lBQy9DLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQztJQUMvQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUM7SUFDL0MsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFDO0lBQy9DLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBQztJQUMvQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLEdB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QUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFFLElBQUksQ0FBQyxDQUFDLENBQVksQ0FBQztZQUUxRSw4REFBOEQ7WUFDOUQsa0VBQWtFO1lBQ2xFLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsQ0FBQztZQUN2QyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLENBQUM7U0FDdkM7UUFFRCxJQUFJLENBQUMsZ0NBQWdDLENBQUMsYUFBYSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDL0Usa0JBQWtCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDbkYsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLFdBQVcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdFLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pGLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTVFLDRGQUE0RjtRQUM1RiwwRkFBMEY7UUFDMUYsbUNBQW1DO1FBQ25DLE1BQU0sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQzFCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgKiBhcyBrZXlDb2RlcyBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtcbiAgX2dldFRleHRXaXRoRXhjbHVkZWRFbGVtZW50cyxcbiAgRWxlbWVudERpbWVuc2lvbnMsXG4gIE1vZGlmaWVyS2V5cyxcbiAgVGVzdEVsZW1lbnQsXG4gIFRlc3RLZXksXG4gIFRleHRPcHRpb25zLFxuICBFdmVudERhdGEsXG59IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7XG4gIGNsZWFyRWxlbWVudCxcbiAgY3JlYXRlRmFrZUV2ZW50LFxuICBkaXNwYXRjaEZha2VFdmVudCxcbiAgZGlzcGF0Y2hNb3VzZUV2ZW50LFxuICBkaXNwYXRjaFBvaW50ZXJFdmVudCxcbiAgaXNUZXh0SW5wdXQsXG4gIHRyaWdnZXJCbHVyLFxuICB0cmlnZ2VyRm9jdXMsXG4gIHR5cGVJbkVsZW1lbnQsXG4gIGRpc3BhdGNoRXZlbnQsXG59IGZyb20gJy4vZmFrZS1ldmVudHMnO1xuXG4vKiogTWFwcyBgVGVzdEtleWAgY29uc3RhbnRzIHRvIHRoZSBga2V5Q29kZWAgYW5kIGBrZXlgIHZhbHVlcyB1c2VkIGJ5IG5hdGl2ZSBicm93c2VyIGV2ZW50cy4gKi9cbmNvbnN0IGtleU1hcCA9IHtcbiAgW1Rlc3RLZXkuQkFDS1NQQUNFXToge2tleUNvZGU6IGtleUNvZGVzLkJBQ0tTUEFDRSwga2V5OiAnQmFja3NwYWNlJ30sXG4gIFtUZXN0S2V5LlRBQl06IHtrZXlDb2RlOiBrZXlDb2Rlcy5UQUIsIGtleTogJ1RhYid9LFxuICBbVGVzdEtleS5FTlRFUl06IHtrZXlDb2RlOiBrZXlDb2Rlcy5FTlRFUiwga2V5OiAnRW50ZXInfSxcbiAgW1Rlc3RLZXkuU0hJRlRdOiB7a2V5Q29kZToga2V5Q29kZXMuU0hJRlQsIGtleTogJ1NoaWZ0J30sXG4gIFtUZXN0S2V5LkNPTlRST0xdOiB7a2V5Q29kZToga2V5Q29kZXMuQ09OVFJPTCwga2V5OiAnQ29udHJvbCd9LFxuICBbVGVzdEtleS5BTFRdOiB7a2V5Q29kZToga2V5Q29kZXMuQUxULCBrZXk6ICdBbHQnfSxcbiAgW1Rlc3RLZXkuRVNDQVBFXToge2tleUNvZGU6IGtleUNvZGVzLkVTQ0FQRSwga2V5OiAnRXNjYXBlJ30sXG4gIFtUZXN0S2V5LlBBR0VfVVBdOiB7a2V5Q29kZToga2V5Q29kZXMuUEFHRV9VUCwga2V5OiAnUGFnZVVwJ30sXG4gIFtUZXN0S2V5LlBBR0VfRE9XTl06IHtrZXlDb2RlOiBrZXlDb2Rlcy5QQUdFX0RPV04sIGtleTogJ1BhZ2VEb3duJ30sXG4gIFtUZXN0S2V5LkVORF06IHtrZXlDb2RlOiBrZXlDb2Rlcy5FTkQsIGtleTogJ0VuZCd9LFxuICBbVGVzdEtleS5IT01FXToge2tleUNvZGU6IGtleUNvZGVzLkhPTUUsIGtleTogJ0hvbWUnfSxcbiAgW1Rlc3RLZXkuTEVGVF9BUlJPV106IHtrZXlDb2RlOiBrZXlDb2Rlcy5MRUZUX0FSUk9XLCBrZXk6ICdBcnJvd0xlZnQnfSxcbiAgW1Rlc3RLZXkuVVBfQVJST1ddOiB7a2V5Q29kZToga2V5Q29kZXMuVVBfQVJST1csIGtleTogJ0Fycm93VXAnfSxcbiAgW1Rlc3RLZXkuUklHSFRfQVJST1ddOiB7a2V5Q29kZToga2V5Q29kZXMuUklHSFRfQVJST1csIGtleTogJ0Fycm93UmlnaHQnfSxcbiAgW1Rlc3RLZXkuRE9XTl9BUlJPV106IHtrZXlDb2RlOiBrZXlDb2Rlcy5ET1dOX0FSUk9XLCBrZXk6ICdBcnJvd0Rvd24nfSxcbiAgW1Rlc3RLZXkuSU5TRVJUXToge2tleUNvZGU6IGtleUNvZGVzLklOU0VSVCwga2V5OiAnSW5zZXJ0J30sXG4gIFtUZXN0S2V5LkRFTEVURV06IHtrZXlDb2RlOiBrZXlDb2Rlcy5ERUxFVEUsIGtleTogJ0RlbGV0ZSd9LFxuICBbVGVzdEtleS5GMV06IHtrZXlDb2RlOiBrZXlDb2Rlcy5GMSwga2V5OiAnRjEnfSxcbiAgW1Rlc3RLZXkuRjJdOiB7a2V5Q29kZToga2V5Q29kZXMuRjIsIGtleTogJ0YyJ30sXG4gIFtUZXN0S2V5LkYzXToge2tleUNvZGU6IGtleUNvZGVzLkYzLCBrZXk6ICdGMyd9LFxuICBbVGVzdEtleS5GNF06IHtrZXlDb2RlOiBrZXlDb2Rlcy5GNCwga2V5OiAnRjQnfSxcbiAgW1Rlc3RLZXkuRjVdOiB7a2V5Q29kZToga2V5Q29kZXMuRjUsIGtleTogJ0Y1J30sXG4gIFtUZXN0S2V5LkY2XToge2tleUNvZGU6IGtleUNvZGVzLkY2LCBrZXk6ICdGNid9LFxuICBbVGVzdEtleS5GN106IHtrZXlDb2RlOiBrZXlDb2Rlcy5GNywga2V5OiAnRjcnfSxcbiAgW1Rlc3RLZXkuRjhdOiB7a2V5Q29kZToga2V5Q29kZXMuRjgsIGtleTogJ0Y4J30sXG4gIFtUZXN0S2V5LkY5XToge2tleUNvZGU6IGtleUNvZGVzLkY5LCBrZXk6ICdGOSd9LFxuICBbVGVzdEtleS5GMTBdOiB7a2V5Q29kZToga2V5Q29kZXMuRjEwLCBrZXk6ICdGMTAnfSxcbiAgW1Rlc3RLZXkuRjExXToge2tleUNvZGU6IGtleUNvZGVzLkYxMSwga2V5OiAnRjExJ30sXG4gIFtUZXN0S2V5LkYxMl06IHtrZXlDb2RlOiBrZXlDb2Rlcy5GMTIsIGtleTogJ0YxMid9LFxuICBbVGVzdEtleS5NRVRBXToge2tleUNvZGU6IGtleUNvZGVzLk1FVEEsIGtleTogJ01ldGEnfSxcbn07XG5cbi8qKiBBIGBUZXN0RWxlbWVudGAgaW1wbGVtZW50YXRpb24gZm9yIHVuaXQgdGVzdHMuICovXG5leHBvcnQgY2xhc3MgVW5pdFRlc3RFbGVtZW50IGltcGxlbWVudHMgVGVzdEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihyZWFkb25seSBlbGVtZW50OiBFbGVtZW50LCBwcml2YXRlIF9zdGFiaWxpemU6ICgpID0+IFByb21pc2U8dm9pZD4pIHt9XG5cbiAgLyoqIEJsdXIgdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJpZ2dlckJsdXIodGhpcy5lbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgfVxuXG4gIC8qKiBDbGVhciB0aGUgZWxlbWVudCdzIGlucHV0IChmb3IgaW5wdXQgYW5kIHRleHRhcmVhIGVsZW1lbnRzIG9ubHkpLiAqL1xuICBhc3luYyBjbGVhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoIWlzVGV4dElucHV0KHRoaXMuZWxlbWVudCkpIHtcbiAgICAgIHRocm93IEVycm9yKCdBdHRlbXB0aW5nIHRvIGNsZWFyIGFuIGludmFsaWQgZWxlbWVudCcpO1xuICAgIH1cbiAgICBjbGVhckVsZW1lbnQodGhpcy5lbGVtZW50KTtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGljayB0aGUgZWxlbWVudCBhdCB0aGUgZGVmYXVsdCBsb2NhdGlvbiBmb3IgdGhlIGN1cnJlbnQgZW52aXJvbm1lbnQuIElmIHlvdSBuZWVkIHRvIGd1YXJhbnRlZVxuICAgKiB0aGUgZWxlbWVudCBpcyBjbGlja2VkIGF0IGEgc3BlY2lmaWMgbG9jYXRpb24sIGNvbnNpZGVyIHVzaW5nIGBjbGljaygnY2VudGVyJylgIG9yXG4gICAqIGBjbGljayh4LCB5KWAgaW5zdGVhZC5cbiAgICovXG4gIGNsaWNrKG1vZGlmaWVycz86IE1vZGlmaWVyS2V5cyk6IFByb21pc2U8dm9pZD47XG4gIC8qKiBDbGljayB0aGUgZWxlbWVudCBhdCB0aGUgZWxlbWVudCdzIGNlbnRlci4gKi9cbiAgY2xpY2sobG9jYXRpb246ICdjZW50ZXInLCBtb2RpZmllcnM/OiBNb2RpZmllcktleXMpOiBQcm9taXNlPHZvaWQ+O1xuICAvKipcbiAgICogQ2xpY2sgdGhlIGVsZW1lbnQgYXQgdGhlIHNwZWNpZmllZCBjb29yZGluYXRlcyByZWxhdGl2ZSB0byB0aGUgdG9wLWxlZnQgb2YgdGhlIGVsZW1lbnQuXG4gICAqIEBwYXJhbSByZWxhdGl2ZVggQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBYLWF4aXMgYXQgd2hpY2ggdG8gY2xpY2suXG4gICAqIEBwYXJhbSByZWxhdGl2ZVkgQ29vcmRpbmF0ZSB3aXRoaW4gdGhlIGVsZW1lbnQsIGFsb25nIHRoZSBZLWF4aXMgYXQgd2hpY2ggdG8gY2xpY2suXG4gICAqIEBwYXJhbSBtb2RpZmllcnMgTW9kaWZpZXIga2V5cyBoZWxkIHdoaWxlIGNsaWNraW5nXG4gICAqL1xuICBjbGljayhyZWxhdGl2ZVg6IG51bWJlciwgcmVsYXRpdmVZOiBudW1iZXIsIG1vZGlmaWVycz86IE1vZGlmaWVyS2V5cyk6IFByb21pc2U8dm9pZD47XG4gIGFzeW5jIGNsaWNrKFxuICAgIC4uLmFyZ3M6IFtNb2RpZmllcktleXM/XSB8IFsnY2VudGVyJywgTW9kaWZpZXJLZXlzP10gfCBbbnVtYmVyLCBudW1iZXIsIE1vZGlmaWVyS2V5cz9dXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2Rpc3BhdGNoTW91c2VFdmVudFNlcXVlbmNlKCdjbGljaycsIGFyZ3MsIDApO1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJpZ2h0IGNsaWNrcyBvbiB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSB0b3AtbGVmdCBvZiBpdC5cbiAgICogQHBhcmFtIHJlbGF0aXZlWCBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFgtYXhpcyBhdCB3aGljaCB0byBjbGljay5cbiAgICogQHBhcmFtIHJlbGF0aXZlWSBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFktYXhpcyBhdCB3aGljaCB0byBjbGljay5cbiAgICogQHBhcmFtIG1vZGlmaWVycyBNb2RpZmllciBrZXlzIGhlbGQgd2hpbGUgY2xpY2tpbmdcbiAgICovXG4gIHJpZ2h0Q2xpY2socmVsYXRpdmVYOiBudW1iZXIsIHJlbGF0aXZlWTogbnVtYmVyLCBtb2RpZmllcnM/OiBNb2RpZmllcktleXMpOiBQcm9taXNlPHZvaWQ+O1xuICBhc3luYyByaWdodENsaWNrKFxuICAgIC4uLmFyZ3M6IFtNb2RpZmllcktleXM/XSB8IFsnY2VudGVyJywgTW9kaWZpZXJLZXlzP10gfCBbbnVtYmVyLCBudW1iZXIsIE1vZGlmaWVyS2V5cz9dXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2Rpc3BhdGNoTW91c2VFdmVudFNlcXVlbmNlKCdjb250ZXh0bWVudScsIGFyZ3MsIDIpO1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICB9XG5cbiAgLyoqIEZvY3VzIHRoZSBlbGVtZW50LiAqL1xuICBhc3luYyBmb2N1cygpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICB0cmlnZ2VyRm9jdXModGhpcy5lbGVtZW50IGFzIEhUTUxFbGVtZW50KTtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgfVxuXG4gIC8qKiBHZXQgdGhlIGNvbXB1dGVkIHZhbHVlIG9mIHRoZSBnaXZlbiBDU1MgcHJvcGVydHkgZm9yIHRoZSBlbGVtZW50LiAqL1xuICBhc3luYyBnZXRDc3NWYWx1ZShwcm9wZXJ0eTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgICAvLyBUT0RPKG1tYWxlcmJhKTogQ29uc2lkZXIgYWRkaW5nIHZhbHVlIG5vcm1hbGl6YXRpb24gaWYgd2UgcnVuIGludG8gY29tbW9uIGNhc2VzIHdoZXJlIGl0c1xuICAgIC8vICBuZWVkZWQuXG4gICAgcmV0dXJuIGdldENvbXB1dGVkU3R5bGUodGhpcy5lbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKHByb3BlcnR5KTtcbiAgfVxuXG4gIC8qKiBIb3ZlcnMgdGhlIG1vdXNlIG92ZXIgdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIGhvdmVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuX2Rpc3BhdGNoUG9pbnRlckV2ZW50SWZTdXBwb3J0ZWQoJ3BvaW50ZXJlbnRlcicpO1xuICAgIGRpc3BhdGNoTW91c2VFdmVudCh0aGlzLmVsZW1lbnQsICdtb3VzZWVudGVyJyk7XG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gIH1cblxuICAvKiogTW92ZXMgdGhlIG1vdXNlIGF3YXkgZnJvbSB0aGUgZWxlbWVudC4gKi9cbiAgYXN5bmMgbW91c2VBd2F5KCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHRoaXMuX2Rpc3BhdGNoUG9pbnRlckV2ZW50SWZTdXBwb3J0ZWQoJ3BvaW50ZXJsZWF2ZScpO1xuICAgIGRpc3BhdGNoTW91c2VFdmVudCh0aGlzLmVsZW1lbnQsICdtb3VzZWxlYXZlJyk7XG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgdGhlIGdpdmVuIHN0cmluZyB0byB0aGUgaW5wdXQgYXMgYSBzZXJpZXMgb2Yga2V5IHByZXNzZXMuIEFsc28gZmlyZXMgaW5wdXQgZXZlbnRzXG4gICAqIGFuZCBhdHRlbXB0cyB0byBhZGQgdGhlIHN0cmluZyB0byB0aGUgRWxlbWVudCdzIHZhbHVlLiBOb3RlIHRoYXQgdGhpcyBjYW5ub3RcbiAgICogcmVwcm9kdWNlIG5hdGl2ZSBicm93c2VyIGJlaGF2aW9yIGZvciBrZXlib2FyZCBzaG9ydGN1dHMgc3VjaCBhcyBUYWIsIEN0cmwgKyBBLCBldGMuXG4gICAqL1xuICBhc3luYyBzZW5kS2V5cyguLi5rZXlzOiAoc3RyaW5nIHwgVGVzdEtleSlbXSk6IFByb21pc2U8dm9pZD47XG4gIC8qKlxuICAgKiBTZW5kcyB0aGUgZ2l2ZW4gc3RyaW5nIHRvIHRoZSBpbnB1dCBhcyBhIHNlcmllcyBvZiBrZXkgcHJlc3Nlcy4gQWxzbyBmaXJlcyBpbnB1dCBldmVudHNcbiAgICogYW5kIGF0dGVtcHRzIHRvIGFkZCB0aGUgc3RyaW5nIHRvIHRoZSBFbGVtZW50J3MgdmFsdWUuXG4gICAqL1xuICBhc3luYyBzZW5kS2V5cyhtb2RpZmllcnM6IE1vZGlmaWVyS2V5cywgLi4ua2V5czogKHN0cmluZyB8IFRlc3RLZXkpW10pOiBQcm9taXNlPHZvaWQ+O1xuICBhc3luYyBzZW5kS2V5cyguLi5tb2RpZmllcnNBbmRLZXlzOiBhbnlbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGFyZ3MgPSBtb2RpZmllcnNBbmRLZXlzLm1hcChrID0+ICh0eXBlb2YgayA9PT0gJ251bWJlcicgPyBrZXlNYXBbayBhcyBUZXN0S2V5XSA6IGspKTtcbiAgICB0eXBlSW5FbGVtZW50KHRoaXMuZWxlbWVudCBhcyBIVE1MRWxlbWVudCwgLi4uYXJncyk7XG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogR2V0cyB0aGUgdGV4dCBmcm9tIHRoZSBlbGVtZW50LlxuICAgKiBAcGFyYW0gb3B0aW9ucyBPcHRpb25zIHRoYXQgYWZmZWN0IHdoYXQgdGV4dCBpcyBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIHRleHQob3B0aW9ucz86IFRleHRPcHRpb25zKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgICBpZiAob3B0aW9ucz8uZXhjbHVkZSkge1xuICAgICAgcmV0dXJuIF9nZXRUZXh0V2l0aEV4Y2x1ZGVkRWxlbWVudHModGhpcy5lbGVtZW50LCBvcHRpb25zLmV4Y2x1ZGUpO1xuICAgIH1cbiAgICByZXR1cm4gKHRoaXMuZWxlbWVudC50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIGZvciB0aGUgZ2l2ZW4gYXR0cmlidXRlIGZyb20gdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIGdldEF0dHJpYnV0ZShuYW1lOiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgZWxlbWVudCBoYXMgdGhlIGdpdmVuIGNsYXNzLiAqL1xuICBhc3luYyBoYXNDbGFzcyhuYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucyhuYW1lKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBlbGVtZW50LiAqL1xuICBhc3luYyBnZXREaW1lbnNpb25zKCk6IFByb21pc2U8RWxlbWVudERpbWVuc2lvbnM+IHtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgb2YgYW4gZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0UHJvcGVydHk8VCA9IGFueT4obmFtZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gICAgcmV0dXJuICh0aGlzLmVsZW1lbnQgYXMgYW55KVtuYW1lXTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IG9mIGFuIGlucHV0LiAqL1xuICBhc3luYyBzZXRJbnB1dFZhbHVlKHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAodGhpcy5lbGVtZW50IGFzIGFueSkudmFsdWUgPSB2YWx1ZTtcbiAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBvcHRpb25zIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhlcyBpbnNpZGUgb2YgYSBuYXRpdmUgYHNlbGVjdGAgZWxlbWVudC4gKi9cbiAgYXN5bmMgc2VsZWN0T3B0aW9ucyguLi5vcHRpb25JbmRleGVzOiBudW1iZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGxldCBoYXNDaGFuZ2VkID0gZmFsc2U7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdvcHRpb24nKTtcbiAgICBjb25zdCBpbmRleGVzID0gbmV3IFNldChvcHRpb25JbmRleGVzKTsgLy8gQ29udmVydCB0byBhIHNldCB0byByZW1vdmUgZHVwbGljYXRlcy5cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3B0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3Qgb3B0aW9uID0gb3B0aW9uc1tpXTtcbiAgICAgIGNvbnN0IHdhc1NlbGVjdGVkID0gb3B0aW9uLnNlbGVjdGVkO1xuXG4gICAgICAvLyBXZSBoYXZlIHRvIGdvIHRocm91Z2ggYG9wdGlvbi5zZWxlY3RlZGAsIGJlY2F1c2UgYEhUTUxTZWxlY3RFbGVtZW50LnZhbHVlYCBkb2Vzbid0XG4gICAgICAvLyBhbGxvdyBmb3IgbXVsdGlwbGUgb3B0aW9ucyB0byBiZSBzZWxlY3RlZCwgZXZlbiBpbiBgbXVsdGlwbGVgIG1vZGUuXG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSBpbmRleGVzLmhhcyhpKTtcblxuICAgICAgaWYgKG9wdGlvbi5zZWxlY3RlZCAhPT0gd2FzU2VsZWN0ZWQpIHtcbiAgICAgICAgaGFzQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgIGRpc3BhdGNoRmFrZUV2ZW50KHRoaXMuZWxlbWVudCwgJ2NoYW5nZScpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChoYXNDaGFuZ2VkKSB7XG4gICAgICBhd2FpdCB0aGlzLl9zdGFiaWxpemUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhpcyBlbGVtZW50IG1hdGNoZXMgdGhlIGdpdmVuIHNlbGVjdG9yLiAqL1xuICBhc3luYyBtYXRjaGVzU2VsZWN0b3Ioc2VsZWN0b3I6IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICAgIGNvbnN0IGVsZW1lbnRQcm90b3R5cGUgPSBFbGVtZW50LnByb3RvdHlwZSBhcyBhbnk7XG4gICAgcmV0dXJuIChlbGVtZW50UHJvdG90eXBlWydtYXRjaGVzJ10gfHwgZWxlbWVudFByb3RvdHlwZVsnbXNNYXRjaGVzU2VsZWN0b3InXSkuY2FsbChcbiAgICAgIHRoaXMuZWxlbWVudCxcbiAgICAgIHNlbGVjdG9yLFxuICAgICk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICAgIHJldHVybiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLmVsZW1lbnQ7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhbiBldmVudCB3aXRoIGEgcGFydGljdWxhciBuYW1lLlxuICAgKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBiZSBkaXNwYXRjaGVkLlxuICAgKi9cbiAgYXN5bmMgZGlzcGF0Y2hFdmVudChuYW1lOiBzdHJpbmcsIGRhdGE/OiBSZWNvcmQ8c3RyaW5nLCBFdmVudERhdGE+KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZXZlbnQgPSBjcmVhdGVGYWtlRXZlbnQobmFtZSk7XG5cbiAgICBpZiAoZGF0YSkge1xuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmJhbiBIYXZlIHRvIHVzZSBgT2JqZWN0LmFzc2lnbmAgdG8gcHJlc2VydmUgdGhlIG9yaWdpbmFsIG9iamVjdC5cbiAgICAgIE9iamVjdC5hc3NpZ24oZXZlbnQsIGRhdGEpO1xuICAgIH1cblxuICAgIGRpc3BhdGNoRXZlbnQodGhpcy5lbGVtZW50LCBldmVudCk7XG4gICAgYXdhaXQgdGhpcy5fc3RhYmlsaXplKCk7XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2hlcyBhIHBvaW50ZXIgZXZlbnQgb24gdGhlIGN1cnJlbnQgZWxlbWVudCBpZiB0aGUgYnJvd3NlciBzdXBwb3J0cyBpdC5cbiAgICogQHBhcmFtIG5hbWUgTmFtZSBvZiB0aGUgcG9pbnRlciBldmVudCB0byBiZSBkaXNwYXRjaGVkLlxuICAgKiBAcGFyYW0gY2xpZW50WCBDb29yZGluYXRlIG9mIHRoZSB1c2VyJ3MgcG9pbnRlciBhbG9uZyB0aGUgWCBheGlzLlxuICAgKiBAcGFyYW0gY2xpZW50WSBDb29yZGluYXRlIG9mIHRoZSB1c2VyJ3MgcG9pbnRlciBhbG9uZyB0aGUgWSBheGlzLlxuICAgKiBAcGFyYW0gYnV0dG9uIE1vdXNlIGJ1dHRvbiB0aGF0IHNob3VsZCBiZSBwcmVzc2VkIHdoZW4gZGlzcGF0Y2hpbmcgdGhlIGV2ZW50LlxuICAgKi9cbiAgcHJpdmF0ZSBfZGlzcGF0Y2hQb2ludGVyRXZlbnRJZlN1cHBvcnRlZChcbiAgICBuYW1lOiBzdHJpbmcsXG4gICAgY2xpZW50WD86IG51bWJlcixcbiAgICBjbGllbnRZPzogbnVtYmVyLFxuICAgIGJ1dHRvbj86IG51bWJlcixcbiAgKSB7XG4gICAgLy8gVGhlIGxhdGVzdCB2ZXJzaW9ucyBvZiBhbGwgYnJvd3NlcnMgd2Ugc3VwcG9ydCBoYXZlIHRoZSBuZXcgYFBvaW50ZXJFdmVudGAgQVBJLlxuICAgIC8vIFRob3VnaCBzaW5jZSB3ZSBjYXB0dXJlIHRoZSB0d28gbW9zdCByZWNlbnQgdmVyc2lvbnMgb2YgdGhlc2UgYnJvd3NlcnMsIHdlIGFsc29cbiAgICAvLyBuZWVkIHRvIHN1cHBvcnQgU2FmYXJpIDEyIGF0IHRpbWUgb2Ygd3JpdGluZy4gU2FmYXJpIDEyIGRvZXMgbm90IGhhdmUgc3VwcG9ydCBmb3IgdGhpcyxcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIGNvbmRpdGlvbmFsbHkgY3JlYXRlIGFuZCBkaXNwYXRjaCB0aGVzZSBldmVudHMgYmFzZWQgb24gZmVhdHVyZSBkZXRlY3Rpb24uXG4gICAgaWYgKHR5cGVvZiBQb2ludGVyRXZlbnQgIT09ICd1bmRlZmluZWQnICYmIFBvaW50ZXJFdmVudCkge1xuICAgICAgZGlzcGF0Y2hQb2ludGVyRXZlbnQodGhpcy5lbGVtZW50LCBuYW1lLCBjbGllbnRYLCBjbGllbnRZLCB7aXNQcmltYXJ5OiB0cnVlLCBidXR0b259KTtcbiAgICB9XG4gIH1cblxuICAvKiogRGlzcGF0Y2hlcyBhbGwgdGhlIGV2ZW50cyB0aGF0IGFyZSBwYXJ0IG9mIGEgbW91c2UgZXZlbnQgc2VxdWVuY2UuICovXG4gIHByaXZhdGUgYXN5bmMgX2Rpc3BhdGNoTW91c2VFdmVudFNlcXVlbmNlKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBhcmdzOiBbTW9kaWZpZXJLZXlzP10gfCBbJ2NlbnRlcicsIE1vZGlmaWVyS2V5cz9dIHwgW251bWJlciwgbnVtYmVyLCBNb2RpZmllcktleXM/XSxcbiAgICBidXR0b24/OiBudW1iZXIsXG4gICkge1xuICAgIGxldCBjbGllbnRYOiBudW1iZXIgfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgbGV0IGNsaWVudFk6IG51bWJlciB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgICBsZXQgbW9kaWZpZXJzOiBNb2RpZmllcktleXMgPSB7fTtcblxuICAgIGlmIChhcmdzLmxlbmd0aCAmJiB0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnb2JqZWN0Jykge1xuICAgICAgbW9kaWZpZXJzID0gYXJncy5wb3AoKSBhcyBNb2RpZmllcktleXM7XG4gICAgfVxuXG4gICAgaWYgKGFyZ3MubGVuZ3RoKSB7XG4gICAgICBjb25zdCB7bGVmdCwgdG9wLCB3aWR0aCwgaGVpZ2h0fSA9IGF3YWl0IHRoaXMuZ2V0RGltZW5zaW9ucygpO1xuICAgICAgY29uc3QgcmVsYXRpdmVYID0gYXJnc1swXSA9PT0gJ2NlbnRlcicgPyB3aWR0aCAvIDIgOiAoYXJnc1swXSBhcyBudW1iZXIpO1xuICAgICAgY29uc3QgcmVsYXRpdmVZID0gYXJnc1swXSA9PT0gJ2NlbnRlcicgPyBoZWlnaHQgLyAyIDogKGFyZ3NbMV0gYXMgbnVtYmVyKTtcblxuICAgICAgLy8gUm91bmQgdGhlIGNvbXB1dGVkIGNsaWNrIHBvc2l0aW9uIGFzIGRlY2ltYWwgcGl4ZWxzIGFyZSBub3RcbiAgICAgIC8vIHN1cHBvcnRlZCBieSBtb3VzZSBldmVudHMgYW5kIGNvdWxkIGxlYWQgdG8gdW5leHBlY3RlZCByZXN1bHRzLlxuICAgICAgY2xpZW50WCA9IE1hdGgucm91bmQobGVmdCArIHJlbGF0aXZlWCk7XG4gICAgICBjbGllbnRZID0gTWF0aC5yb3VuZCh0b3AgKyByZWxhdGl2ZVkpO1xuICAgIH1cblxuICAgIHRoaXMuX2Rpc3BhdGNoUG9pbnRlckV2ZW50SWZTdXBwb3J0ZWQoJ3BvaW50ZXJkb3duJywgY2xpZW50WCwgY2xpZW50WSwgYnV0dG9uKTtcbiAgICBkaXNwYXRjaE1vdXNlRXZlbnQodGhpcy5lbGVtZW50LCAnbW91c2Vkb3duJywgY2xpZW50WCwgY2xpZW50WSwgYnV0dG9uLCBtb2RpZmllcnMpO1xuICAgIHRoaXMuX2Rpc3BhdGNoUG9pbnRlckV2ZW50SWZTdXBwb3J0ZWQoJ3BvaW50ZXJ1cCcsIGNsaWVudFgsIGNsaWVudFksIGJ1dHRvbik7XG4gICAgZGlzcGF0Y2hNb3VzZUV2ZW50KHRoaXMuZWxlbWVudCwgJ21vdXNldXAnLCBjbGllbnRYLCBjbGllbnRZLCBidXR0b24sIG1vZGlmaWVycyk7XG4gICAgZGlzcGF0Y2hNb3VzZUV2ZW50KHRoaXMuZWxlbWVudCwgbmFtZSwgY2xpZW50WCwgY2xpZW50WSwgYnV0dG9uLCBtb2RpZmllcnMpO1xuXG4gICAgLy8gVGhpcyBjYWxsIHRvIF9zdGFiaWxpemUgc2hvdWxkIG5vdCBiZSBuZWVkZWQgc2luY2UgdGhlIGNhbGxlcnMgd2lsbCBhbHJlYWR5IGRvIHRoYXQgdGhlbS1cbiAgICAvLyBzZWx2ZXMuIE5ldmVydGhlbGVzcyBpdCBicmVha3Mgc29tZSB0ZXN0cyBpbiBnMyB3aXRob3V0IGl0LiBJdCBuZWVkcyB0byBiZSBpbnZlc3RpZ2F0ZWRcbiAgICAvLyB3aHkgcmVtb3ZpbmcgYnJlYWtzIHRob3NlIHRlc3RzLlxuICAgIGF3YWl0IHRoaXMuX3N0YWJpbGl6ZSgpO1xuICB9XG59XG4iXX0=