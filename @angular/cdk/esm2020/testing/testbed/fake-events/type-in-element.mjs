/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { PERIOD } from '@angular/cdk/keycodes';
import { dispatchFakeEvent, dispatchKeyboardEvent } from './dispatch-events';
import { triggerFocus } from './element-focus';
/** Input types for which the value can be entered incrementally. */
const incrementalInputTypes = new Set([
    'text',
    'email',
    'hidden',
    'password',
    'search',
    'tel',
    'url',
]);
/**
 * Checks whether the given Element is a text input element.
 * @docs-private
 */
export function isTextInput(element) {
    const nodeName = element.nodeName.toLowerCase();
    return nodeName === 'input' || nodeName === 'textarea';
}
export function typeInElement(element, ...modifiersAndKeys) {
    const first = modifiersAndKeys[0];
    let modifiers;
    let rest;
    if (typeof first !== 'string' && first.keyCode === undefined && first.key === undefined) {
        modifiers = first;
        rest = modifiersAndKeys.slice(1);
    }
    else {
        modifiers = {};
        rest = modifiersAndKeys;
    }
    const isInput = isTextInput(element);
    const inputType = element.getAttribute('type') || 'text';
    const keys = rest
        .map(k => typeof k === 'string'
        ? k.split('').map(c => ({ keyCode: c.toUpperCase().charCodeAt(0), key: c }))
        : [k])
        .reduce((arr, k) => arr.concat(k), []);
    // We simulate the user typing in a value by incrementally assigning the value below. The problem
    // is that for some input types, the browser won't allow for an invalid value to be set via the
    // `value` property which will always be the case when going character-by-character. If we detect
    // such an input, we have to set the value all at once or listeners to the `input` event (e.g.
    // the `ReactiveFormsModule` uses such an approach) won't receive the correct value.
    const enterValueIncrementally = inputType === 'number' && keys.length > 0
        ? // The value can be set character by character in number inputs if it doesn't have any decimals.
            keys.every(key => key.key !== '.' && key.keyCode !== PERIOD)
        : incrementalInputTypes.has(inputType);
    triggerFocus(element);
    // When we aren't entering the value incrementally, assign it all at once ahead
    // of time so that any listeners to the key events below will have access to it.
    if (!enterValueIncrementally) {
        element.value = keys.reduce((value, key) => value + (key.key || ''), '');
    }
    for (const key of keys) {
        dispatchKeyboardEvent(element, 'keydown', key.keyCode, key.key, modifiers);
        dispatchKeyboardEvent(element, 'keypress', key.keyCode, key.key, modifiers);
        if (isInput && key.key && key.key.length === 1) {
            if (enterValueIncrementally) {
                element.value += key.key;
                dispatchFakeEvent(element, 'input');
            }
        }
        dispatchKeyboardEvent(element, 'keyup', key.keyCode, key.key, modifiers);
    }
    // Since we weren't dispatching `input` events while sending the keys, we have to do it now.
    if (!enterValueIncrementally) {
        dispatchFakeEvent(element, 'input');
    }
}
/**
 * Clears the text in an input or textarea element.
 * @docs-private
 */
