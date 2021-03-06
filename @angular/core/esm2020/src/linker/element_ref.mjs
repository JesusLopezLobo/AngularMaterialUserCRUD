import { getCurrentTNode, getLView } from '../render3/state';
import { getNativeByTNode } from '../render3/util/view_utils';
import { noop } from '../util/noop';
/**
 * Creates an ElementRef from the most recent node.
 *
 * @returns The ElementRef instance to use
 */
export function injectElementRef() {
    return createElementRef(getCurrentTNode(), getLView());
}
/**
 * Creates an ElementRef given a node.
 *
 * @param tNode The node for which you'd like an ElementRef
 * @param lView The view to which the node belongs
 * @returns The ElementRef instance to use
 */
export function createElementRef(tNode, lView) {
    return new ElementRef(getNativeByTNode(tNode, lView));
}
export const SWITCH_ELEMENT_REF_FACTORY__POST_R3__ = injectElementRef;
const SWITCH_ELEMENT_REF_FACTORY__PRE_R3__ = noop;
const SWITCH_ELEMENT_REF_FACTORY = SWITCH_ELEMENT_REF_FACTORY__POST_R3__;
/**
 * A wrapper around a native element inside of a View.
 *
 * An `ElementRef` is backed by a render-specific element. In the browser, this is usually a DOM
 * element.
 *
 * @security Permitting direct access to the DOM can make your application more vulnerable to
 * XSS attacks. Carefully review any use of `ElementRef` in your code. For more detail, see the
 * [Security Guide](https://g.co/ng/security).
 *
 * @publicApi
 */
// Note: We don't expose things like `Injector`, `ViewContainer`, ... here,
// i.e. users have to ask for what they need. With that, we can build better analysis tools
// and could do better codegen in the future.
export class ElementRef {
    constructor(nativeElement) {
        this.nativeElement = nativeElement;
    }
}
/**
 * @internal
 * @nocollapse
 */
ElementRef.__NG_ELEMENT_ID__ = SWITCH_ELEMENT_REF_FACTORY;
/**
 * Unwraps `ElementRef` and return the `nativeElement`.
 *
 * @param value value to unwrap
 * @returns `nativeElement` if `ElementRef` otherwise returns value as is.
 */
