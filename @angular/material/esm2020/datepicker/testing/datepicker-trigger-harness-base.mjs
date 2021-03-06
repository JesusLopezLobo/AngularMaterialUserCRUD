/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ComponentHarness, parallel } from '@angular/cdk/testing';
import { MatCalendarHarness } from './calendar-harness';
/** Base class for harnesses that can trigger a calendar. */
export class DatepickerTriggerHarnessBase extends ComponentHarness {
    /** Opens the calendar if the trigger is enabled and it has a calendar. */
    async openCalendar() {
        const [isDisabled, hasCalendar] = await parallel(() => [this.isDisabled(), this.hasCalendar()]);
        if (!isDisabled && hasCalendar) {
            return this._openCalendar();
        }
    }
    /** Closes the calendar if it is open. */
    async closeCalendar() {
        if (await this.isCalendarOpen()) {
            await closeCalendar(getCalendarId(this.host()), this.documentRootLocatorFactory());
            // This is necessary so that we wait for the closing animation to finish in touch UI mode.
            await this.forceStabilize();
        }
    }
    /** Gets whether there is a calendar associated with the trigger. */
    async hasCalendar() {
        return (await getCalendarId(this.host())) != null;
    }
    /**
     * Gets the `MatCalendarHarness` that is associated with the trigger.
     * @param filter Optionally filters which calendar is included.
     */
    async getCalendar(filter = {}) {
        return getCalendar(filter, this.host(), this.documentRootLocatorFactory());
    }
}
/** Gets the ID of the calendar that a particular test element can trigger. */
export async function getCalendarId(host) {
    return (await host).getAttribute('data-mat-calendar');
}
/** Closes the calendar with a specific ID. */
export async function closeCalendar(calendarId, documentLocator) {
    // We close the calendar by clicking on the backdrop, even though all datepicker variants
    // have the ability to close by pressing escape. The backdrop is preferrable, because the
    // escape key has multiple functions inside a range picker (either cancel the current range
    // or close the calendar). Since we don't have access to set the ID on the backdrop in all
    // cases, we set a unique class instead which is the same as the calendar's ID and suffixed
    // with `-backdrop`.
    const backdropSelector = `.${await calendarId}-backdrop`;
    return (await documentLocator.locatorFor(backdropSelector)()).click();
}
/** Gets the test harness for a calendar associated with a particular host. */
export async function getCalendar(filter, host, documentLocator) {
    const calendarId = await getCalendarId(host);
    if (!calendarId) {
        throw Error(`Element is not associated with a calendar`);
    }
    return documentLocator.locatorFor(MatCalendarHarness.with({
        ...filter,
        selector: `#${calendarId}`,
    }))();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZXBpY2tlci10cmlnZ2VyLWhhcm5lc3MtYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9tYXRlcmlhbC9kYXRlcGlja2VyL3Rlc3RpbmcvZGF0ZXBpY2tlci10cmlnZ2VyLWhhcm5lc3MtYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsZ0JBQWdCLEVBQWtCLFFBQVEsRUFBYyxNQUFNLHNCQUFzQixDQUFDO0FBRTdGLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBV3RELDREQUE0RDtBQUM1RCxNQUFNLE9BQWdCLDRCQUNwQixTQUFRLGdCQUFnQjtJQVl4QiwwRUFBMEU7SUFDMUUsS0FBSyxDQUFDLFlBQVk7UUFDaEIsTUFBTSxDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRWhHLElBQUksQ0FBQyxVQUFVLElBQUksV0FBVyxFQUFFO1lBQzlCLE9BQU8sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELHlDQUF5QztJQUN6QyxLQUFLLENBQUMsYUFBYTtRQUNqQixJQUFJLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFO1lBQy9CLE1BQU0sYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDO1lBQ25GLDBGQUEwRjtZQUMxRixNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCxvRUFBb0U7SUFDcEUsS0FBSyxDQUFDLFdBQVc7UUFDZixPQUFPLENBQUMsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7SUFDcEQsQ0FBQztJQUVEOzs7T0FHRztJQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsU0FBaUMsRUFBRTtRQUNuRCxPQUFPLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksQ0FBQywwQkFBMEIsRUFBRSxDQUFDLENBQUM7SUFDN0UsQ0FBQztDQUNGO0FBRUQsOEVBQThFO0FBQzlFLE1BQU0sQ0FBQyxLQUFLLFVBQVUsYUFBYSxDQUFDLElBQTBCO0lBQzVELE9BQU8sQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRCw4Q0FBOEM7QUFDOUMsTUFBTSxDQUFDLEtBQUssVUFBVSxhQUFhLENBQ2pDLFVBQWtDLEVBQ2xDLGVBQStCO0lBRS9CLHlGQUF5RjtJQUN6Rix5RkFBeUY7SUFDekYsMkZBQTJGO0lBQzNGLDBGQUEwRjtJQUMxRiwyRkFBMkY7SUFDM0Ysb0JBQW9CO0lBQ3BCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxNQUFNLFVBQVUsV0FBVyxDQUFDO0lBQ3pELE9BQU8sQ0FBQyxNQUFNLGVBQWUsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDeEUsQ0FBQztBQUVELDhFQUE4RTtBQUM5RSxNQUFNLENBQUMsS0FBSyxVQUFVLFdBQVcsQ0FDL0IsTUFBOEIsRUFDOUIsSUFBMEIsRUFDMUIsZUFBK0I7SUFFL0IsTUFBTSxVQUFVLEdBQUcsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFN0MsSUFBSSxDQUFDLFVBQVUsRUFBRTtRQUNmLE1BQU0sS0FBSyxDQUFDLDJDQUEyQyxDQUFDLENBQUM7S0FDMUQ7SUFFRCxPQUFPLGVBQWUsQ0FBQyxVQUFVLENBQy9CLGtCQUFrQixDQUFDLElBQUksQ0FBQztRQUN0QixHQUFHLE1BQU07UUFDVCxRQUFRLEVBQUUsSUFBSSxVQUFVLEVBQUU7S0FDM0IsQ0FBQyxDQUNILEVBQUUsQ0FBQztBQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtDb21wb25lbnRIYXJuZXNzLCBMb2NhdG9yRmFjdG9yeSwgcGFyYWxsZWwsIFRlc3RFbGVtZW50fSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQge0NhbGVuZGFySGFybmVzc0ZpbHRlcnN9IGZyb20gJy4vZGF0ZXBpY2tlci1oYXJuZXNzLWZpbHRlcnMnO1xuaW1wb3J0IHtNYXRDYWxlbmRhckhhcm5lc3N9IGZyb20gJy4vY2FsZW5kYXItaGFybmVzcyc7XG5cbi8qKiBJbnRlcmZhY2UgZm9yIGEgdGVzdCBoYXJuZXNzIHRoYXQgY2FuIG9wZW4gYW5kIGNsb3NlIGEgY2FsZW5kYXIuICovXG5leHBvcnQgaW50ZXJmYWNlIERhdGVwaWNrZXJUcmlnZ2VyIHtcbiAgaXNDYWxlbmRhck9wZW4oKTogUHJvbWlzZTxib29sZWFuPjtcbiAgb3BlbkNhbGVuZGFyKCk6IFByb21pc2U8dm9pZD47XG4gIGNsb3NlQ2FsZW5kYXIoKTogUHJvbWlzZTx2b2lkPjtcbiAgaGFzQ2FsZW5kYXIoKTogUHJvbWlzZTxib29sZWFuPjtcbiAgZ2V0Q2FsZW5kYXIoZmlsdGVyPzogQ2FsZW5kYXJIYXJuZXNzRmlsdGVycyk6IFByb21pc2U8TWF0Q2FsZW5kYXJIYXJuZXNzPjtcbn1cblxuLyoqIEJhc2UgY2xhc3MgZm9yIGhhcm5lc3NlcyB0aGF0IGNhbiB0cmlnZ2VyIGEgY2FsZW5kYXIuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGF0ZXBpY2tlclRyaWdnZXJIYXJuZXNzQmFzZVxuICBleHRlbmRzIENvbXBvbmVudEhhcm5lc3NcbiAgaW1wbGVtZW50cyBEYXRlcGlja2VyVHJpZ2dlclxue1xuICAvKiogV2hldGhlciB0aGUgdHJpZ2dlciBpcyBkaXNhYmxlZC4gKi9cbiAgYWJzdHJhY3QgaXNEaXNhYmxlZCgpOiBQcm9taXNlPGJvb2xlYW4+O1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBjYWxlbmRhciBhc3NvY2lhdGVkIHdpdGggdGhlIHRyaWdnZXIgaXMgb3Blbi4gKi9cbiAgYWJzdHJhY3QgaXNDYWxlbmRhck9wZW4oKTogUHJvbWlzZTxib29sZWFuPjtcblxuICAvKiogT3BlbnMgdGhlIGNhbGVuZGFyIGFzc29jaWF0ZWQgd2l0aCB0aGUgdHJpZ2dlci4gKi9cbiAgcHJvdGVjdGVkIGFic3RyYWN0IF9vcGVuQ2FsZW5kYXIoKTogUHJvbWlzZTx2b2lkPjtcblxuICAvKiogT3BlbnMgdGhlIGNhbGVuZGFyIGlmIHRoZSB0cmlnZ2VyIGlzIGVuYWJsZWQgYW5kIGl0IGhhcyBhIGNhbGVuZGFyLiAqL1xuICBhc3luYyBvcGVuQ2FsZW5kYXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgW2lzRGlzYWJsZWQsIGhhc0NhbGVuZGFyXSA9IGF3YWl0IHBhcmFsbGVsKCgpID0+IFt0aGlzLmlzRGlzYWJsZWQoKSwgdGhpcy5oYXNDYWxlbmRhcigpXSk7XG5cbiAgICBpZiAoIWlzRGlzYWJsZWQgJiYgaGFzQ2FsZW5kYXIpIHtcbiAgICAgIHJldHVybiB0aGlzLl9vcGVuQ2FsZW5kYXIoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2xvc2VzIHRoZSBjYWxlbmRhciBpZiBpdCBpcyBvcGVuLiAqL1xuICBhc3luYyBjbG9zZUNhbGVuZGFyKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChhd2FpdCB0aGlzLmlzQ2FsZW5kYXJPcGVuKCkpIHtcbiAgICAgIGF3YWl0IGNsb3NlQ2FsZW5kYXIoZ2V0Q2FsZW5kYXJJZCh0aGlzLmhvc3QoKSksIHRoaXMuZG9jdW1lbnRSb290TG9jYXRvckZhY3RvcnkoKSk7XG4gICAgICAvLyBUaGlzIGlzIG5lY2Vzc2FyeSBzbyB0aGF0IHdlIHdhaXQgZm9yIHRoZSBjbG9zaW5nIGFuaW1hdGlvbiB0byBmaW5pc2ggaW4gdG91Y2ggVUkgbW9kZS5cbiAgICAgIGF3YWl0IHRoaXMuZm9yY2VTdGFiaWxpemUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0cyB3aGV0aGVyIHRoZXJlIGlzIGEgY2FsZW5kYXIgYXNzb2NpYXRlZCB3aXRoIHRoZSB0cmlnZ2VyLiAqL1xuICBhc3luYyBoYXNDYWxlbmRhcigpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgICByZXR1cm4gKGF3YWl0IGdldENhbGVuZGFySWQodGhpcy5ob3N0KCkpKSAhPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgdGhlIGBNYXRDYWxlbmRhckhhcm5lc3NgIHRoYXQgaXMgYXNzb2NpYXRlZCB3aXRoIHRoZSB0cmlnZ2VyLlxuICAgKiBAcGFyYW0gZmlsdGVyIE9wdGlvbmFsbHkgZmlsdGVycyB3aGljaCBjYWxlbmRhciBpcyBpbmNsdWRlZC5cbiAgICovXG4gIGFzeW5jIGdldENhbGVuZGFyKGZpbHRlcjogQ2FsZW5kYXJIYXJuZXNzRmlsdGVycyA9IHt9KTogUHJvbWlzZTxNYXRDYWxlbmRhckhhcm5lc3M+IHtcbiAgICByZXR1cm4gZ2V0Q2FsZW5kYXIoZmlsdGVyLCB0aGlzLmhvc3QoKSwgdGhpcy5kb2N1bWVudFJvb3RMb2NhdG9yRmFjdG9yeSgpKTtcbiAgfVxufVxuXG4vKiogR2V0cyB0aGUgSUQgb2YgdGhlIGNhbGVuZGFyIHRoYXQgYSBwYXJ0aWN1bGFyIHRlc3QgZWxlbWVudCBjYW4gdHJpZ2dlci4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDYWxlbmRhcklkKGhvc3Q6IFByb21pc2U8VGVzdEVsZW1lbnQ+KTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gIHJldHVybiAoYXdhaXQgaG9zdCkuZ2V0QXR0cmlidXRlKCdkYXRhLW1hdC1jYWxlbmRhcicpO1xufVxuXG4vKiogQ2xvc2VzIHRoZSBjYWxlbmRhciB3aXRoIGEgc3BlY2lmaWMgSUQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xvc2VDYWxlbmRhcihcbiAgY2FsZW5kYXJJZDogUHJvbWlzZTxzdHJpbmcgfCBudWxsPixcbiAgZG9jdW1lbnRMb2NhdG9yOiBMb2NhdG9yRmFjdG9yeSxcbikge1xuICAvLyBXZSBjbG9zZSB0aGUgY2FsZW5kYXIgYnkgY2xpY2tpbmcgb24gdGhlIGJhY2tkcm9wLCBldmVuIHRob3VnaCBhbGwgZGF0ZXBpY2tlciB2YXJpYW50c1xuICAvLyBoYXZlIHRoZSBhYmlsaXR5IHRvIGNsb3NlIGJ5IHByZXNzaW5nIGVzY2FwZS4gVGhlIGJhY2tkcm9wIGlzIHByZWZlcnJhYmxlLCBiZWNhdXNlIHRoZVxuICAvLyBlc2NhcGUga2V5IGhhcyBtdWx0aXBsZSBmdW5jdGlvbnMgaW5zaWRlIGEgcmFuZ2UgcGlja2VyIChlaXRoZXIgY2FuY2VsIHRoZSBjdXJyZW50IHJhbmdlXG4gIC8vIG9yIGNsb3NlIHRoZSBjYWxlbmRhcikuIFNpbmNlIHdlIGRvbid0IGhhdmUgYWNjZXNzIHRvIHNldCB0aGUgSUQgb24gdGhlIGJhY2tkcm9wIGluIGFsbFxuICAvLyBjYXNlcywgd2Ugc2V0IGEgdW5pcXVlIGNsYXNzIGluc3RlYWQgd2hpY2ggaXMgdGhlIHNhbWUgYXMgdGhlIGNhbGVuZGFyJ3MgSUQgYW5kIHN1ZmZpeGVkXG4gIC8vIHdpdGggYC1iYWNrZHJvcGAuXG4gIGNvbnN0IGJhY2tkcm9wU2VsZWN0b3IgPSBgLiR7YXdhaXQgY2FsZW5kYXJJZH0tYmFja2Ryb3BgO1xuICByZXR1cm4gKGF3YWl0IGRvY3VtZW50TG9jYXRvci5sb2NhdG9yRm9yKGJhY2tkcm9wU2VsZWN0b3IpKCkpLmNsaWNrKCk7XG59XG5cbi8qKiBHZXRzIHRoZSB0ZXN0IGhhcm5lc3MgZm9yIGEgY2FsZW5kYXIgYXNzb2NpYXRlZCB3aXRoIGEgcGFydGljdWxhciBob3N0LiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENhbGVuZGFyKFxuICBmaWx0ZXI6IENhbGVuZGFySGFybmVzc0ZpbHRlcnMsXG4gIGhvc3Q6IFByb21pc2U8VGVzdEVsZW1lbnQ+LFxuICBkb2N1bWVudExvY2F0b3I6IExvY2F0b3JGYWN0b3J5LFxuKTogUHJvbWlzZTxNYXRDYWxlbmRhckhhcm5lc3M+IHtcbiAgY29uc3QgY2FsZW5kYXJJZCA9IGF3YWl0IGdldENhbGVuZGFySWQoaG9zdCk7XG5cbiAgaWYgKCFjYWxlbmRhcklkKSB7XG4gICAgdGhyb3cgRXJyb3IoYEVsZW1lbnQgaXMgbm90IGFzc29jaWF0ZWQgd2l0aCBhIGNhbGVuZGFyYCk7XG4gIH1cblxuICByZXR1cm4gZG9jdW1lbnRMb2NhdG9yLmxvY2F0b3JGb3IoXG4gICAgTWF0Q2FsZW5kYXJIYXJuZXNzLndpdGgoe1xuICAgICAgLi4uZmlsdGVyLFxuICAgICAgc2VsZWN0b3I6IGAjJHtjYWxlbmRhcklkfWAsXG4gICAgfSksXG4gICkoKTtcbn1cbiJdfQ==