/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/** Creates a deep clone of an element. */
export function deepCloneNode(node) {
    const clone = node.cloneNode(true);
    const descendantsWithId = clone.querySelectorAll('[id]');
    const nodeName = node.nodeName.toLowerCase();
    // Remove the `id` to avoid having multiple elements with the same id on the page.
    clone.removeAttribute('id');
    for (let i = 0; i < descendantsWithId.length; i++) {
        descendantsWithId[i].removeAttribute('id');
    }
    if (nodeName === 'canvas') {
        transferCanvasData(node, clone);
    }
    else if (nodeName === 'input' || nodeName === 'select' || nodeName === 'textarea') {
        transferInputData(node, clone);
    }
    transferData('canvas', node, clone, transferCanvasData);
    transferData('input, textarea, select', node, clone, transferInputData);
    return clone;
}
/** Matches elements between an element and its clone and allows for their data to be cloned. */
function transferData(selector, node, clone, callback) {
    const descendantElements = node.querySelectorAll(selector);
    if (descendantElements.length) {
        const cloneElements = clone.querySelectorAll(selector);
        for (let i = 0; i < descendantElements.length; i++) {
            callback(descendantElements[i], cloneElements[i]);
        }
    }
}
// Counter for unique cloned radio button names.
let cloneUniqueId = 0;
/** Transfers the data of one input element to another. */
function transferInputData(source, clone) {
    // Browsers throw an error when assigning the value of a file input programmatically.
    if (clone.type !== 'file') {
        clone.value = source.value;
    }
    // Radio button `name` attributes must be unique for radio button groups
    // otherwise original radio buttons can lose their checked state
    // once the clone is inserted in the DOM.
    if (clone.type === 'radio' && clone.name) {
        clone.name = `mat-clone-${clone.name}-${cloneUniqueId++}`;
    }
}
/** Transfers the data of one canvas element to another. */
function transferCanvasData(source, clone) {
    const context = clone.getContext('2d');
    if (context) {
        // In some cases `drawImage` can throw (e.g. if the canvas size is 0x0).
        // We can't do much about it so just ignore the error.
        try {
            context.drawImage(source, 0, 0);
        }
        catch { }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xvbmUtbm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jZGsvZHJhZy1kcm9wL2Nsb25lLW5vZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsMENBQTBDO0FBQzFDLE1BQU0sVUFBVSxhQUFhLENBQUMsSUFBaUI7SUFDN0MsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQWdCLENBQUM7SUFDbEQsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUU3QyxrRkFBa0Y7SUFDbEYsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2pELGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM1QztJQUVELElBQUksUUFBUSxLQUFLLFFBQVEsRUFBRTtRQUN6QixrQkFBa0IsQ0FBQyxJQUF5QixFQUFFLEtBQTBCLENBQUMsQ0FBQztLQUMzRTtTQUFNLElBQUksUUFBUSxLQUFLLE9BQU8sSUFBSSxRQUFRLEtBQUssUUFBUSxJQUFJLFFBQVEsS0FBSyxVQUFVLEVBQUU7UUFDbkYsaUJBQWlCLENBQUMsSUFBd0IsRUFBRSxLQUF5QixDQUFDLENBQUM7S0FDeEU7SUFFRCxZQUFZLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUN4RCxZQUFZLENBQUMseUJBQXlCLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3hFLE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQUVELGdHQUFnRztBQUNoRyxTQUFTLFlBQVksQ0FDbkIsUUFBZ0IsRUFDaEIsSUFBaUIsRUFDakIsS0FBa0IsRUFDbEIsUUFBdUM7SUFFdkMsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUksUUFBUSxDQUFDLENBQUM7SUFFOUQsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUU7UUFDN0IsTUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFJLFFBQVEsQ0FBQyxDQUFDO1FBRTFELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbEQsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ25EO0tBQ0Y7QUFDSCxDQUFDO0FBRUQsZ0RBQWdEO0FBQ2hELElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUV0QiwwREFBMEQ7QUFDMUQsU0FBUyxpQkFBaUIsQ0FDeEIsTUFBaUMsRUFDakMsS0FBNEQ7SUFFNUQscUZBQXFGO0lBQ3JGLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxNQUFNLEVBQUU7UUFDekIsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO0tBQzVCO0lBRUQsd0VBQXdFO0lBQ3hFLGdFQUFnRTtJQUNoRSx5Q0FBeUM7SUFDekMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxFQUFFO1FBQ3hDLEtBQUssQ0FBQyxJQUFJLEdBQUcsYUFBYSxLQUFLLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRSxFQUFFLENBQUM7S0FDM0Q7QUFDSCxDQUFDO0FBRUQsMkRBQTJEO0FBQzNELFNBQVMsa0JBQWtCLENBQUMsTUFBeUIsRUFBRSxLQUF3QjtJQUM3RSxNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRXZDLElBQUksT0FBTyxFQUFFO1FBQ1gsd0VBQXdFO1FBQ3hFLHNEQUFzRDtRQUN0RCxJQUFJO1lBQ0YsT0FBTyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ2pDO1FBQUMsTUFBTSxHQUFFO0tBQ1g7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKiBDcmVhdGVzIGEgZGVlcCBjbG9uZSBvZiBhbiBlbGVtZW50LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZXBDbG9uZU5vZGUobm9kZTogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XG4gIGNvbnN0IGNsb25lID0gbm9kZS5jbG9uZU5vZGUodHJ1ZSkgYXMgSFRNTEVsZW1lbnQ7XG4gIGNvbnN0IGRlc2NlbmRhbnRzV2l0aElkID0gY2xvbmUucXVlcnlTZWxlY3RvckFsbCgnW2lkXScpO1xuICBjb25zdCBub2RlTmFtZSA9IG5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcblxuICAvLyBSZW1vdmUgdGhlIGBpZGAgdG8gYXZvaWQgaGF2aW5nIG11bHRpcGxlIGVsZW1lbnRzIHdpdGggdGhlIHNhbWUgaWQgb24gdGhlIHBhZ2UuXG4gIGNsb25lLnJlbW92ZUF0dHJpYnV0ZSgnaWQnKTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGRlc2NlbmRhbnRzV2l0aElkLmxlbmd0aDsgaSsrKSB7XG4gICAgZGVzY2VuZGFudHNXaXRoSWRbaV0ucmVtb3ZlQXR0cmlidXRlKCdpZCcpO1xuICB9XG5cbiAgaWYgKG5vZGVOYW1lID09PSAnY2FudmFzJykge1xuICAgIHRyYW5zZmVyQ2FudmFzRGF0YShub2RlIGFzIEhUTUxDYW52YXNFbGVtZW50LCBjbG9uZSBhcyBIVE1MQ2FudmFzRWxlbWVudCk7XG4gIH0gZWxzZSBpZiAobm9kZU5hbWUgPT09ICdpbnB1dCcgfHwgbm9kZU5hbWUgPT09ICdzZWxlY3QnIHx8IG5vZGVOYW1lID09PSAndGV4dGFyZWEnKSB7XG4gICAgdHJhbnNmZXJJbnB1dERhdGEobm9kZSBhcyBIVE1MSW5wdXRFbGVtZW50LCBjbG9uZSBhcyBIVE1MSW5wdXRFbGVtZW50KTtcbiAgfVxuXG4gIHRyYW5zZmVyRGF0YSgnY2FudmFzJywgbm9kZSwgY2xvbmUsIHRyYW5zZmVyQ2FudmFzRGF0YSk7XG4gIHRyYW5zZmVyRGF0YSgnaW5wdXQsIHRleHRhcmVhLCBzZWxlY3QnLCBub2RlLCBjbG9uZSwgdHJhbnNmZXJJbnB1dERhdGEpO1xuICByZXR1cm4gY2xvbmU7XG59XG5cbi8qKiBNYXRjaGVzIGVsZW1lbnRzIGJldHdlZW4gYW4gZWxlbWVudCBhbmQgaXRzIGNsb25lIGFuZCBhbGxvd3MgZm9yIHRoZWlyIGRhdGEgdG8gYmUgY2xvbmVkLiAqL1xuZnVuY3Rpb24gdHJhbnNmZXJEYXRhPFQgZXh0ZW5kcyBFbGVtZW50PihcbiAgc2VsZWN0b3I6IHN0cmluZyxcbiAgbm9kZTogSFRNTEVsZW1lbnQsXG4gIGNsb25lOiBIVE1MRWxlbWVudCxcbiAgY2FsbGJhY2s6IChzb3VyY2U6IFQsIGNsb25lOiBUKSA9PiB2b2lkLFxuKSB7XG4gIGNvbnN0IGRlc2NlbmRhbnRFbGVtZW50cyA9IG5vZGUucXVlcnlTZWxlY3RvckFsbDxUPihzZWxlY3Rvcik7XG5cbiAgaWYgKGRlc2NlbmRhbnRFbGVtZW50cy5sZW5ndGgpIHtcbiAgICBjb25zdCBjbG9uZUVsZW1lbnRzID0gY2xvbmUucXVlcnlTZWxlY3RvckFsbDxUPihzZWxlY3Rvcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlc2NlbmRhbnRFbGVtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FsbGJhY2soZGVzY2VuZGFudEVsZW1lbnRzW2ldLCBjbG9uZUVsZW1lbnRzW2ldKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gQ291bnRlciBmb3IgdW5pcXVlIGNsb25lZCByYWRpbyBidXR0b24gbmFtZXMuXG5sZXQgY2xvbmVVbmlxdWVJZCA9IDA7XG5cbi8qKiBUcmFuc2ZlcnMgdGhlIGRhdGEgb2Ygb25lIGlucHV0IGVsZW1lbnQgdG8gYW5vdGhlci4gKi9cbmZ1bmN0aW9uIHRyYW5zZmVySW5wdXREYXRhKFxuICBzb3VyY2U6IEVsZW1lbnQgJiB7dmFsdWU6IHN0cmluZ30sXG4gIGNsb25lOiBFbGVtZW50ICYge3ZhbHVlOiBzdHJpbmc7IG5hbWU6IHN0cmluZzsgdHlwZTogc3RyaW5nfSxcbikge1xuICAvLyBCcm93c2VycyB0aHJvdyBhbiBlcnJvciB3aGVuIGFzc2lnbmluZyB0aGUgdmFsdWUgb2YgYSBmaWxlIGlucHV0IHByb2dyYW1tYXRpY2FsbHkuXG4gIGlmIChjbG9uZS50eXBlICE9PSAnZmlsZScpIHtcbiAgICBjbG9uZS52YWx1ZSA9IHNvdXJjZS52YWx1ZTtcbiAgfVxuXG4gIC8vIFJhZGlvIGJ1dHRvbiBgbmFtZWAgYXR0cmlidXRlcyBtdXN0IGJlIHVuaXF1ZSBmb3IgcmFkaW8gYnV0dG9uIGdyb3Vwc1xuICAvLyBvdGhlcndpc2Ugb3JpZ2luYWwgcmFkaW8gYnV0dG9ucyBjYW4gbG9zZSB0aGVpciBjaGVja2VkIHN0YXRlXG4gIC8vIG9uY2UgdGhlIGNsb25lIGlzIGluc2VydGVkIGluIHRoZSBET00uXG4gIGlmIChjbG9uZS50eXBlID09PSAncmFkaW8nICYmIGNsb25lLm5hbWUpIHtcbiAgICBjbG9uZS5uYW1lID0gYG1hdC1jbG9uZS0ke2Nsb25lLm5hbWV9LSR7Y2xvbmVVbmlxdWVJZCsrfWA7XG4gIH1cbn1cblxuLyoqIFRyYW5zZmVycyB0aGUgZGF0YSBvZiBvbmUgY2FudmFzIGVsZW1lbnQgdG8gYW5vdGhlci4gKi9cbmZ1bmN0aW9uIHRyYW5zZmVyQ2FudmFzRGF0YShzb3VyY2U6IEhUTUxDYW52YXNFbGVtZW50LCBjbG9uZTogSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgY29uc3QgY29udGV4dCA9IGNsb25lLmdldENvbnRleHQoJzJkJyk7XG5cbiAgaWYgKGNvbnRleHQpIHtcbiAgICAvLyBJbiBzb21lIGNhc2VzIGBkcmF3SW1hZ2VgIGNhbiB0aHJvdyAoZS5nLiBpZiB0aGUgY2FudmFzIHNpemUgaXMgMHgwKS5cbiAgICAvLyBXZSBjYW4ndCBkbyBtdWNoIGFib3V0IGl0IHNvIGp1c3QgaWdub3JlIHRoZSBlcnJvci5cbiAgICB0cnkge1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2Uoc291cmNlLCAwLCAwKTtcbiAgICB9IGNhdGNoIHt9XG4gIH1cbn1cbiJdfQ==