export function clearElement(element) {
    triggerFocus(element);
    element.value = '';
    dispatchFakeEvent(element, 'input');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZS1pbi1lbGVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90ZXN0aW5nL3Rlc3RiZWQvZmFrZS1ldmVudHMvdHlwZS1pbi1lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdILE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSx1QkFBdUIsQ0FBQztBQUM3QyxPQUFPLEVBQUMsaUJBQWlCLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUMzRSxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFFN0Msb0VBQW9FO0FBQ3BFLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxHQUFHLENBQUM7SUFDcEMsTUFBTTtJQUNOLE9BQU87SUFDUCxRQUFRO0lBQ1IsVUFBVTtJQUNWLFFBQVE7SUFDUixLQUFLO0lBQ0wsS0FBSztDQUNOLENBQUMsQ0FBQztBQUVIOzs7R0FHRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQUMsT0FBZ0I7SUFDMUMsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNoRCxPQUFPLFFBQVEsS0FBSyxPQUFPLElBQUksUUFBUSxLQUFLLFVBQVUsQ0FBQztBQUN6RCxDQUFDO0FBNEJELE1BQU0sVUFBVSxhQUFhLENBQUMsT0FBb0IsRUFBRSxHQUFHLGdCQUFxQjtJQUMxRSxNQUFNLEtBQUssR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQyxJQUFJLFNBQXVCLENBQUM7SUFDNUIsSUFBSSxJQUFtRCxDQUFDO0lBQ3hELElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLEtBQUssU0FBUyxJQUFJLEtBQUssQ0FBQyxHQUFHLEtBQUssU0FBUyxFQUFFO1FBQ3ZGLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsSUFB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QUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUFDLE9BQStDO0lBQzFFLFlBQVksQ0FBQyxPQUFzQixDQUFDLENBQUM7SUFDckMsT0FBTyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDbkIsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtNb2RpZmllcktleXN9IGZyb20gJ0Bhbmd1bGFyL2Nkay90ZXN0aW5nJztcbmltcG9ydCB7UEVSSU9EfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHtkaXNwYXRjaEZha2VFdmVudCwgZGlzcGF0Y2hLZXlib2FyZEV2ZW50fSBmcm9tICcuL2Rpc3BhdGNoLWV2ZW50cyc7XG5pbXBvcnQge3RyaWdnZXJGb2N1c30gZnJvbSAnLi9lbGVtZW50LWZvY3VzJztcblxuLyoqIElucHV0IHR5cGVzIGZvciB3aGljaCB0aGUgdmFsdWUgY2FuIGJlIGVudGVyZWQgaW5jcmVtZW50YWxseS4gKi9cbmNvbnN0IGluY3JlbWVudGFsSW5wdXRUeXBlcyA9IG5ldyBTZXQoW1xuICAndGV4dCcsXG4gICdlbWFpbCcsXG4gICdoaWRkZW4nLFxuICAncGFzc3dvcmQnLFxuICAnc2VhcmNoJyxcbiAgJ3RlbCcsXG4gICd1cmwnLFxuXSk7XG5cbi8qKlxuICogQ2hlY2tzIHdoZXRoZXIgdGhlIGdpdmVuIEVsZW1lbnQgaXMgYSB0ZXh0IGlucHV0IGVsZW1lbnQuXG4gKiBAZG9jcy1wcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1RleHRJbnB1dChlbGVtZW50OiBFbGVtZW50KTogZWxlbWVudCBpcyBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCB7XG4gIGNvbnN0IG5vZGVOYW1lID0gZWxlbWVudC5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xuICByZXR1cm4gbm9kZU5hbWUgPT09ICdpbnB1dCcgfHwgbm9kZU5hbWUgPT09ICd0ZXh0YXJlYSc7XG59XG5cbi8qKlxuICogRm9jdXNlcyBhbiBpbnB1dCwgc2V0cyBpdHMgdmFsdWUgYW5kIGRpc3BhdGNoZXNcbiAqIHRoZSBgaW5wdXRgIGV2ZW50LCBzaW11bGF0aW5nIHRoZSB1c2VyIHR5cGluZy5cbiAqIEBwYXJhbSBlbGVtZW50IEVsZW1lbnQgb250byB3aGljaCB0byBzZXQgdGhlIHZhbHVlLlxuICogQHBhcmFtIGtleXMgVGhlIGtleXMgdG8gc2VuZCB0byB0aGUgZWxlbWVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR5cGVJbkVsZW1lbnQoXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAuLi5rZXlzOiAoc3RyaW5nIHwge2tleUNvZGU/OiBudW1iZXI7IGtleT86IHN0cmluZ30pW11cbik6IHZvaWQ7XG5cbi8qKlxuICogRm9jdXNlcyBhbiBpbnB1dCwgc2V0cyBpdHMgdmFsdWUgYW5kIGRpc3BhdGNoZXNcbiAqIHRoZSBgaW5wdXRgIGV2ZW50LCBzaW11bGF0aW5nIHRoZSB1c2VyIHR5cGluZy5cbiAqIEBwYXJhbSBlbGVtZW50IEVsZW1lbnQgb250byB3aGljaCB0byBzZXQgdGhlIHZhbHVlLlxuICogQHBhcmFtIG1vZGlmaWVycyBNb2RpZmllciBrZXlzIHRoYXQgYXJlIGhlbGQgd2hpbGUgdHlwaW5nLlxuICogQHBhcmFtIGtleXMgVGhlIGtleXMgdG8gc2VuZCB0byB0aGUgZWxlbWVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR5cGVJbkVsZW1lbnQoXG4gIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICBtb2RpZmllcnM6IE1vZGlmaWVyS2V5cyxcbiAgLi4ua2V5czogKHN0cmluZyB8IHtrZXlDb2RlPzogbnVtYmVyOyBrZXk/OiBzdHJpbmd9KVtdXG4pOiB2b2lkO1xuXG5leHBvcnQgZnVuY3Rpb24gdHlwZUluRWxlbWVudChlbGVtZW50OiBIVE1MRWxlbWVudCwgLi4ubW9kaWZpZXJzQW5kS2V5czogYW55KSB7XG4gIGNvbnN0IGZpcnN0ID0gbW9kaWZpZXJzQW5kS2V5c1swXTtcbiAgbGV0IG1vZGlmaWVyczogTW9kaWZpZXJLZXlzO1xuICBsZXQgcmVzdDogKHN0cmluZyB8IHtrZXlDb2RlPzogbnVtYmVyOyBrZXk/OiBzdHJpbmd9KVtdO1xuICBpZiAodHlwZW9mIGZpcnN0ICE9PSAnc3RyaW5nJyAmJiBmaXJzdC5rZXlDb2RlID09PSB1bmRlZmluZWQgJiYgZmlyc3Qua2V5ID09PSB1bmRlZmluZWQpIHtcbiAgICBtb2RpZmllcnMgPSBmaXJzdDtcbiAgICByZXN0ID0gbW9kaWZpZXJzQW5kS2V5cy5zbGljZSgxKTtcbiAgfSBlbHNlIHtcbiAgICBtb2RpZmllcnMgPSB7fTtcbiAgICByZXN0ID0gbW9kaWZpZXJzQW5kS2V5cztcbiAgfVxuICBjb25zdCBpc0lucHV0ID0gaXNUZXh0SW5wdXQoZWxlbWVudCk7XG4gIGNvbnN0IGlucHV0VHlwZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKCd0eXBlJykgfHwgJ3RleHQnO1xuICBjb25zdCBrZXlzOiB7a2V5Q29kZT86IG51bWJlcjsga2V5Pzogc3RyaW5nfVtdID0gcmVzdFxuICAgIC5tYXAoayA9PlxuICAgICAgdHlwZW9mIGsgPT09ICdzdHJpbmcnXG4gICAgICAgID8gay5zcGxpdCgnJykubWFwKGMgPT4gKHtrZXlDb2RlOiBjLnRvVXBwZXJDYXNlKCkuY2hhckNvZGVBdCgwKSwga2V5OiBjfSkpXG4gICAgICAgIDogW2tdLFxuICAgIClcbiAgICAucmVkdWNlKChhcnIsIGspID0+IGFyci5jb25jYXQoayksIFtdKTtcblxuICAvLyBXZSBzaW11bGF0ZSB0aGUgdXNlciB0eXBpbmcgaW4gYSB2YWx1ZSBieSBpbmNyZW1lbnRhbGx5IGFzc2lnbmluZyB0aGUgdmFsdWUgYmVsb3cuIFRoZSBwcm9ibGVtXG4gIC8vIGlzIHRoYXQgZm9yIHNvbWUgaW5wdXQgdHlwZXMsIHRoZSBicm93c2VyIHdvbid0IGFsbG93IGZvciBhbiBpbnZhbGlkIHZhbHVlIHRvIGJlIHNldCB2aWEgdGhlXG4gIC8vIGB2YWx1ZWAgcHJvcGVydHkgd2hpY2ggd2lsbCBhbHdheXMgYmUgdGhlIGNhc2Ugd2hlbiBnb2luZyBjaGFyYWN0ZXItYnktY2hhcmFjdGVyLiBJZiB3ZSBkZXRlY3RcbiAgLy8gc3VjaCBhbiBpbnB1dCwgd2UgaGF2ZSB0byBzZXQgdGhlIHZhbHVlIGFsbCBhdCBvbmNlIG9yIGxpc3RlbmVycyB0byB0aGUgYGlucHV0YCBldmVudCAoZS5nLlxuICAvLyB0aGUgYFJlYWN0aXZlRm9ybXNNb2R1bGVgIHVzZXMgc3VjaCBhbiBhcHByb2FjaCkgd29uJ3QgcmVjZWl2ZSB0aGUgY29ycmVjdCB2YWx1ZS5cbiAgY29uc3QgZW50ZXJWYWx1ZUluY3JlbWVudGFsbHkgPVxuICAgIGlucHV0VHlwZSA9PT0gJ251bWJlcicgJiYga2V5cy5sZW5ndGggPiAwXG4gICAgICA/IC8vIFRoZSB2YWx1ZSBjYW4gYmUgc2V0IGNoYXJhY3RlciBieSBjaGFyYWN0ZXIgaW4gbnVtYmVyIGlucHV0cyBpZiBpdCBkb2Vzbid0IGhhdmUgYW55IGRlY2ltYWxzLlxuICAgICAgICBrZXlzLmV2ZXJ5KGtleSA9PiBrZXkua2V5ICE9PSAnLicgJiYga2V5LmtleUNvZGUgIT09IFBFUklPRClcbiAgICAgIDogaW5jcmVtZW50YWxJbnB1dFR5cGVzLmhhcyhpbnB1dFR5cGUpO1xuXG4gIHRyaWdnZXJGb2N1cyhlbGVtZW50KTtcblxuICAvLyBXaGVuIHdlIGFyZW4ndCBlbnRlcmluZyB0aGUgdmFsdWUgaW5jcmVtZW50YWxseSwgYXNzaWduIGl0IGFsbCBhdCBvbmNlIGFoZWFkXG4gIC8vIG9mIHRpbWUgc28gdGhhdCBhbnkgbGlzdGVuZXJzIHRvIHRoZSBrZXkgZXZlbnRzIGJlbG93IHdpbGwgaGF2ZSBhY2Nlc3MgdG8gaXQuXG4gIGlmICghZW50ZXJWYWx1ZUluY3JlbWVudGFsbHkpIHtcbiAgICAoZWxlbWVudCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSA9IGtleXMucmVkdWNlKCh2YWx1ZSwga2V5KSA9PiB2YWx1ZSArIChrZXkua2V5IHx8ICcnKSwgJycpO1xuICB9XG5cbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgIGRpc3BhdGNoS2V5Ym9hcmRFdmVudChlbGVtZW50LCAna2V5ZG93bicsIGtleS5rZXlDb2RlLCBrZXkua2V5LCBtb2RpZmllcnMpO1xuICAgIGRpc3BhdGNoS2V5Ym9hcmRFdmVudChlbGVtZW50LCAna2V5cHJlc3MnLCBrZXkua2V5Q29kZSwga2V5LmtleSwgbW9kaWZpZXJzKTtcbiAgICBpZiAoaXNJbnB1dCAmJiBrZXkua2V5ICYmIGtleS5rZXkubGVuZ3RoID09PSAxKSB7XG4gICAgICBpZiAoZW50ZXJWYWx1ZUluY3JlbWVudGFsbHkpIHtcbiAgICAgICAgKGVsZW1lbnQgYXMgSFRNTElucHV0RWxlbWVudCB8IEhUTUxUZXh0QXJlYUVsZW1lbnQpLnZhbHVlICs9IGtleS5rZXk7XG4gICAgICAgIGRpc3BhdGNoRmFrZUV2ZW50KGVsZW1lbnQsICdpbnB1dCcpO1xuICAgICAgfVxuICAgIH1cbiAgICBkaXNwYXRjaEtleWJvYXJkRXZlbnQoZWxlbWVudCwgJ2tleXVwJywga2V5LmtleUNvZGUsIGtleS5rZXksIG1vZGlmaWVycyk7XG4gIH1cblxuICAvLyBTaW5jZSB3ZSB3ZXJlbid0IGRpc3BhdGNoaW5nIGBpbnB1dGAgZXZlbnRzIHdoaWxlIHNlbmRpbmcgdGhlIGtleXMsIHdlIGhhdmUgdG8gZG8gaXQgbm93LlxuICBpZiAoIWVudGVyVmFsdWVJbmNyZW1lbnRhbGx5KSB7XG4gICAgZGlzcGF0Y2hGYWtlRXZlbnQoZWxlbWVudCwgJ2lucHV0Jyk7XG4gIH1cbn1cblxuLyoqXG4gKiBDbGVhcnMgdGhlIHRleHQgaW4gYW4gaW5wdXQgb3IgdGV4dGFyZWEgZWxlbWVudC5cbiAqIEBkb2NzLXByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyRWxlbWVudChlbGVtZW50OiBIVE1MSW5wdXRFbGVtZW50IHwgSFRNTFRleHRBcmVhRWxlbWVudCkge1xuICB0cmlnZ2VyRm9jdXMoZWxlbWVudCBhcyBIVE1MRWxlbWVudCk7XG4gIGVsZW1lbnQudmFsdWUgPSAnJztcbiAgZGlzcGF0Y2hGYWtlRXZlbnQoZWxlbWVudCwgJ2lucHV0Jyk7XG59XG4iXX0=