export function unwrapElementRef(value) {
    return value instanceof ElementRef ? value.nativeElement : value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saW5rZXIvZWxlbWVudF9yZWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBV0EsT0FBTyxFQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUMzRCxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUM1RCxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBRWxDOzs7O0dBSUc7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCO0lBQzlCLE9BQU8sZ0JBQWdCLENBQUMsZUFBZSxFQUFHLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLGdCQUFnQixDQUFDLEtBQVksRUFBRSxLQUFZO0lBQ3pELE9BQU8sSUFBSSxVQUFVLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBYSxDQUFDLENBQUM7QUFDcEUsQ0FBQztBQUVELE1BQU0sQ0FBQyxNQUFNLHFDQUFxQyxHQUFHLGdCQUFnQixDQUFDO0FBQ3RFLE1BQU0sb0NBQW9DLEdBQUcsSUFBSSxDQUFDO0FBQ2xELE1BQU0sMEJBQTBCLEdBRm5CLHFDQUVtRixDQUFDO0FBRWpHOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsMkVBQTJFO0FBQzNFLDJGQUEyRjtBQUMzRiw2Q0FBNkM7QUFDN0MsTUFBTSxPQUFPLFVBQVU7SUF3QnJCLFlBQVksYUFBZ0I7UUFDMUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7SUFDckMsQ0FBQzs7QUFFRDs7O0dBR0c7QUFDSSw0QkFBaUIsR0FBcUIsMEJBQTBCLENBQUM7QUFHMUU7Ozs7O0dBS0c7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQU8sS0FBc0I7SUFDM0QsT0FBTyxLQUFLLFlBQVksVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDbkUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge1ROb2RlfSBmcm9tICcuLi9yZW5kZXIzL2ludGVyZmFjZXMvbm9kZSc7XG5pbXBvcnQge1JFbGVtZW50fSBmcm9tICcuLi9yZW5kZXIzL2ludGVyZmFjZXMvcmVuZGVyZXJfZG9tJztcbmltcG9ydCB7TFZpZXd9IGZyb20gJy4uL3JlbmRlcjMvaW50ZXJmYWNlcy92aWV3JztcbmltcG9ydCB7Z2V0Q3VycmVudFROb2RlLCBnZXRMVmlld30gZnJvbSAnLi4vcmVuZGVyMy9zdGF0ZSc7XG5pbXBvcnQge2dldE5hdGl2ZUJ5VE5vZGV9IGZyb20gJy4uL3JlbmRlcjMvdXRpbC92aWV3X3V0aWxzJztcbmltcG9ydCB7bm9vcH0gZnJvbSAnLi4vdXRpbC9ub29wJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIEVsZW1lbnRSZWYgZnJvbSB0aGUgbW9zdCByZWNlbnQgbm9kZS5cbiAqXG4gKiBAcmV0dXJucyBUaGUgRWxlbWVudFJlZiBpbnN0YW5jZSB0byB1c2VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluamVjdEVsZW1lbnRSZWYoKTogRWxlbWVudFJlZiB7XG4gIHJldHVybiBjcmVhdGVFbGVtZW50UmVmKGdldEN1cnJlbnRUTm9kZSgpISwgZ2V0TFZpZXcoKSk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBFbGVtZW50UmVmIGdpdmVuIGEgbm9kZS5cbiAqXG4gKiBAcGFyYW0gdE5vZGUgVGhlIG5vZGUgZm9yIHdoaWNoIHlvdSdkIGxpa2UgYW4gRWxlbWVudFJlZlxuICogQHBhcmFtIGxWaWV3IFRoZSB2aWV3IHRvIHdoaWNoIHRoZSBub2RlIGJlbG9uZ3NcbiAqIEByZXR1cm5zIFRoZSBFbGVtZW50UmVmIGluc3RhbmNlIHRvIHVzZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRWxlbWVudFJlZih0Tm9kZTogVE5vZGUsIGxWaWV3OiBMVmlldyk6IEVsZW1lbnRSZWYge1xuICByZXR1cm4gbmV3IEVsZW1lbnRSZWYoZ2V0TmF0aXZlQnlUTm9kZSh0Tm9kZSwgbFZpZXcpIGFzIFJFbGVtZW50KTtcbn1cblxuZXhwb3J0IGNvbnN0IFNXSVRDSF9FTEVNRU5UX1JFRl9GQUNUT1JZX19QT1NUX1IzX18gPSBpbmplY3RFbGVtZW50UmVmO1xuY29uc3QgU1dJVENIX0VMRU1FTlRfUkVGX0ZBQ1RPUllfX1BSRV9SM19fID0gbm9vcDtcbmNvbnN0IFNXSVRDSF9FTEVNRU5UX1JFRl9GQUNUT1JZOiB0eXBlb2YgaW5qZWN0RWxlbWVudFJlZiA9IFNXSVRDSF9FTEVNRU5UX1JFRl9GQUNUT1JZX19QUkVfUjNfXztcblxuLyoqXG4gKiBBIHdyYXBwZXIgYXJvdW5kIGEgbmF0aXZlIGVsZW1lbnQgaW5zaWRlIG9mIGEgVmlldy5cbiAqXG4gKiBBbiBgRWxlbWVudFJlZmAgaXMgYmFja2VkIGJ5IGEgcmVuZGVyLXNwZWNpZmljIGVsZW1lbnQuIEluIHRoZSBicm93c2VyLCB0aGlzIGlzIHVzdWFsbHkgYSBET01cbiAqIGVsZW1lbnQuXG4gKlxuICogQHNlY3VyaXR5IFBlcm1pdHRpbmcgZGlyZWN0IGFjY2VzcyB0byB0aGUgRE9NIGNhbiBtYWtlIHlvdXIgYXBwbGljYXRpb24gbW9yZSB2dWxuZXJhYmxlIHRvXG4gKiBYU1MgYXR0YWNrcy4gQ2FyZWZ1bGx5IHJldmlldyBhbnkgdXNlIG9mIGBFbGVtZW50UmVmYCBpbiB5b3VyIGNvZGUuIEZvciBtb3JlIGRldGFpbCwgc2VlIHRoZVxuICogW1NlY3VyaXR5IEd1aWRlXShodHRwczovL2cuY28vbmcvc2VjdXJpdHkpLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqL1xuLy8gTm90ZTogV2UgZG9uJ3QgZXhwb3NlIHRoaW5ncyBsaWtlIGBJbmplY3RvcmAsIGBWaWV3Q29udGFpbmVyYCwgLi4uIGhlcmUsXG4vLyBpLmUuIHVzZXJzIGhhdmUgdG8gYXNrIGZvciB3aGF0IHRoZXkgbmVlZC4gV2l0aCB0aGF0LCB3ZSBjYW4gYnVpbGQgYmV0dGVyIGFuYWx5c2lzIHRvb2xzXG4vLyBhbmQgY291bGQgZG8gYmV0dGVyIGNvZGVnZW4gaW4gdGhlIGZ1dHVyZS5cbmV4cG9ydCBjbGFzcyBFbGVtZW50UmVmPFQgPSBhbnk+IHtcbiAgLyoqXG4gICAqIFRoZSB1bmRlcmx5aW5nIG5hdGl2ZSBlbGVtZW50IG9yIGBudWxsYCBpZiBkaXJlY3QgYWNjZXNzIHRvIG5hdGl2ZSBlbGVtZW50cyBpcyBub3Qgc3VwcG9ydGVkXG4gICAqIChlLmcuIHdoZW4gdGhlIGFwcGxpY2F0aW9uIHJ1bnMgaW4gYSB3ZWIgd29ya2VyKS5cbiAgICpcbiAgICogPGRpdiBjbGFzcz1cImNhbGxvdXQgaXMtY3JpdGljYWxcIj5cbiAgICogICA8aGVhZGVyPlVzZSB3aXRoIGNhdXRpb248L2hlYWRlcj5cbiAgICogICA8cD5cbiAgICogICAgVXNlIHRoaXMgQVBJIGFzIHRoZSBsYXN0IHJlc29ydCB3aGVuIGRpcmVjdCBhY2Nlc3MgdG8gRE9NIGlzIG5lZWRlZC4gVXNlIHRlbXBsYXRpbmcgYW5kXG4gICAqICAgIGRhdGEtYmluZGluZyBwcm92aWRlZCBieSBBbmd1bGFyIGluc3RlYWQuIEFsdGVybmF0aXZlbHkgeW91IGNhbiB0YWtlIGEgbG9vayBhdCB7QGxpbmtcbiAgICogUmVuZGVyZXIyfVxuICAgKiAgICB3aGljaCBwcm92aWRlcyBBUEkgdGhhdCBjYW4gc2FmZWx5IGJlIHVzZWQgZXZlbiB3aGVuIGRpcmVjdCBhY2Nlc3MgdG8gbmF0aXZlIGVsZW1lbnRzIGlzIG5vdFxuICAgKiAgICBzdXBwb3J0ZWQuXG4gICAqICAgPC9wPlxuICAgKiAgIDxwPlxuICAgKiAgICBSZWx5aW5nIG9uIGRpcmVjdCBET00gYWNjZXNzIGNyZWF0ZXMgdGlnaHQgY291cGxpbmcgYmV0d2VlbiB5b3VyIGFwcGxpY2F0aW9uIGFuZCByZW5kZXJpbmdcbiAgICogICAgbGF5ZXJzIHdoaWNoIHdpbGwgbWFrZSBpdCBpbXBvc3NpYmxlIHRvIHNlcGFyYXRlIHRoZSB0d28gYW5kIGRlcGxveSB5b3VyIGFwcGxpY2F0aW9uIGludG8gYVxuICAgKiAgICB3ZWIgd29ya2VyLlxuICAgKiAgIDwvcD5cbiAgICogPC9kaXY+XG4gICAqXG4gICAqL1xuICBwdWJsaWMgbmF0aXZlRWxlbWVudDogVDtcblxuICBjb25zdHJ1Y3RvcihuYXRpdmVFbGVtZW50OiBUKSB7XG4gICAgdGhpcy5uYXRpdmVFbGVtZW50ID0gbmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBfX05HX0VMRU1FTlRfSURfXzogKCkgPT4gRWxlbWVudFJlZiA9IFNXSVRDSF9FTEVNRU5UX1JFRl9GQUNUT1JZO1xufVxuXG4vKipcbiAqIFVud3JhcHMgYEVsZW1lbnRSZWZgIGFuZCByZXR1cm4gdGhlIGBuYXRpdmVFbGVtZW50YC5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgdmFsdWUgdG8gdW53cmFwXG4gKiBAcmV0dXJucyBgbmF0aXZlRWxlbWVudGAgaWYgYEVsZW1lbnRSZWZgIG90aGVyd2lzZSByZXR1cm5zIHZhbHVlIGFzIGlzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdW53cmFwRWxlbWVudFJlZjxULCBSPih2YWx1ZTogVHxFbGVtZW50UmVmPFI+KTogVHxSIHtcbiAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgRWxlbWVudFJlZiA/IHZhbHVlLm5hdGl2ZUVsZW1lbnQgOiB2YWx1ZTtcbn1cbiJdfQ==