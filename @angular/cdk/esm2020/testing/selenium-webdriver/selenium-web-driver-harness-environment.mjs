/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HarnessEnvironment } from '@angular/cdk/testing';
import * as webdriver from 'selenium-webdriver';
import { SeleniumWebDriverElement } from './selenium-web-driver-element';
/** The default environment options. */
const defaultEnvironmentOptions = {
    queryFn: async (selector, root) => root().findElements(webdriver.By.css(selector)),
};
/**
 * This function is meant to be executed in the browser. It taps into the hooks exposed by Angular
 * and invokes the specified `callback` when the application is stable (no more pending tasks).
 */
function whenStable(callback) {
    Promise.all(window.frameworkStabilizers.map(stabilizer => new Promise(stabilizer))).then(callback);
}
/**
 * This function is meant to be executed in the browser. It checks whether the Angular framework has
 * bootstrapped yet.
 */
function isBootstrapped() {
    return !!window.frameworkStabilizers;
}
/** Waits for angular to be ready after the page load. */
export async function waitForAngularReady(wd) {
    await wd.wait(() => wd.executeScript(isBootstrapped));
    await wd.executeAsyncScript(whenStable);
}
/** A `HarnessEnvironment` implementation for WebDriver. */
export class SeleniumWebDriverHarnessEnvironment extends HarnessEnvironment {
    constructor(rawRootElement, options) {
        super(rawRootElement);
        this._options = { ...defaultEnvironmentOptions, ...options };
    }
    /** Gets the ElementFinder corresponding to the given TestElement. */
    static getNativeElement(el) {
        if (el instanceof SeleniumWebDriverElement) {
            return el.element();
        }
        throw Error('This TestElement was not created by the WebDriverHarnessEnvironment');
    }
    /** Creates a `HarnessLoader` rooted at the document root. */
    static loader(driver, options) {
        return new SeleniumWebDriverHarnessEnvironment(() => driver.findElement(webdriver.By.css('body')), options);
    }
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    async forceStabilize() {
        await this.rawRootElement().getDriver().executeAsyncScript(whenStable);
    }
    /** @docs-private */
    async waitForTasksOutsideAngular() {
        // TODO: figure out how we can do this for the webdriver environment.
        //  https://github.com/angular/components/issues/17412
    }
    /** Gets the root element for the document. */
    getDocumentRoot() {
        return () => this.rawRootElement().getDriver().findElement(webdriver.By.css('body'));
    }
    /** Creates a `TestElement` from a raw element. */
    createTestElement(element) {
        return new SeleniumWebDriverElement(element, () => this.forceStabilize());
    }
    /** Creates a `HarnessLoader` rooted at the given raw element. */
    createEnvironment(element) {
        return new SeleniumWebDriverHarnessEnvironment(element, this._options);
    }
    // Note: This seems to be working, though we may need to re-evaluate if we encounter issues with
    // stale element references. `() => Promise<webdriver.WebElement[]>` seems like a more correct
    // return type, though supporting it would require changes to the public harness API.
    /**
     * Gets a list of all elements matching the given selector under this environment's root element.
     */
    async getAllRawElements(selector) {
        const els = await this._options.queryFn(selector, this.rawRootElement);
        return els.map((x) => () => x);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZW5pdW0td2ViLWRyaXZlci1oYXJuZXNzLWVudmlyb25tZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90ZXN0aW5nL3NlbGVuaXVtLXdlYmRyaXZlci9zZWxlbml1bS13ZWItZHJpdmVyLWhhcm5lc3MtZW52aXJvbm1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGtCQUFrQixFQUE2QixNQUFNLHNCQUFzQixDQUFDO0FBQ3BGLE9BQU8sS0FBSyxTQUFTLE1BQU0sb0JBQW9CLENBQUM7QUFDaEQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sK0JBQStCLENBQUM7QUE2QnZFLHVDQUF1QztBQUN2QyxNQUFNLHlCQUF5QixHQUF1QztJQUNwRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQWdCLEVBQUUsSUFBZ0MsRUFBRSxFQUFFLENBQ3BFLElBQUksRUFBRSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztDQUNsRCxDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBUyxVQUFVLENBQUMsUUFBc0M7SUFDeEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDdEYsUUFBUSxDQUNULENBQUM7QUFDSixDQUFDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBUyxjQUFjO0lBQ3JCLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQztBQUN2QyxDQUFDO0FBRUQseURBQXlEO0FBQ3pELE1BQU0sQ0FBQyxLQUFLLFVBQVUsbUJBQW1CLENBQUMsRUFBdUI7SUFDL0QsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUN0RCxNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBRUQsMkRBQTJEO0FBQzNELE1BQU0sT0FBTyxtQ0FBb0MsU0FBUSxrQkFFeEQ7SUFJQyxZQUNFLGNBQTBDLEVBQzFDLE9BQTRDO1FBRTVDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUMsR0FBRyx5QkFBeUIsRUFBRSxHQUFHLE9BQU8sRUFBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxxRUFBcUU7SUFDckUsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQWU7UUFDckMsSUFBSSxFQUFFLFlBQVksd0JBQXdCLEVBQUU7WUFDMUMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDckI7UUFDRCxNQUFNLEtBQUssQ0FBQyxxRUFBcUUsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFFRCw2REFBNkQ7SUFDN0QsTUFBTSxDQUFDLE1BQU0sQ0FDWCxNQUEyQixFQUMzQixPQUE0QztRQUU1QyxPQUFPLElBQUksbUNBQW1DLENBQzVDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDbEQsT0FBTyxDQUNSLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILEtBQUssQ0FBQyxjQUFjO1FBQ2xCLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxvQkFBb0I7SUFDcEIsS0FBSyxDQUFDLDBCQUEwQjtRQUM5QixxRUFBcUU7UUFDckUsc0RBQXNEO0lBQ3hELENBQUM7SUFFRCw4Q0FBOEM7SUFDcEMsZUFBZTtRQUN2QixPQUFPLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBRUQsa0RBQWtEO0lBQ3hDLGlCQUFpQixDQUFDLE9BQW1DO1FBQzdELE9BQU8sSUFBSSx3QkFBd0IsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUVELGlFQUFpRTtJQUN2RCxpQkFBaUIsQ0FDekIsT0FBbUM7UUFFbkMsT0FBTyxJQUFJLG1DQUFtQyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVELGdHQUFnRztJQUNoRyw4RkFBOEY7SUFDOUYscUZBQXFGO0lBQ3JGOztPQUVHO0lBQ08sS0FBSyxDQUFDLGlCQUFpQixDQUFDLFFBQWdCO1FBQ2hELE1BQU0sR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN2RSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUF1QixFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtIYXJuZXNzRW52aXJvbm1lbnQsIEhhcm5lc3NMb2FkZXIsIFRlc3RFbGVtZW50fSBmcm9tICdAYW5ndWxhci9jZGsvdGVzdGluZyc7XG5pbXBvcnQgKiBhcyB3ZWJkcml2ZXIgZnJvbSAnc2VsZW5pdW0td2ViZHJpdmVyJztcbmltcG9ydCB7U2VsZW5pdW1XZWJEcml2ZXJFbGVtZW50fSBmcm9tICcuL3NlbGVuaXVtLXdlYi1kcml2ZXItZWxlbWVudCc7XG5cbi8qKlxuICogQW4gQW5ndWxhciBmcmFtZXdvcmsgc3RhYmlsaXplciBmdW5jdGlvbiB0aGF0IHRha2VzIGEgY2FsbGJhY2sgYW5kIGNhbGxzIGl0IHdoZW4gdGhlIGFwcGxpY2F0aW9uXG4gKiBpcyBzdGFibGUsIHBhc3NpbmcgYSBib29sZWFuIGluZGljYXRpbmcgaWYgYW55IHdvcmsgd2FzIGRvbmUuXG4gKi9cbmRlY2xhcmUgaW50ZXJmYWNlIEZyYW1ld29ya1N0YWJpbGl6ZXIge1xuICAoY2FsbGJhY2s6IChkaWRXb3JrOiBib29sZWFuKSA9PiB2b2lkKTogdm9pZDtcbn1cblxuZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICAvKipcbiAgICAgKiBUaGVzZSBob29rcyBhcmUgZXhwb3NlZCBieSBBbmd1bGFyIHRvIHJlZ2lzdGVyIGEgY2FsbGJhY2sgZm9yIHdoZW4gdGhlIGFwcGxpY2F0aW9uIGlzIHN0YWJsZVxuICAgICAqIChubyBtb3JlIHBlbmRpbmcgdGFza3MpLlxuICAgICAqXG4gICAgICogRm9yIHRoZSBpbXBsZW1lbnRhdGlvbiwgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vXG4gICAgICogIGFuZ3VsYXIvYW5ndWxhci9ibG9iL21hc3Rlci9wYWNrYWdlcy9wbGF0Zm9ybS1icm93c2VyL3NyYy9icm93c2VyL3Rlc3RhYmlsaXR5LnRzI0wzMC1MNDlcbiAgICAgKi9cbiAgICBmcmFtZXdvcmtTdGFiaWxpemVyczogRnJhbWV3b3JrU3RhYmlsaXplcltdO1xuICB9XG59XG5cbi8qKiBPcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgZW52aXJvbm1lbnQuICovXG5leHBvcnQgaW50ZXJmYWNlIFdlYkRyaXZlckhhcm5lc3NFbnZpcm9ubWVudE9wdGlvbnMge1xuICAvKiogVGhlIHF1ZXJ5IGZ1bmN0aW9uIHVzZWQgdG8gZmluZCBET00gZWxlbWVudHMuICovXG4gIHF1ZXJ5Rm46IChzZWxlY3Rvcjogc3RyaW5nLCByb290OiAoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudCkgPT4gUHJvbWlzZTx3ZWJkcml2ZXIuV2ViRWxlbWVudFtdPjtcbn1cblxuLyoqIFRoZSBkZWZhdWx0IGVudmlyb25tZW50IG9wdGlvbnMuICovXG5jb25zdCBkZWZhdWx0RW52aXJvbm1lbnRPcHRpb25zOiBXZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnRPcHRpb25zID0ge1xuICBxdWVyeUZuOiBhc3luYyAoc2VsZWN0b3I6IHN0cmluZywgcm9vdDogKCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQpID0+XG4gICAgcm9vdCgpLmZpbmRFbGVtZW50cyh3ZWJkcml2ZXIuQnkuY3NzKHNlbGVjdG9yKSksXG59O1xuXG4vKipcbiAqIFRoaXMgZnVuY3Rpb24gaXMgbWVhbnQgdG8gYmUgZXhlY3V0ZWQgaW4gdGhlIGJyb3dzZXIuIEl0IHRhcHMgaW50byB0aGUgaG9va3MgZXhwb3NlZCBieSBBbmd1bGFyXG4gKiBhbmQgaW52b2tlcyB0aGUgc3BlY2lmaWVkIGBjYWxsYmFja2Agd2hlbiB0aGUgYXBwbGljYXRpb24gaXMgc3RhYmxlIChubyBtb3JlIHBlbmRpbmcgdGFza3MpLlxuICovXG5mdW5jdGlvbiB3aGVuU3RhYmxlKGNhbGxiYWNrOiAoZGlkV29yazogYm9vbGVhbltdKSA9PiB2b2lkKTogdm9pZCB7XG4gIFByb21pc2UuYWxsKHdpbmRvdy5mcmFtZXdvcmtTdGFiaWxpemVycy5tYXAoc3RhYmlsaXplciA9PiBuZXcgUHJvbWlzZShzdGFiaWxpemVyKSkpLnRoZW4oXG4gICAgY2FsbGJhY2ssXG4gICk7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBtZWFudCB0byBiZSBleGVjdXRlZCBpbiB0aGUgYnJvd3Nlci4gSXQgY2hlY2tzIHdoZXRoZXIgdGhlIEFuZ3VsYXIgZnJhbWV3b3JrIGhhc1xuICogYm9vdHN0cmFwcGVkIHlldC5cbiAqL1xuZnVuY3Rpb24gaXNCb290c3RyYXBwZWQoKSB7XG4gIHJldHVybiAhIXdpbmRvdy5mcmFtZXdvcmtTdGFiaWxpemVycztcbn1cblxuLyoqIFdhaXRzIGZvciBhbmd1bGFyIHRvIGJlIHJlYWR5IGFmdGVyIHRoZSBwYWdlIGxvYWQuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gd2FpdEZvckFuZ3VsYXJSZWFkeSh3ZDogd2ViZHJpdmVyLldlYkRyaXZlcikge1xuICBhd2FpdCB3ZC53YWl0KCgpID0+IHdkLmV4ZWN1dGVTY3JpcHQoaXNCb290c3RyYXBwZWQpKTtcbiAgYXdhaXQgd2QuZXhlY3V0ZUFzeW5jU2NyaXB0KHdoZW5TdGFibGUpO1xufVxuXG4vKiogQSBgSGFybmVzc0Vudmlyb25tZW50YCBpbXBsZW1lbnRhdGlvbiBmb3IgV2ViRHJpdmVyLiAqL1xuZXhwb3J0IGNsYXNzIFNlbGVuaXVtV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50IGV4dGVuZHMgSGFybmVzc0Vudmlyb25tZW50PFxuICAoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudFxuPiB7XG4gIC8qKiBUaGUgb3B0aW9ucyBmb3IgdGhpcyBlbnZpcm9ubWVudC4gKi9cbiAgcHJpdmF0ZSBfb3B0aW9uczogV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50T3B0aW9ucztcblxuICBwcm90ZWN0ZWQgY29uc3RydWN0b3IoXG4gICAgcmF3Um9vdEVsZW1lbnQ6ICgpID0+IHdlYmRyaXZlci5XZWJFbGVtZW50LFxuICAgIG9wdGlvbnM/OiBXZWJEcml2ZXJIYXJuZXNzRW52aXJvbm1lbnRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcihyYXdSb290RWxlbWVudCk7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHsuLi5kZWZhdWx0RW52aXJvbm1lbnRPcHRpb25zLCAuLi5vcHRpb25zfTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBFbGVtZW50RmluZGVyIGNvcnJlc3BvbmRpbmcgdG8gdGhlIGdpdmVuIFRlc3RFbGVtZW50LiAqL1xuICBzdGF0aWMgZ2V0TmF0aXZlRWxlbWVudChlbDogVGVzdEVsZW1lbnQpOiB3ZWJkcml2ZXIuV2ViRWxlbWVudCB7XG4gICAgaWYgKGVsIGluc3RhbmNlb2YgU2VsZW5pdW1XZWJEcml2ZXJFbGVtZW50KSB7XG4gICAgICByZXR1cm4gZWwuZWxlbWVudCgpO1xuICAgIH1cbiAgICB0aHJvdyBFcnJvcignVGhpcyBUZXN0RWxlbWVudCB3YXMgbm90IGNyZWF0ZWQgYnkgdGhlIFdlYkRyaXZlckhhcm5lc3NFbnZpcm9ubWVudCcpO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBgSGFybmVzc0xvYWRlcmAgcm9vdGVkIGF0IHRoZSBkb2N1bWVudCByb290LiAqL1xuICBzdGF0aWMgbG9hZGVyKFxuICAgIGRyaXZlcjogd2ViZHJpdmVyLldlYkRyaXZlcixcbiAgICBvcHRpb25zPzogV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50T3B0aW9ucyxcbiAgKTogSGFybmVzc0xvYWRlciB7XG4gICAgcmV0dXJuIG5ldyBTZWxlbml1bVdlYkRyaXZlckhhcm5lc3NFbnZpcm9ubWVudChcbiAgICAgICgpID0+IGRyaXZlci5maW5kRWxlbWVudCh3ZWJkcml2ZXIuQnkuY3NzKCdib2R5JykpLFxuICAgICAgb3B0aW9ucyxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsdXNoZXMgY2hhbmdlIGRldGVjdGlvbiBhbmQgYXN5bmMgdGFza3MgY2FwdHVyZWQgaW4gdGhlIEFuZ3VsYXIgem9uZS5cbiAgICogSW4gbW9zdCBjYXNlcyBpdCBzaG91bGQgbm90IGJlIG5lY2Vzc2FyeSB0byBjYWxsIHRoaXMgbWFudWFsbHkuIEhvd2V2ZXIsIHRoZXJlIG1heSBiZSBzb21lIGVkZ2VcbiAgICogY2FzZXMgd2hlcmUgaXQgaXMgbmVlZGVkIHRvIGZ1bGx5IGZsdXNoIGFuaW1hdGlvbiBldmVudHMuXG4gICAqL1xuICBhc3luYyBmb3JjZVN0YWJpbGl6ZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBhd2FpdCB0aGlzLnJhd1Jvb3RFbGVtZW50KCkuZ2V0RHJpdmVyKCkuZXhlY3V0ZUFzeW5jU2NyaXB0KHdoZW5TdGFibGUpO1xuICB9XG5cbiAgLyoqIEBkb2NzLXByaXZhdGUgKi9cbiAgYXN5bmMgd2FpdEZvclRhc2tzT3V0c2lkZUFuZ3VsYXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgLy8gVE9ETzogZmlndXJlIG91dCBob3cgd2UgY2FuIGRvIHRoaXMgZm9yIHRoZSB3ZWJkcml2ZXIgZW52aXJvbm1lbnQuXG4gICAgLy8gIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2NvbXBvbmVudHMvaXNzdWVzLzE3NDEyXG4gIH1cblxuICAvKiogR2V0cyB0aGUgcm9vdCBlbGVtZW50IGZvciB0aGUgZG9jdW1lbnQuICovXG4gIHByb3RlY3RlZCBnZXREb2N1bWVudFJvb3QoKTogKCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQge1xuICAgIHJldHVybiAoKSA9PiB0aGlzLnJhd1Jvb3RFbGVtZW50KCkuZ2V0RHJpdmVyKCkuZmluZEVsZW1lbnQod2ViZHJpdmVyLkJ5LmNzcygnYm9keScpKTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgYFRlc3RFbGVtZW50YCBmcm9tIGEgcmF3IGVsZW1lbnQuICovXG4gIHByb3RlY3RlZCBjcmVhdGVUZXN0RWxlbWVudChlbGVtZW50OiAoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudCk6IFRlc3RFbGVtZW50IHtcbiAgICByZXR1cm4gbmV3IFNlbGVuaXVtV2ViRHJpdmVyRWxlbWVudChlbGVtZW50LCAoKSA9PiB0aGlzLmZvcmNlU3RhYmlsaXplKCkpO1xuICB9XG5cbiAgLyoqIENyZWF0ZXMgYSBgSGFybmVzc0xvYWRlcmAgcm9vdGVkIGF0IHRoZSBnaXZlbiByYXcgZWxlbWVudC4gKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUVudmlyb25tZW50KFxuICAgIGVsZW1lbnQ6ICgpID0+IHdlYmRyaXZlci5XZWJFbGVtZW50LFxuICApOiBIYXJuZXNzRW52aXJvbm1lbnQ8KCkgPT4gd2ViZHJpdmVyLldlYkVsZW1lbnQ+IHtcbiAgICByZXR1cm4gbmV3IFNlbGVuaXVtV2ViRHJpdmVySGFybmVzc0Vudmlyb25tZW50KGVsZW1lbnQsIHRoaXMuX29wdGlvbnMpO1xuICB9XG5cbiAgLy8gTm90ZTogVGhpcyBzZWVtcyB0byBiZSB3b3JraW5nLCB0aG91Z2ggd2UgbWF5IG5lZWQgdG8gcmUtZXZhbHVhdGUgaWYgd2UgZW5jb3VudGVyIGlzc3VlcyB3aXRoXG4gIC8vIHN0YWxlIGVsZW1lbnQgcmVmZXJlbmNlcy4gYCgpID0+IFByb21pc2U8d2ViZHJpdmVyLldlYkVsZW1lbnRbXT5gIHNlZW1zIGxpa2UgYSBtb3JlIGNvcnJlY3RcbiAgLy8gcmV0dXJuIHR5cGUsIHRob3VnaCBzdXBwb3J0aW5nIGl0IHdvdWxkIHJlcXVpcmUgY2hhbmdlcyB0byB0aGUgcHVibGljIGhhcm5lc3MgQVBJLlxuICAvKipcbiAgICogR2V0cyBhIGxpc3Qgb2YgYWxsIGVsZW1lbnRzIG1hdGNoaW5nIHRoZSBnaXZlbiBzZWxlY3RvciB1bmRlciB0aGlzIGVudmlyb25tZW50J3Mgcm9vdCBlbGVtZW50LlxuICAgKi9cbiAgcHJvdGVjdGVkIGFzeW5jIGdldEFsbFJhd0VsZW1lbnRzKHNlbGVjdG9yOiBzdHJpbmcpOiBQcm9taXNlPCgoKSA9PiB3ZWJkcml2ZXIuV2ViRWxlbWVudClbXT4ge1xuICAgIGNvbnN0IGVscyA9IGF3YWl0IHRoaXMuX29wdGlvbnMucXVlcnlGbihzZWxlY3RvciwgdGhpcy5yYXdSb290RWxlbWVudCk7XG4gICAgcmV0dXJuIGVscy5tYXAoKHg6IHdlYmRyaXZlci5XZWJFbGVtZW50KSA9PiAoKSA9PiB4KTtcbiAgfVxufVxuIl19