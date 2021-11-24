/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { _getTextWithExcludedElements, TestKey, } from '@angular/cdk/testing';
import { browser, Button, by, Key } from 'protractor';
/** Maps the `TestKey` constants to Protractor's `Key` constants. */
const keyMap = {
    [TestKey.BACKSPACE]: Key.BACK_SPACE,
    [TestKey.TAB]: Key.TAB,
    [TestKey.ENTER]: Key.ENTER,
    [TestKey.SHIFT]: Key.SHIFT,
    [TestKey.CONTROL]: Key.CONTROL,
    [TestKey.ALT]: Key.ALT,
    [TestKey.ESCAPE]: Key.ESCAPE,
    [TestKey.PAGE_UP]: Key.PAGE_UP,
    [TestKey.PAGE_DOWN]: Key.PAGE_DOWN,
    [TestKey.END]: Key.END,
    [TestKey.HOME]: Key.HOME,
    [TestKey.LEFT_ARROW]: Key.ARROW_LEFT,
    [TestKey.UP_ARROW]: Key.ARROW_UP,
    [TestKey.RIGHT_ARROW]: Key.ARROW_RIGHT,
    [TestKey.DOWN_ARROW]: Key.ARROW_DOWN,
    [TestKey.INSERT]: Key.INSERT,
    [TestKey.DELETE]: Key.DELETE,
    [TestKey.F1]: Key.F1,
    [TestKey.F2]: Key.F2,
    [TestKey.F3]: Key.F3,
    [TestKey.F4]: Key.F4,
    [TestKey.F5]: Key.F5,
    [TestKey.F6]: Key.F6,
    [TestKey.F7]: Key.F7,
    [TestKey.F8]: Key.F8,
    [TestKey.F9]: Key.F9,
    [TestKey.F10]: Key.F10,
    [TestKey.F11]: Key.F11,
    [TestKey.F12]: Key.F12,
    [TestKey.META]: Key.META,
};
/** Converts a `ModifierKeys` object to a list of Protractor `Key`s. */
function toProtractorModifierKeys(modifiers) {
    const result = [];
    if (modifiers.control) {
        result.push(Key.CONTROL);
    }
    if (modifiers.alt) {
        result.push(Key.ALT);
    }
    if (modifiers.shift) {
        result.push(Key.SHIFT);
    }
    if (modifiers.meta) {
        result.push(Key.META);
    }
    return result;
}
/**
 * A `TestElement` implementation for Protractor.
 * @deprecated
 * @breaking-change 13.0.0
 */
