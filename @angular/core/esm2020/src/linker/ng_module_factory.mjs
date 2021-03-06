/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Represents an instance of an `NgModule` created by an `NgModuleFactory`.
 * Provides access to the `NgModule` instance and related objects.
 *
 * @publicApi
 */
export class NgModuleRef {
}
/**
 * @publicApi
 *
 * @deprecated
 * This class was mostly used as a part of ViewEngine-based JIT API and is no longer needed in Ivy
 * JIT mode. See [JIT API changes due to ViewEngine deprecation](guide/deprecations#jit-api-changes)
 * for additional context. Angular provides APIs that accept NgModule classes directly (such as
 * [PlatformRef.bootstrapModule](api/core/PlatformRef#bootstrapModule) and
 * [createNgModuleRef](api/core/createNgModuleRef)), consider switching to those APIs instead of
 * using factory-based ones.
 */
export class NgModuleFactory {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfbW9kdWxlX2ZhY3RvcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9saW5rZXIvbmdfbW9kdWxlX2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBUUg7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQWdCLFdBQVc7Q0E2QmhDO0FBUUQ7Ozs7Ozs7Ozs7R0FVRztBQUNILE1BQU0sT0FBZ0IsZUFBZTtDQUdwQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0luamVjdG9yfSBmcm9tICcuLi9kaS9pbmplY3Rvcic7XG5pbXBvcnQge1R5cGV9IGZyb20gJy4uL2ludGVyZmFjZS90eXBlJztcblxuaW1wb3J0IHtDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXJ9IGZyb20gJy4vY29tcG9uZW50X2ZhY3RvcnlfcmVzb2x2ZXInO1xuXG5cbi8qKlxuICogUmVwcmVzZW50cyBhbiBpbnN0YW5jZSBvZiBhbiBgTmdNb2R1bGVgIGNyZWF0ZWQgYnkgYW4gYE5nTW9kdWxlRmFjdG9yeWAuXG4gKiBQcm92aWRlcyBhY2Nlc3MgdG8gdGhlIGBOZ01vZHVsZWAgaW5zdGFuY2UgYW5kIHJlbGF0ZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBOZ01vZHVsZVJlZjxUPiB7XG4gIC8qKlxuICAgKiBUaGUgaW5qZWN0b3IgdGhhdCBjb250YWlucyBhbGwgb2YgdGhlIHByb3ZpZGVycyBvZiB0aGUgYE5nTW9kdWxlYC5cbiAgICovXG4gIGFic3RyYWN0IGdldCBpbmplY3RvcigpOiBJbmplY3RvcjtcblxuICAvKipcbiAgICogVGhlIHJlc29sdmVyIHRoYXQgY2FuIHJldHJpZXZlIGNvbXBvbmVudCBmYWN0b3JpZXMgaW4gYSBjb250ZXh0IG9mIHRoaXMgbW9kdWxlLlxuICAgKlxuICAgKiBOb3RlOiBzaW5jZSB2MTMsIGR5bmFtaWMgY29tcG9uZW50IGNyZWF0aW9uIHZpYVxuICAgKiBbYFZpZXdDb250YWluZXJSZWYuY3JlYXRlQ29tcG9uZW50YF0oYXBpL2NvcmUvVmlld0NvbnRhaW5lclJlZiNjcmVhdGVDb21wb25lbnQpXG4gICAqIGRvZXMgKipub3QqKiByZXF1aXJlIHJlc29sdmluZyBjb21wb25lbnQgZmFjdG9yeTogY29tcG9uZW50IGNsYXNzIGNhbiBiZSB1c2VkIGRpcmVjdGx5LlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IGNvbXBvbmVudEZhY3RvcnlSZXNvbHZlcigpOiBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI7XG5cbiAgLyoqXG4gICAqIFRoZSBgTmdNb2R1bGVgIGluc3RhbmNlLlxuICAgKi9cbiAgYWJzdHJhY3QgZ2V0IGluc3RhbmNlKCk6IFQ7XG5cbiAgLyoqXG4gICAqIERlc3Ryb3lzIHRoZSBtb2R1bGUgaW5zdGFuY2UgYW5kIGFsbCBvZiB0aGUgZGF0YSBzdHJ1Y3R1cmVzIGFzc29jaWF0ZWQgd2l0aCBpdC5cbiAgICovXG4gIGFic3RyYWN0IGRlc3Ryb3koKTogdm9pZDtcblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGEgY2FsbGJhY2sgdG8gYmUgZXhlY3V0ZWQgd2hlbiB0aGUgbW9kdWxlIGlzIGRlc3Ryb3llZC5cbiAgICovXG4gIGFic3RyYWN0IG9uRGVzdHJveShjYWxsYmFjazogKCkgPT4gdm9pZCk6IHZvaWQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSW50ZXJuYWxOZ01vZHVsZVJlZjxUPiBleHRlbmRzIE5nTW9kdWxlUmVmPFQ+IHtcbiAgLy8gTm90ZTogd2UgYXJlIHVzaW5nIHRoZSBwcmVmaXggXyBhcyBOZ01vZHVsZURhdGEgaXMgYW4gTmdNb2R1bGVSZWYgYW5kIHRoZXJlZm9yZSBkaXJlY3RseVxuICAvLyBleHBvc2VkIHRvIHRoZSB1c2VyLlxuICBfYm9vdHN0cmFwQ29tcG9uZW50czogVHlwZTxhbnk+W107XG59XG5cbi8qKlxuICogQHB1YmxpY0FwaVxuICpcbiAqIEBkZXByZWNhdGVkXG4gKiBUaGlzIGNsYXNzIHdhcyBtb3N0bHkgdXNlZCBhcyBhIHBhcnQgb2YgVmlld0VuZ2luZS1iYXNlZCBKSVQgQVBJIGFuZCBpcyBubyBsb25nZXIgbmVlZGVkIGluIEl2eVxuICogSklUIG1vZGUuIFNlZSBbSklUIEFQSSBjaGFuZ2VzIGR1ZSB0byBWaWV3RW5naW5lIGRlcHJlY2F0aW9uXShndWlkZS9kZXByZWNhdGlvbnMjaml0LWFwaS1jaGFuZ2VzKVxuICogZm9yIGFkZGl0aW9uYWwgY29udGV4dC4gQW5ndWxhciBwcm92aWRlcyBBUElzIHRoYXQgYWNjZXB0IE5nTW9kdWxlIGNsYXNzZXMgZGlyZWN0bHkgKHN1Y2ggYXNcbiAqIFtQbGF0Zm9ybVJlZi5ib290c3RyYXBNb2R1bGVdKGFwaS9jb3JlL1BsYXRmb3JtUmVmI2Jvb3RzdHJhcE1vZHVsZSkgYW5kXG4gKiBbY3JlYXRlTmdNb2R1bGVSZWZdKGFwaS9jb3JlL2NyZWF0ZU5nTW9kdWxlUmVmKSksIGNvbnNpZGVyIHN3aXRjaGluZyB0byB0aG9zZSBBUElzIGluc3RlYWQgb2ZcbiAqIHVzaW5nIGZhY3RvcnktYmFzZWQgb25lcy5cbiAqL1xuZXhwb3J0IGFic3RyYWN0IGNsYXNzIE5nTW9kdWxlRmFjdG9yeTxUPiB7XG4gIGFic3RyYWN0IGdldCBtb2R1bGVUeXBlKCk6IFR5cGU8VD47XG4gIGFic3RyYWN0IGNyZWF0ZShwYXJlbnRJbmplY3RvcjogSW5qZWN0b3J8bnVsbCk6IE5nTW9kdWxlUmVmPFQ+O1xufVxuIl19