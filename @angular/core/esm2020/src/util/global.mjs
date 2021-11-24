/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const __globalThis = typeof globalThis !== 'undefined' && globalThis;
const __window = typeof window !== 'undefined' && window;
const __self = typeof self !== 'undefined' && typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope && self;
const __global = typeof global !== 'undefined' && global;
// Always use __globalThis if available, which is the spec-defined global variable across all
// environments, then fallback to __global first, because in Node tests both __global and
// __window may be defined and _global should be __global in that case.
const _global = __globalThis || __global || __window || __self;
/**
 * Attention: whenever providing a new value, be sure to add an
 * entry into the corresponding `....externs.js` file,
 * so that closure won't use that global for its purposes.
 */
export { _global as global };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvdXRpbC9nbG9iYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBU0gsTUFBTSxZQUFZLEdBQUcsT0FBTyxVQUFVLEtBQUssV0FBVyxJQUFJLFVBQVUsQ0FBQztBQUNyRSxNQUFNLFFBQVEsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDO0FBQ3pELE1BQU0sTUFBTSxHQUFHLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxPQUFPLGlCQUFpQixLQUFLLFdBQVc7SUFDbEYsSUFBSSxZQUFZLGlCQUFpQixJQUFJLElBQUksQ0FBQztBQUM5QyxNQUFNLFFBQVEsR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxDQUFDO0FBRXpELDZGQUE2RjtBQUM3Rix5RkFBeUY7QUFDekYsdUVBQXVFO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLFlBQVksSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLE1BQU0sQ0FBQztBQUUvRDs7OztHQUlHO0FBQ0gsT0FBTyxFQUFDLE9BQU8sSUFBSSxNQUFNLEVBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBUT0RPKGp0ZXBsaXR6NjAyKTogTG9hZCBXb3JrZXJHbG9iYWxTY29wZSBmcm9tIGxpYi53ZWJ3b3JrZXIuZC50cyBmaWxlICMzNDkyXG5kZWNsYXJlIHZhciBXb3JrZXJHbG9iYWxTY29wZTogYW55IC8qKiBUT0RPICM5MTAwICovO1xuLy8gQ29tbW9uSlMgLyBOb2RlIGhhdmUgZ2xvYmFsIGNvbnRleHQgZXhwb3NlZCBhcyBcImdsb2JhbFwiIHZhcmlhYmxlLlxuLy8gV2UgZG9uJ3Qgd2FudCB0byBpbmNsdWRlIHRoZSB3aG9sZSBub2RlLmQudHMgdGhpcyB0aGlzIGNvbXBpbGF0aW9uIHVuaXQgc28gd2UnbGwganVzdCBmYWtlXG4vLyB0aGUgZ2xvYmFsIFwiZ2xvYmFsXCIgdmFyIGZvciBub3cuXG5kZWNsYXJlIHZhciBnbG9iYWw6IGFueSAvKiogVE9ETyAjOTEwMCAqLztcblxuY29uc3QgX19nbG9iYWxUaGlzID0gdHlwZW9mIGdsb2JhbFRoaXMgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbFRoaXM7XG5jb25zdCBfX3dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdztcbmNvbnN0IF9fc2VsZiA9IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgV29ya2VyR2xvYmFsU2NvcGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlICYmIHNlbGY7XG5jb25zdCBfX2dsb2JhbCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnICYmIGdsb2JhbDtcblxuLy8gQWx3YXlzIHVzZSBfX2dsb2JhbFRoaXMgaWYgYXZhaWxhYmxlLCB3aGljaCBpcyB0aGUgc3BlYy1kZWZpbmVkIGdsb2JhbCB2YXJpYWJsZSBhY3Jvc3MgYWxsXG4vLyBlbnZpcm9ubWVudHMsIHRoZW4gZmFsbGJhY2sgdG8gX19nbG9iYWwgZmlyc3QsIGJlY2F1c2UgaW4gTm9kZSB0ZXN0cyBib3RoIF9fZ2xvYmFsIGFuZFxuLy8gX193aW5kb3cgbWF5IGJlIGRlZmluZWQgYW5kIF9nbG9iYWwgc2hvdWxkIGJlIF9fZ2xvYmFsIGluIHRoYXQgY2FzZS5cbmNvbnN0IF9nbG9iYWwgPSBfX2dsb2JhbFRoaXMgfHwgX19nbG9iYWwgfHwgX193aW5kb3cgfHwgX19zZWxmO1xuXG4vKipcbiAqIEF0dGVudGlvbjogd2hlbmV2ZXIgcHJvdmlkaW5nIGEgbmV3IHZhbHVlLCBiZSBzdXJlIHRvIGFkZCBhblxuICogZW50cnkgaW50byB0aGUgY29ycmVzcG9uZGluZyBgLi4uLmV4dGVybnMuanNgIGZpbGUsXG4gKiBzbyB0aGF0IGNsb3N1cmUgd29uJ3QgdXNlIHRoYXQgZ2xvYmFsIGZvciBpdHMgcHVycG9zZXMuXG4gKi9cbmV4cG9ydCB7X2dsb2JhbCBhcyBnbG9iYWx9O1xuIl19