export class ProtractorElement {
    constructor(element) {
        this.element = element;
    }
    /** Blur the element. */
    async blur() {
        return browser.executeScript('arguments[0].blur()', this.element);
    }
    /** Clear the element's input (for input and textarea elements only). */
    async clear() {
        return this.element.clear();
    }
    async click(...args) {
        await this._dispatchClickEventSequence(args, Button.LEFT);
    }
    async rightClick(...args) {
        await this._dispatchClickEventSequence(args, Button.RIGHT);
    }
    /** Focus the element. */
    async focus() {
        return browser.executeScript('arguments[0].focus()', this.element);
    }
    /** Get the computed value of the given CSS property for the element. */
    async getCssValue(property) {
        return this.element.getCssValue(property);
    }
    /** Hovers the mouse over the element. */
    async hover() {
        return browser
            .actions()
            .mouseMove(await this.element.getWebElement())
            .perform();
    }
    /** Moves the mouse away from the element. */
    async mouseAway() {
        return browser
            .actions()
            .mouseMove(await this.element.getWebElement(), { x: -1, y: -1 })
            .perform();
    }
    async sendKeys(...modifiersAndKeys) {
        const first = modifiersAndKeys[0];
        let modifiers;
        let rest;
        if (typeof first !== 'string' && typeof first !== 'number') {
            modifiers = first;
            rest = modifiersAndKeys.slice(1);
        }
        else {
            modifiers = {};
            rest = modifiersAndKeys;
        }
        const modifierKeys = toProtractorModifierKeys(modifiers);
        const keys = rest
            .map(k => (typeof k === 'string' ? k.split('') : [keyMap[k]]))
            .reduce((arr, k) => arr.concat(k), [])
            // Key.chord doesn't work well with geckodriver (mozilla/geckodriver#1502),
            // so avoid it if no modifier keys are required.
            .map(k => (modifierKeys.length > 0 ? Key.chord(...modifierKeys, k) : k));
        return this.element.sendKeys(...keys);
    }
    /**
     * Gets the text from the element.
     * @param options Options that affect what text is included.
     */
    async text(options) {
        if (options?.exclude) {
            return browser.executeScript(_getTextWithExcludedElements, this.element, options.exclude);
        }
        // We don't go through Protractor's `getText`, because it excludes text from hidden elements.
        return browser.executeScript(`return (arguments[0].textContent || '').trim()`, this.element);
    }
    /** Gets the value for the given attribute from the element. */
    async getAttribute(name) {
        return browser.executeScript(`return arguments[0].getAttribute(arguments[1])`, this.element, name);
    }
    /** Checks whether the element has the given class. */
    async hasClass(name) {
        const classes = (await this.getAttribute('class')) || '';
        return new Set(classes.split(/\s+/).filter(c => c)).has(name);
    }
    /** Gets the dimensions of the element. */
    async getDimensions() {
        const { width, height } = await this.element.getSize();
        const { x: left, y: top } = await this.element.getLocation();
        return { width, height, left, top };
    }
    /** Gets the value of a property of an element. */
    async getProperty(name) {
        return browser.executeScript(`return arguments[0][arguments[1]]`, this.element, name);
    }
    /** Sets the value of a property of an input. */
    async setInputValue(value) {
        return browser.executeScript(`arguments[0].value = arguments[1]`, this.element, value);
    }
    /** Selects the options at the specified indexes inside of a native `select` element. */
    async selectOptions(...optionIndexes) {
        const options = await this.element.all(by.css('option'));
        const indexes = new Set(optionIndexes); // Convert to a set to remove duplicates.
        if (options.length && indexes.size) {
            // Reset the value so all the selected states are cleared. We can
            // reuse the input-specific method since the logic is the same.
            await this.setInputValue('');
            for (let i = 0; i < options.length; i++) {
                if (indexes.has(i)) {
                    // We have to hold the control key while clicking on options so that multiple can be
                    // selected in multi-selection mode. The key doesn't do anything for single selection.
                    await browser.actions().keyDown(Key.CONTROL).perform();
                    await options[i].click();
                    await browser.actions().keyUp(Key.CONTROL).perform();
                }
            }
        }
    }
    /** Checks whether this element matches the given selector. */
    async matchesSelector(selector) {
        return browser.executeScript(`
          return (Element.prototype.matches ||
                  Element.prototype.msMatchesSelector).call(arguments[0], arguments[1])
          `, this.element, selector);
    }
    /** Checks whether the element is focused. */
    async isFocused() {
        return this.element.equals(browser.driver.switchTo().activeElement());
    }
    /**
     * Dispatches an event with a particular name.
     * @param name Name of the event to be dispatched.
     */
    async dispatchEvent(name, data) {
        return browser.executeScript(_dispatchEvent, name, this.element, data);
    }
    /** Dispatches all the events that are part of a click event sequence. */
    async _dispatchClickEventSequence(args, button) {
        let modifiers = {};
        if (args.length && typeof args[args.length - 1] === 'object') {
            modifiers = args.pop();
        }
        const modifierKeys = toProtractorModifierKeys(modifiers);
        // Omitting the offset argument to mouseMove results in clicking the center.
        // This is the default behavior we want, so we use an empty array of offsetArgs if
        // no args remain after popping the modifiers from the args passed to this function.
        const offsetArgs = (args.length === 2 ? [{ x: args[0], y: args[1] }] : []);
        let actions = browser.actions().mouseMove(await this.element.getWebElement(), ...offsetArgs);
        for (const modifierKey of modifierKeys) {
            actions = actions.keyDown(modifierKey);
        }
        actions = actions.click(button);
        for (const modifierKey of modifierKeys) {
            actions = actions.keyUp(modifierKey);
        }
        await actions.perform();
    }
}
/**
 * Dispatches an event with a particular name and data to an element.
 * Note that this needs to be a pure function, because it gets stringified by
 * Protractor and is executed inside the browser.
 */
function _dispatchEvent(name, element, data) {
    const event = document.createEvent('Event');
    event.initEvent(name);
    if (data) {
        // tslint:disable-next-line:ban Have to use `Object.assign` to preserve the original object.
        Object.assign(event, data);
    }
    // This type has a string index signature, so we cannot access it using a dotted property access.
    element['dispatchEvent'](event);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdHJhY3Rvci1lbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90ZXN0aW5nL3Byb3RyYWN0b3IvcHJvdHJhY3Rvci1lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFDTCw0QkFBNEIsRUFJNUIsT0FBTyxHQUdSLE1BQU0sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFpQixHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFbkUsb0VBQW9FO0FBQ3BFLE1BQU0sTUFBTSxHQUFHO0lBQ2IsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxDQUFDLFVBQVU7SUFDbkMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUc7SUFDdEIsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUs7SUFDMUIsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUs7SUFDMUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU87SUFDOUIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUc7SUFDdEIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU07SUFDNUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU87SUFDOUIsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxDQUFDLFNBQVM7SUFDbEMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUc7SUFDdEIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLElBQUk7SUFDeEIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxDQUFDLFVBQVU7SUFDcEMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxDQUFDLFFBQVE7SUFDaEMsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsR0FBRyxDQUFDLFdBQVc7SUFDdEMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsR0FBRyxDQUFDLFVBQVU7SUFDcEMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU07SUFDNUIsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU07SUFDNUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDcEIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUc7SUFDdEIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLEdBQUc7SUFDdEIsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFD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QUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUV0RSxDQUFDO1FBRUYsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQztRQUU3RixLQUFLLE1BQU0sV0FBVyxJQUFJLFlBQVksRUFBRTtZQUN0QyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN4QztRQUNELE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2hDLEtBQUssTUFBTSxXQUFXLElBQUksWUFBWSxFQUFFO1lBQ3RDLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ3RDO1FBRUQsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDMUIsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILFNBQVMsY0FBYyxDQUFDLElBQVksRUFBRSxPQUFzQixFQUFFLElBQWdDO0lBQzVGLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUV0QixJQUFJLElBQUksRUFBRTtRQUNSLDRGQUE0RjtRQUM1RixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1QjtJQUVELGlHQUFpRztJQUNqRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1xuICBfZ2V0VGV4dFdpdGhFeGNsdWRlZEVsZW1lbnRzLFxuICBFbGVtZW50RGltZW5zaW9ucyxcbiAgTW9kaWZpZXJLZXlzLFxuICBUZXN0RWxlbWVudCxcbiAgVGVzdEtleSxcbiAgVGV4dE9wdGlvbnMsXG4gIEV2ZW50RGF0YSxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHticm93c2VyLCBCdXR0b24sIGJ5LCBFbGVtZW50RmluZGVyLCBLZXl9IGZyb20gJ3Byb3RyYWN0b3InO1xuXG4vKiogTWFwcyB0aGUgYFRlc3RLZXlgIGNvbnN0YW50cyB0byBQcm90cmFjdG9yJ3MgYEtleWAgY29uc3RhbnRzLiAqL1xuY29uc3Qga2V5TWFwID0ge1xuICBbVGVzdEtleS5CQUNLU1BBQ0VdOiBLZXkuQkFDS19TUEFDRSxcbiAgW1Rlc3RLZXkuVEFCXTogS2V5LlRBQixcbiAgW1Rlc3RLZXkuRU5URVJdOiBLZXkuRU5URVIsXG4gIFtUZXN0S2V5LlNISUZUXTogS2V5LlNISUZULFxuICBbVGVzdEtleS5DT05UUk9MXTogS2V5LkNPTlRST0wsXG4gIFtUZXN0S2V5LkFMVF06IEtleS5BTFQsXG4gIFtUZXN0S2V5LkVTQ0FQRV06IEtleS5FU0NBUEUsXG4gIFtUZXN0S2V5LlBBR0VfVVBdOiBLZXkuUEFHRV9VUCxcbiAgW1Rlc3RLZXkuUEFHRV9ET1dOXTogS2V5LlBBR0VfRE9XTixcbiAgW1Rlc3RLZXkuRU5EXTogS2V5LkVORCxcbiAgW1Rlc3RLZXkuSE9NRV06IEtleS5IT01FLFxuICBbVGVzdEtleS5MRUZUX0FSUk9XXTogS2V5LkFSUk9XX0xFRlQsXG4gIFtUZXN0S2V5LlVQX0FSUk9XXTogS2V5LkFSUk9XX1VQLFxuICBbVGVzdEtleS5SSUdIVF9BUlJPV106IEtleS5BUlJPV19SSUdIVCxcbiAgW1Rlc3RLZXkuRE9XTl9BUlJPV106IEtleS5BUlJPV19ET1dOLFxuICBbVGVzdEtleS5JTlNFUlRdOiBLZXkuSU5TRVJULFxuICBbVGVzdEtleS5ERUxFVEVdOiBLZXkuREVMRVRFLFxuICBbVGVzdEtleS5GMV06IEtleS5GMSxcbiAgW1Rlc3RLZXkuRjJdOiBLZXkuRjIsXG4gIFtUZXN0S2V5LkYzXTogS2V5LkYzLFxuICBbVGVzdEtleS5GNF06IEtleS5GNCxcbiAgW1Rlc3RLZXkuRjVdOiBLZXkuRjUsXG4gIFtUZXN0S2V5LkY2XTogS2V5LkY2LFxuICBbVGVzdEtleS5GN106IEtleS5GNyxcbiAgW1Rlc3RLZXkuRjhdOiBLZXkuRjgsXG4gIFtUZXN0S2V5LkY5XTogS2V5LkY5LFxuICBbVGVzdEtleS5GMTBdOiBLZXkuRjEwLFxuICBbVGVzdEtleS5GMTFdOiBLZXkuRjExLFxuICBbVGVzdEtleS5GMTJdOiBLZXkuRjEyLFxuICBbVGVzdEtleS5NRVRBXTogS2V5Lk1FVEEsXG59O1xuXG4vKiogQ29udmVydHMgYSBgTW9kaWZpZXJLZXlzYCBvYmplY3QgdG8gYSBsaXN0IG9mIFByb3RyYWN0b3IgYEtleWBzLiAqL1xuZnVuY3Rpb24gdG9Qcm90cmFjdG9yTW9kaWZpZXJLZXlzKG1vZGlmaWVyczogTW9kaWZpZXJLZXlzKTogc3RyaW5nW10ge1xuICBjb25zdCByZXN1bHQ6IHN0cmluZ1tdID0gW107XG4gIGlmIChtb2RpZmllcnMuY29udHJvbCkge1xuICAgIHJlc3VsdC5wdXNoKEtleS5DT05UUk9MKTtcbiAgfVxuICBpZiAobW9kaWZpZXJzLmFsdCkge1xuICAgIHJlc3VsdC5wdXNoKEtleS5BTFQpO1xuICB9XG4gIGlmIChtb2RpZmllcnMuc2hpZnQpIHtcbiAgICByZXN1bHQucHVzaChLZXkuU0hJRlQpO1xuICB9XG4gIGlmIChtb2RpZmllcnMubWV0YSkge1xuICAgIHJlc3VsdC5wdXNoKEtleS5NRVRBKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgYFRlc3RFbGVtZW50YCBpbXBsZW1lbnRhdGlvbiBmb3IgUHJvdHJhY3Rvci5cbiAqIEBkZXByZWNhdGVkXG4gKiBAYnJlYWtpbmctY2hhbmdlIDEzLjAuMFxuICovXG5leHBvcnQgY2xhc3MgUHJvdHJhY3RvckVsZW1lbnQgaW1wbGVtZW50cyBUZXN0RWxlbWVudCB7XG4gIGNvbnN0cnVjdG9yKHJlYWRvbmx5IGVsZW1lbnQ6IEVsZW1lbnRGaW5kZXIpIHt9XG5cbiAgLyoqIEJsdXIgdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIGJsdXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIGJyb3dzZXIuZXhlY3V0ZVNjcmlwdCgnYXJndW1lbnRzWzBdLmJsdXIoKScsIHRoaXMuZWxlbWVudCk7XG4gIH1cblxuICAvKiogQ2xlYXIgdGhlIGVsZW1lbnQncyBpbnB1dCAoZm9yIGlucHV0IGFuZCB0ZXh0YXJlYSBlbGVtZW50cyBvbmx5KS4gKi9cbiAgYXN5bmMgY2xlYXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5jbGVhcigpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsaWNrIHRoZSBlbGVtZW50IGF0IHRoZSBkZWZhdWx0IGxvY2F0aW9uIGZvciB0aGUgY3VycmVudCBlbnZpcm9ubWVudC4gSWYgeW91IG5lZWQgdG8gZ3VhcmFudGVlXG4gICAqIHRoZSBlbGVtZW50IGlzIGNsaWNrZWQgYXQgYSBzcGVjaWZpYyBsb2NhdGlvbiwgY29uc2lkZXIgdXNpbmcgYGNsaWNrKCdjZW50ZXInKWAgb3JcbiAgICogYGNsaWNrKHgsIHkpYCBpbnN0ZWFkLlxuICAgKi9cbiAgY2xpY2sobW9kaWZpZXJzPzogTW9kaWZpZXJLZXlzKTogUHJvbWlzZTx2b2lkPjtcbiAgLyoqIENsaWNrIHRoZSBlbGVtZW50IGF0IHRoZSBlbGVtZW50J3MgY2VudGVyLiAqL1xuICBjbGljayhsb2NhdGlvbjogJ2NlbnRlcicsIG1vZGlmaWVycz86IE1vZGlmaWVyS2V5cyk6IFByb21pc2U8dm9pZD47XG4gIC8qKlxuICAgKiBDbGljayB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSB0b3AtbGVmdCBvZiB0aGUgZWxlbWVudC5cbiAgICogQHBhcmFtIHJlbGF0aXZlWCBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFgtYXhpcyBhdCB3aGljaCB0byBjbGljay5cbiAgICogQHBhcmFtIHJlbGF0aXZlWSBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFktYXhpcyBhdCB3aGljaCB0byBjbGljay5cbiAgICogQHBhcmFtIG1vZGlmaWVycyBNb2RpZmllciBrZXlzIGhlbGQgd2hpbGUgY2xpY2tpbmdcbiAgICovXG4gIGNsaWNrKHJlbGF0aXZlWDogbnVtYmVyLCByZWxhdGl2ZVk6IG51bWJlciwgbW9kaWZpZXJzPzogTW9kaWZpZXJLZXlzKTogUHJvbWlzZTx2b2lkPjtcbiAgYXN5bmMgY2xpY2soXG4gICAgLi4uYXJnczogW01vZGlmaWVyS2V5cz9dIHwgWydjZW50ZXInLCBNb2RpZmllcktleXM/XSB8IFtudW1iZXIsIG51bWJlciwgTW9kaWZpZXJLZXlzP11cbiAgKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgYXdhaXQgdGhpcy5fZGlzcGF0Y2hDbGlja0V2ZW50U2VxdWVuY2UoYXJncywgQnV0dG9uLkxFRlQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJpZ2h0IGNsaWNrcyBvbiB0aGUgZWxlbWVudCBhdCB0aGUgc3BlY2lmaWVkIGNvb3JkaW5hdGVzIHJlbGF0aXZlIHRvIHRoZSB0b3AtbGVmdCBvZiBpdC5cbiAgICogQHBhcmFtIHJlbGF0aXZlWCBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFgtYXhpcyBhdCB3aGljaCB0byBjbGljay5cbiAgICogQHBhcmFtIHJlbGF0aXZlWSBDb29yZGluYXRlIHdpdGhpbiB0aGUgZWxlbWVudCwgYWxvbmcgdGhlIFktYXhpcyBhdCB3aGljaCB0byBjbGljay5cbiAgICogQHBhcmFtIG1vZGlmaWVycyBNb2RpZmllciBrZXlzIGhlbGQgd2hpbGUgY2xpY2tpbmdcbiAgICovXG4gIHJpZ2h0Q2xpY2socmVsYXRpdmVYOiBudW1iZXIsIHJlbGF0aXZlWTogbnVtYmVyLCBtb2RpZmllcnM/OiBNb2RpZmllcktleXMpOiBQcm9taXNlPHZvaWQ+O1xuICBhc3luYyByaWdodENsaWNrKFxuICAgIC4uLmFyZ3M6IFtNb2RpZmllcktleXM/XSB8IFsnY2VudGVyJywgTW9kaWZpZXJLZXlzP10gfCBbbnVtYmVyLCBudW1iZXIsIE1vZGlmaWVyS2V5cz9dXG4gICk6IFByb21pc2U8dm9pZD4ge1xuICAgIGF3YWl0IHRoaXMuX2Rpc3BhdGNoQ2xpY2tFdmVudFNlcXVlbmNlKGFyZ3MsIEJ1dHRvbi5SSUdIVCk7XG4gIH1cblxuICAvKiogRm9jdXMgdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIGZvY3VzKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBicm93c2VyLmV4ZWN1dGVTY3JpcHQoJ2FyZ3VtZW50c1swXS5mb2N1cygpJywgdGhpcy5lbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBHZXQgdGhlIGNvbXB1dGVkIHZhbHVlIG9mIHRoZSBnaXZlbiBDU1MgcHJvcGVydHkgZm9yIHRoZSBlbGVtZW50LiAqL1xuICBhc3luYyBnZXRDc3NWYWx1ZShwcm9wZXJ0eTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LmdldENzc1ZhbHVlKHByb3BlcnR5KTtcbiAgfVxuXG4gIC8qKiBIb3ZlcnMgdGhlIG1vdXNlIG92ZXIgdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIGhvdmVyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBicm93c2VyXG4gICAgICAuYWN0aW9ucygpXG4gICAgICAubW91c2VNb3ZlKGF3YWl0IHRoaXMuZWxlbWVudC5nZXRXZWJFbGVtZW50KCkpXG4gICAgICAucGVyZm9ybSgpO1xuICB9XG5cbiAgLyoqIE1vdmVzIHRoZSBtb3VzZSBhd2F5IGZyb20gdGhlIGVsZW1lbnQuICovXG4gIGFzeW5jIG1vdXNlQXdheSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gYnJvd3NlclxuICAgICAgLmFjdGlvbnMoKVxuICAgICAgLm1vdXNlTW92ZShhd2FpdCB0aGlzLmVsZW1lbnQuZ2V0V2ViRWxlbWVudCgpLCB7eDogLTEsIHk6IC0xfSlcbiAgICAgIC5wZXJmb3JtKCk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgdGhlIGdpdmVuIHN0cmluZyB0byB0aGUgaW5wdXQgYXMgYSBzZXJpZXMgb2Yga2V5IHByZXNzZXMuIEFsc28gZmlyZXMgaW5wdXQgZXZlbnRzXG4gICAqIGFuZCBhdHRlbXB0cyB0byBhZGQgdGhlIHN0cmluZyB0byB0aGUgRWxlbWVudCdzIHZhbHVlLlxuICAgKi9cbiAgYXN5bmMgc2VuZEtleXMoLi4ua2V5czogKHN0cmluZyB8IFRlc3RLZXkpW10pOiBQcm9taXNlPHZvaWQ+O1xuICAvKipcbiAgICogU2VuZHMgdGhlIGdpdmVuIHN0cmluZyB0byB0aGUgaW5wdXQgYXMgYSBzZXJpZXMgb2Yga2V5IHByZXNzZXMuIEFsc28gZmlyZXMgaW5wdXQgZXZlbnRzXG4gICAqIGFuZCBhdHRlbXB0cyB0byBhZGQgdGhlIHN0cmluZyB0byB0aGUgRWxlbWVudCdzIHZhbHVlLlxuICAgKi9cbiAgYXN5bmMgc2VuZEtleXMobW9kaWZpZXJzOiBNb2RpZmllcktleXMsIC4uLmtleXM6IChzdHJpbmcgfCBUZXN0S2V5KVtdKTogUHJvbWlzZTx2b2lkPjtcbiAgYXN5bmMgc2VuZEtleXMoLi4ubW9kaWZpZXJzQW5kS2V5czogYW55W10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBmaXJzdCA9IG1vZGlmaWVyc0FuZEtleXNbMF07XG4gICAgbGV0IG1vZGlmaWVyczogTW9kaWZpZXJLZXlzO1xuICAgIGxldCByZXN0OiAoc3RyaW5nIHwgVGVzdEtleSlbXTtcbiAgICBpZiAodHlwZW9mIGZpcnN0ICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgZmlyc3QgIT09ICdudW1iZXInKSB7XG4gICAgICBtb2RpZmllcnMgPSBmaXJzdDtcbiAgICAgIHJlc3QgPSBtb2RpZmllcnNBbmRLZXlzLnNsaWNlKDEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2RpZmllcnMgPSB7fTtcbiAgICAgIHJlc3QgPSBtb2RpZmllcnNBbmRLZXlzO1xuICAgIH1cblxuICAgIGNvbnN0IG1vZGlmaWVyS2V5cyA9IHRvUHJvdHJhY3Rvck1vZGlmaWVyS2V5cyhtb2RpZmllcnMpO1xuICAgIGNvbnN0IGtleXMgPSByZXN0XG4gICAgICAubWFwKGsgPT4gKHR5cGVvZiBrID09PSAnc3RyaW5nJyA/IGsuc3BsaXQoJycpIDogW2tleU1hcFtrXV0pKVxuICAgICAgLnJlZHVjZSgoYXJyLCBrKSA9PiBhcnIuY29uY2F0KGspLCBbXSlcbiAgICAgIC8vIEtleS5jaG9yZCBkb2Vzbid0IHdvcmsgd2VsbCB3aXRoIGdlY2tvZHJpdmVyIChtb3ppbGxhL2dlY2tvZHJpdmVyIzE1MDIpLFxuICAgICAgLy8gc28gYXZvaWQgaXQgaWYgbm8gbW9kaWZpZXIga2V5cyBhcmUgcmVxdWlyZWQuXG4gICAgICAubWFwKGsgPT4gKG1vZGlmaWVyS2V5cy5sZW5ndGggPiAwID8gS2V5LmNob3JkKC4uLm1vZGlmaWVyS2V5cywgaykgOiBrKSk7XG5cbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnNlbmRLZXlzKC4uLmtleXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIHRleHQgZnJvbSB0aGUgZWxlbWVudC5cbiAgICogQHBhcmFtIG9wdGlvbnMgT3B0aW9ucyB0aGF0IGFmZmVjdCB3aGF0IHRleHQgaXMgaW5jbHVkZWQuXG4gICAqL1xuICBhc3luYyB0ZXh0KG9wdGlvbnM/OiBUZXh0T3B0aW9ucyk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgaWYgKG9wdGlvbnM/LmV4Y2x1ZGUpIHtcbiAgICAgIHJldHVybiBicm93c2VyLmV4ZWN1dGVTY3JpcHQoX2dldFRleHRXaXRoRXhjbHVkZWRFbGVtZW50cywgdGhpcy5lbGVtZW50LCBvcHRpb25zLmV4Y2x1ZGUpO1xuICAgIH1cbiAgICAvLyBXZSBkb24ndCBnbyB0aHJvdWdoIFByb3RyYWN0b3IncyBgZ2V0VGV4dGAsIGJlY2F1c2UgaXQgZXhjbHVkZXMgdGV4dCBmcm9tIGhpZGRlbiBlbGVtZW50cy5cbiAgICByZXR1cm4gYnJvd3Nlci5leGVjdXRlU2NyaXB0KGByZXR1cm4gKGFyZ3VtZW50c1swXS50ZXh0Q29udGVudCB8fCAnJykudHJpbSgpYCwgdGhpcy5lbGVtZW50KTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSB2YWx1ZSBmb3IgdGhlIGdpdmVuIGF0dHJpYnV0ZSBmcm9tIHRoZSBlbGVtZW50LiAqL1xuICBhc3luYyBnZXRBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgcmV0dXJuIGJyb3dzZXIuZXhlY3V0ZVNjcmlwdChcbiAgICAgIGByZXR1cm4gYXJndW1lbnRzWzBdLmdldEF0dHJpYnV0ZShhcmd1bWVudHNbMV0pYCxcbiAgICAgIHRoaXMuZWxlbWVudCxcbiAgICAgIG5hbWUsXG4gICAgKTtcbiAgfVxuXG4gIC8qKiBDaGVja3Mgd2hldGhlciB0aGUgZWxlbWVudCBoYXMgdGhlIGdpdmVuIGNsYXNzLiAqL1xuICBhc3luYyBoYXNDbGFzcyhuYW1lOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICBjb25zdCBjbGFzc2VzID0gKGF3YWl0IHRoaXMuZ2V0QXR0cmlidXRlKCdjbGFzcycpKSB8fCAnJztcbiAgICByZXR1cm4gbmV3IFNldChjbGFzc2VzLnNwbGl0KC9cXHMrLykuZmlsdGVyKGMgPT4gYykpLmhhcyhuYW1lKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBlbGVtZW50LiAqL1xuICBhc3luYyBnZXREaW1lbnNpb25zKCk6IFByb21pc2U8RWxlbWVudERpbWVuc2lvbnM+IHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBhd2FpdCB0aGlzLmVsZW1lbnQuZ2V0U2l6ZSgpO1xuICAgIGNvbnN0IHt4OiBsZWZ0LCB5OiB0b3B9ID0gYXdhaXQgdGhpcy5lbGVtZW50LmdldExvY2F0aW9uKCk7XG4gICAgcmV0dXJuIHt3aWR0aCwgaGVpZ2h0LCBsZWZ0LCB0b3B9O1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIHZhbHVlIG9mIGEgcHJvcGVydHkgb2YgYW4gZWxlbWVudC4gKi9cbiAgYXN5bmMgZ2V0UHJvcGVydHk8VCA9IGFueT4obmFtZTogc3RyaW5nKTogUHJvbWlzZTxUPiB7XG4gICAgcmV0dXJuIGJyb3dzZXIuZXhlY3V0ZVNjcmlwdChgcmV0dXJuIGFyZ3VtZW50c1swXVthcmd1bWVudHNbMV1dYCwgdGhpcy5lbGVtZW50LCBuYW1lKTtcbiAgfVxuXG4gIC8qKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IG9mIGFuIGlucHV0LiAqL1xuICBhc3luYyBzZXRJbnB1dFZhbHVlKHZhbHVlOiBzdHJpbmcpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gYnJvd3Nlci5leGVjdXRlU2NyaXB0KGBhcmd1bWVudHNbMF0udmFsdWUgPSBhcmd1bWVudHNbMV1gLCB0aGlzLmVsZW1lbnQsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBTZWxlY3RzIHRoZSBvcHRpb25zIGF0IHRoZSBzcGVjaWZpZWQgaW5kZXhlcyBpbnNpZGUgb2YgYSBuYXRpdmUgYHNlbGVjdGAgZWxlbWVudC4gKi9cbiAgYXN5bmMgc2VsZWN0T3B0aW9ucyguLi5vcHRpb25JbmRleGVzOiBudW1iZXJbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBhd2FpdCB0aGlzLmVsZW1lbnQuYWxsKGJ5LmNzcygnb3B0aW9uJykpO1xuICAgIGNvbnN0IGluZGV4ZXMgPSBuZXcgU2V0KG9wdGlvbkluZGV4ZXMpOyAvLyBDb252ZXJ0IHRvIGEgc2V0IHRvIHJlbW92ZSBkdXBsaWNhdGVzLlxuXG4gICAgaWYgKG9wdGlvbnMubGVuZ3RoICYmIGluZGV4ZXMuc2l6ZSkge1xuICAgICAgLy8gUmVzZXQgdGhlIHZhbHVlIHNvIGFsbCB0aGUgc2VsZWN0ZWQgc3RhdGVzIGFyZSBjbGVhcmVkLiBXZSBjYW5cbiAgICAgIC8vIHJldXNlIHRoZSBpbnB1dC1zcGVjaWZpYyBtZXRob2Qgc2luY2UgdGhlIGxvZ2ljIGlzIHRoZSBzYW1lLlxuICAgICAgYXdhaXQgdGhpcy5zZXRJbnB1dFZhbHVlKCcnKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpbmRleGVzLmhhcyhpKSkge1xuICAgICAgICAgIC8vIFdlIGhhdmUgdG8gaG9sZCB0aGUgY29udHJvbCBrZXkgd2hpbGUgY2xpY2tpbmcgb24gb3B0aW9ucyBzbyB0aGF0IG11bHRpcGxlIGNhbiBiZVxuICAgICAgICAgIC8vIHNlbGVjdGVkIGluIG11bHRpLXNlbGVjdGlvbiBtb2RlLiBUaGUga2V5IGRvZXNuJ3QgZG8gYW55dGhpbmcgZm9yIHNpbmdsZSBzZWxlY3Rpb24uXG4gICAgICAgICAgYXdhaXQgYnJvd3Nlci5hY3Rpb25zKCkua2V5RG93bihLZXkuQ09OVFJPTCkucGVyZm9ybSgpO1xuICAgICAgICAgIGF3YWl0IG9wdGlvbnNbaV0uY2xpY2soKTtcbiAgICAgICAgICBhd2FpdCBicm93c2VyLmFjdGlvbnMoKS5rZXlVcChLZXkuQ09OVFJPTCkucGVyZm9ybSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqIENoZWNrcyB3aGV0aGVyIHRoaXMgZWxlbWVudCBtYXRjaGVzIHRoZSBnaXZlbiBzZWxlY3Rvci4gKi9cbiAgYXN5bmMgbWF0Y2hlc1NlbGVjdG9yKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gYnJvd3Nlci5leGVjdXRlU2NyaXB0KFxuICAgICAgYFxuICAgICAgICAgIHJldHVybiAoRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcyB8fFxuICAgICAgICAgICAgICAgICAgRWxlbWVudC5wcm90b3R5cGUubXNNYXRjaGVzU2VsZWN0b3IpLmNhbGwoYXJndW1lbnRzWzBdLCBhcmd1bWVudHNbMV0pXG4gICAgICAgICAgYCxcbiAgICAgIHRoaXMuZWxlbWVudCxcbiAgICAgIHNlbGVjdG9yLFxuICAgICk7XG4gIH1cblxuICAvKiogQ2hlY2tzIHdoZXRoZXIgdGhlIGVsZW1lbnQgaXMgZm9jdXNlZC4gKi9cbiAgYXN5bmMgaXNGb2N1c2VkKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQuZXF1YWxzKGJyb3dzZXIuZHJpdmVyLnN3aXRjaFRvKCkuYWN0aXZlRWxlbWVudCgpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaGVzIGFuIGV2ZW50IHdpdGggYSBwYXJ0aWN1bGFyIG5hbWUuXG4gICAqIEBwYXJhbSBuYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGJlIGRpc3BhdGNoZWQuXG4gICAqL1xuICBhc3luYyBkaXNwYXRjaEV2ZW50KG5hbWU6IHN0cmluZywgZGF0YT86IFJlY29yZDxzdHJpbmcsIEV2ZW50RGF0YT4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gYnJvd3Nlci5leGVjdXRlU2NyaXB0KF9kaXNwYXRjaEV2ZW50LCBuYW1lLCB0aGlzLmVsZW1lbnQsIGRhdGEpO1xuICB9XG5cbiAgLyoqIERpc3BhdGNoZXMgYWxsIHRoZSBldmVudHMgdGhhdCBhcmUgcGFydCBvZiBhIGNsaWNrIGV2ZW50IHNlcXVlbmNlLiAqL1xuICBwcml2YXRlIGFzeW5jIF9kaXNwYXRjaENsaWNrRXZlbnRTZXF1ZW5jZShcbiAgICBhcmdzOiBbTW9kaWZpZXJLZXlzP10gfCBbJ2NlbnRlcicsIE1vZGlmaWVyS2V5cz9dIHwgW251bWJlciwgbnVtYmVyLCBNb2RpZmllcktleXM/XSxcbiAgICBidXR0b246IHN0cmluZyxcbiAgKSB7XG4gICAgbGV0IG1vZGlmaWVyczogTW9kaWZpZXJLZXlzID0ge307XG4gICAgaWYgKGFyZ3MubGVuZ3RoICYmIHR5cGVvZiBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPT09ICdvYmplY3QnKSB7XG4gICAgICBtb2RpZmllcnMgPSBhcmdzLnBvcCgpIGFzIE1vZGlmaWVyS2V5cztcbiAgICB9XG4gICAgY29uc3QgbW9kaWZpZXJLZXlzID0gdG9Qcm90cmFjdG9yTW9kaWZpZXJLZXlzKG1vZGlmaWVycyk7XG5cbiAgICAvLyBPbWl0dGluZyB0aGUgb2Zmc2V0IGFyZ3VtZW50IHRvIG1vdXNlTW92ZSByZXN1bHRzIGluIGNsaWNraW5nIHRoZSBjZW50ZXIuXG4gICAgLy8gVGhpcyBpcyB0aGUgZGVmYXVsdCBiZWhhdmlvciB3ZSB3YW50LCBzbyB3ZSB1c2UgYW4gZW1wdHkgYXJyYXkgb2Ygb2Zmc2V0QXJncyBpZlxuICAgIC8vIG5vIGFyZ3MgcmVtYWluIGFmdGVyIHBvcHBpbmcgdGhlIG1vZGlmaWVycyBmcm9tIHRoZSBhcmdzIHBhc3NlZCB0byB0aGlzIGZ1bmN0aW9uLlxuICAgIGNvbnN0IG9mZnNldEFyZ3MgPSAoYXJncy5sZW5ndGggPT09IDIgPyBbe3g6IGFyZ3NbMF0sIHk6IGFyZ3NbMV19XSA6IFtdKSBhcyBbXG4gICAgICB7eDogbnVtYmVyOyB5OiBudW1iZXJ9LFxuICAgIF07XG5cbiAgICBsZXQgYWN0aW9ucyA9IGJyb3dzZXIuYWN0aW9ucygpLm1vdXNlTW92ZShhd2FpdCB0aGlzLmVsZW1lbnQuZ2V0V2ViRWxlbWVudCgpLCAuLi5vZmZzZXRBcmdzKTtcblxuICAgIGZvciAoY29uc3QgbW9kaWZpZXJLZXkgb2YgbW9kaWZpZXJLZXlzKSB7XG4gICAgICBhY3Rpb25zID0gYWN0aW9ucy5rZXlEb3duKG1vZGlmaWVyS2V5KTtcbiAgICB9XG4gICAgYWN0aW9ucyA9IGFjdGlvbnMuY2xpY2soYnV0dG9uKTtcbiAgICBmb3IgKGNvbnN0IG1vZGlmaWVyS2V5IG9mIG1vZGlmaWVyS2V5cykge1xuICAgICAgYWN0aW9ucyA9IGFjdGlvbnMua2V5VXAobW9kaWZpZXJLZXkpO1xuICAgIH1cblxuICAgIGF3YWl0IGFjdGlvbnMucGVyZm9ybSgpO1xuICB9XG59XG5cbi8qKlxuICogRGlzcGF0Y2hlcyBhbiBldmVudCB3aXRoIGEgcGFydGljdWxhciBuYW1lIGFuZCBkYXRhIHRvIGFuIGVsZW1lbnQuXG4gKiBOb3RlIHRoYXQgdGhpcyBuZWVkcyB0byBiZSBhIHB1cmUgZnVuY3Rpb24sIGJlY2F1c2UgaXQgZ2V0cyBzdHJpbmdpZmllZCBieVxuICogUHJvdHJhY3RvciBhbmQgaXMgZXhlY3V0ZWQgaW5zaWRlIHRoZSBicm93c2VyLlxuICovXG5mdW5jdGlvbiBfZGlzcGF0Y2hFdmVudChuYW1lOiBzdHJpbmcsIGVsZW1lbnQ6IEVsZW1lbnRGaW5kZXIsIGRhdGE/OiBSZWNvcmQ8c3RyaW5nLCBFdmVudERhdGE+KSB7XG4gIGNvbnN0IGV2ZW50ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gIGV2ZW50LmluaXRFdmVudChuYW1lKTtcblxuICBpZiAoZGF0YSkge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpiYW4gSGF2ZSB0byB1c2UgYE9iamVjdC5hc3NpZ25gIHRvIHByZXNlcnZlIHRoZSBvcmlnaW5hbCBvYmplY3QuXG4gICAgT2JqZWN0LmFzc2lnbihldmVudCwgZGF0YSk7XG4gIH1cblxuICAvLyBUaGlzIHR5cGUgaGFzIGEgc3RyaW5nIGluZGV4IHNpZ25hdHVyZSwgc28gd2UgY2Fubm90IGFjY2VzcyBpdCB1c2luZyBhIGRvdHRlZCBwcm9wZXJ0eSBhY2Nlc3MuXG4gIGVsZW1lbnRbJ2Rpc3BhdGNoRXZlbnQnXShldmVudCk7XG59XG4iXX0=