/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { handleAutoChangeDetectionStatus, HarnessEnvironment, stopHandlingAutoChangeDetectionStatus, } from '@angular/cdk/testing';
import { flush } from '@angular/core/testing';
import { takeWhile } from 'rxjs/operators';
import { TaskStateZoneInterceptor } from './task-state-zone-interceptor';
import { UnitTestElement } from './unit-test-element';
/** The default environment options. */
const defaultEnvironmentOptions = {
    queryFn: (selector, root) => root.querySelectorAll(selector),
};
/** Whether auto change detection is currently disabled. */
let disableAutoChangeDetection = false;
/**
 * The set of non-destroyed fixtures currently being used by `TestbedHarnessEnvironment` instances.
 */
const activeFixtures = new Set();
/**
 * Installs a handler for change detection batching status changes for a specific fixture.
 * @param fixture The fixture to handle change detection batching for.
 */
function installAutoChangeDetectionStatusHandler(fixture) {
    if (!activeFixtures.size) {
        handleAutoChangeDetectionStatus(({ isDisabled, onDetectChangesNow }) => {
            disableAutoChangeDetection = isDisabled;
            if (onDetectChangesNow) {
                Promise.all(Array.from(activeFixtures).map(detectChanges)).then(onDetectChangesNow);
            }
        });
    }
    activeFixtures.add(fixture);
}
/**
 * Uninstalls a handler for change detection batching status changes for a specific fixture.
 * @param fixture The fixture to stop handling change detection batching for.
 */
function uninstallAutoChangeDetectionStatusHandler(fixture) {
    activeFixtures.delete(fixture);
    if (!activeFixtures.size) {
        stopHandlingAutoChangeDetectionStatus();
    }
}
/** Whether we are currently in the fake async zone. */
function isInFakeAsyncZone() {
    return Zone.current.get('FakeAsyncTestZoneSpec') != null;
}
/**
 * Triggers change detection for a specific fixture.
 * @param fixture The fixture to trigger change detection for.
 */
async function detectChanges(fixture) {
    fixture.detectChanges();
    if (isInFakeAsyncZone()) {
        flush();
    }
    else {
        await fixture.whenStable();
    }
}
/** A `HarnessEnvironment` implementation for Angular's Testbed. */
export class TestbedHarnessEnvironment extends HarnessEnvironment {
    constructor(rawRootElement, _fixture, options) {
        super(rawRootElement);
        this._fixture = _fixture;
        /** Whether the environment has been destroyed. */
        this._destroyed = false;
        this._options = { ...defaultEnvironmentOptions, ...options };
        this._taskState = TaskStateZoneInterceptor.setup();
        installAutoChangeDetectionStatusHandler(_fixture);
        _fixture.componentRef.onDestroy(() => {
            uninstallAutoChangeDetectionStatusHandler(_fixture);
            this._destroyed = true;
        });
    }
    /** Creates a `HarnessLoader` rooted at the given fixture's root element. */
    static loader(fixture, options) {
        return new TestbedHarnessEnvironment(fixture.nativeElement, fixture, options);
    }
    /**
     * Creates a `HarnessLoader` at the document root. This can be used if harnesses are
     * located outside of a fixture (e.g. overlays appended to the document body).
     */
    static documentRootLoader(fixture, options) {
        return new TestbedHarnessEnvironment(document.body, fixture, options);
    }
    /** Gets the native DOM element corresponding to the given TestElement. */
    static getNativeElement(el) {
        if (el instanceof UnitTestElement) {
            return el.element;
        }
        throw Error('This TestElement was not created by the TestbedHarnessEnvironment');
    }
    /**
     * Creates an instance of the given harness type, using the fixture's root element as the
     * harness's host element. This method should be used when creating a harness for the root element
     * of a fixture, as components do not have the correct selector when they are created as the root
     * of the fixture.
     */
    static async harnessForFixture(fixture, harnessType, options) {
        const environment = new TestbedHarnessEnvironment(fixture.nativeElement, fixture, options);
        await environment.forceStabilize();
        return environment.createComponentHarness(harnessType, fixture.nativeElement);
    }
    /**
     * Flushes change detection and async tasks captured in the Angular zone.
     * In most cases it should not be necessary to call this manually. However, there may be some edge
     * cases where it is needed to fully flush animation events.
     */
    async forceStabilize() {
        if (!disableAutoChangeDetection) {
            if (this._destroyed) {
                throw Error('Harness is attempting to use a fixture that has already been destroyed.');
            }
            await detectChanges(this._fixture);
        }
    }
    /**
     * Waits for all scheduled or running async tasks to complete. This allows harness
     * authors to wait for async tasks outside of the Angular zone.
     */
    async waitForTasksOutsideAngular() {
        // If we run in the fake async zone, we run "flush" to run any scheduled tasks. This
        // ensures that the harnesses behave inside of the FakeAsyncTestZone similar to the
        // "AsyncTestZone" and the root zone (i.e. neither fakeAsync or async). Note that we
        // cannot just rely on the task state observable to become stable because the state will
        // never change. This is because the task queue will be only drained if the fake async
        // zone is being flushed.
        if (isInFakeAsyncZone()) {
            flush();
        }
        // Wait until the task queue has been drained and the zone is stable. Note that
        // we cannot rely on "fixture.whenStable" since it does not catch tasks scheduled
        // outside of the Angular zone. For test harnesses, we want to ensure that the
        // app is fully stabilized and therefore need to use our own zone interceptor.
        await this._taskState.pipe(takeWhile(state => !state.stable)).toPromise();
    }
    /** Gets the root element for the document. */
    getDocumentRoot() {
        return document.body;
    }
    /** Creates a `TestElement` from a raw element. */
    createTestElement(element) {
        return new UnitTestElement(element, () => this.forceStabilize());
    }
    /** Creates a `HarnessLoader` rooted at the given raw element. */
    createEnvironment(element) {
        return new TestbedHarnessEnvironment(element, this._fixture, this._options);
    }
    /**
     * Gets a list of all elements matching the given selector under this environment's root element.
     */
    async getAllRawElements(selector) {
        await this.forceStabilize();
        return Array.from(this._options.queryFn(selector, this.rawRootElement));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdGJlZC1oYXJuZXNzLWVudmlyb25tZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2Nkay90ZXN0aW5nL3Rlc3RiZWQvdGVzdGJlZC1oYXJuZXNzLWVudmlyb25tZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFHTCwrQkFBK0IsRUFDL0Isa0JBQWtCLEVBRWxCLHFDQUFxQyxHQUV0QyxNQUFNLHNCQUFzQixDQUFDO0FBQzlCLE9BQU8sRUFBbUIsS0FBSyxFQUFDLE1BQU0sdUJBQXVCLENBQUM7QUFFOUQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sRUFBWSx3QkFBd0IsRUFBQyxNQUFNLCtCQUErQixDQUFDO0FBQ2xGLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQVFwRCx1Q0FBdUM7QUFDdkMsTUFBTSx5QkFBeUIsR0FBcUM7SUFDbEUsT0FBTyxFQUFFLENBQUMsUUFBZ0IsRUFBRSxJQUFhLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUM7Q0FDOUUsQ0FBQztBQUVGLDJEQUEyRDtBQUMzRCxJQUFJLDBCQUEwQixHQUFHLEtBQUssQ0FBQztBQUV2Qzs7R0FFRztBQUNILE1BQU0sY0FBYyxHQUFHLElBQUksR0FBRyxFQUE2QixDQUFDO0FBRTVEOzs7R0FHRztBQUNILFNBQVMsdUNBQXVDLENBQUMsT0FBa0M7SUFDakYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUU7UUFDeEIsK0JBQStCLENBQUMsQ0FBQyxFQUFDLFVBQVUsRUFBRSxrQkFBa0IsRUFBQyxFQUFFLEVBQUU7WUFDbkUsMEJBQTBCLEdBQUcsVUFBVSxDQUFDO1lBQ3hDLElBQUksa0JBQWtCLEVBQUU7Z0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElB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Q08sS0FBSyxDQUFDLGlCQUFpQixDQUFDLFFBQWdCO1FBQ2hELE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzVCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7XG4gIENvbXBvbmVudEhhcm5lc3MsXG4gIENvbXBvbmVudEhhcm5lc3NDb25zdHJ1Y3RvcixcbiAgaGFuZGxlQXV0b0NoYW5nZURldGVjdGlvblN0YXR1cyxcbiAgSGFybmVzc0Vudmlyb25tZW50LFxuICBIYXJuZXNzTG9hZGVyLFxuICBzdG9wSGFuZGxpbmdBdXRvQ2hhbmdlRGV0ZWN0aW9uU3RhdHVzLFxuICBUZXN0RWxlbWVudCxcbn0gZnJvbSAnQGFuZ3VsYXIvY2RrL3Rlc3RpbmcnO1xuaW1wb3J0IHtDb21wb25lbnRGaXh0dXJlLCBmbHVzaH0gZnJvbSAnQGFuZ3VsYXIvY29yZS90ZXN0aW5nJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAncnhqcyc7XG5pbXBvcnQge3Rha2VXaGlsZX0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtUYXNrU3RhdGUsIFRhc2tTdGF0ZVpvbmVJbnRlcmNlcHRvcn0gZnJvbSAnLi90YXNrLXN0YXRlLXpvbmUtaW50ZXJjZXB0b3InO1xuaW1wb3J0IHtVbml0VGVzdEVsZW1lbnR9IGZyb20gJy4vdW5pdC10ZXN0LWVsZW1lbnQnO1xuXG4vKiogT3B0aW9ucyB0byBjb25maWd1cmUgdGhlIGVudmlyb25tZW50LiAqL1xuZXhwb3J0IGludGVyZmFjZSBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50T3B0aW9ucyB7XG4gIC8qKiBUaGUgcXVlcnkgZnVuY3Rpb24gdXNlZCB0byBmaW5kIERPTSBlbGVtZW50cy4gKi9cbiAgcXVlcnlGbjogKHNlbGVjdG9yOiBzdHJpbmcsIHJvb3Q6IEVsZW1lbnQpID0+IEl0ZXJhYmxlPEVsZW1lbnQ+IHwgQXJyYXlMaWtlPEVsZW1lbnQ+O1xufVxuXG4vKiogVGhlIGRlZmF1bHQgZW52aXJvbm1lbnQgb3B0aW9ucy4gKi9cbmNvbnN0IGRlZmF1bHRFbnZpcm9ubWVudE9wdGlvbnM6IFRlc3RiZWRIYXJuZXNzRW52aXJvbm1lbnRPcHRpb25zID0ge1xuICBxdWVyeUZuOiAoc2VsZWN0b3I6IHN0cmluZywgcm9vdDogRWxlbWVudCkgPT4gcm9vdC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSxcbn07XG5cbi8qKiBXaGV0aGVyIGF1dG8gY2hhbmdlIGRldGVjdGlvbiBpcyBjdXJyZW50bHkgZGlzYWJsZWQuICovXG5sZXQgZGlzYWJsZUF1dG9DaGFuZ2VEZXRlY3Rpb24gPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgc2V0IG9mIG5vbi1kZXN0cm95ZWQgZml4dHVyZXMgY3VycmVudGx5IGJlaW5nIHVzZWQgYnkgYFRlc3RiZWRIYXJuZXNzRW52aXJvbm1lbnRgIGluc3RhbmNlcy5cbiAqL1xuY29uc3QgYWN0aXZlRml4dHVyZXMgPSBuZXcgU2V0PENvbXBvbmVudEZpeHR1cmU8dW5rbm93bj4+KCk7XG5cbi8qKlxuICogSW5zdGFsbHMgYSBoYW5kbGVyIGZvciBjaGFuZ2UgZGV0ZWN0aW9uIGJhdGNoaW5nIHN0YXR1cyBjaGFuZ2VzIGZvciBhIHNwZWNpZmljIGZpeHR1cmUuXG4gKiBAcGFyYW0gZml4dHVyZSBUaGUgZml4dHVyZSB0byBoYW5kbGUgY2hhbmdlIGRldGVjdGlvbiBiYXRjaGluZyBmb3IuXG4gKi9cbmZ1bmN0aW9uIGluc3RhbGxBdXRvQ2hhbmdlRGV0ZWN0aW9uU3RhdHVzSGFuZGxlcihmaXh0dXJlOiBDb21wb25lbnRGaXh0dXJlPHVua25vd24+KSB7XG4gIGlmICghYWN0aXZlRml4dHVyZXMuc2l6ZSkge1xuICAgIGhhbmRsZUF1dG9DaGFuZ2VEZXRlY3Rpb25TdGF0dXMoKHtpc0Rpc2FibGVkLCBvbkRldGVjdENoYW5nZXNOb3d9KSA9PiB7XG4gICAgICBkaXNhYmxlQXV0b0NoYW5nZURldGVjdGlvbiA9IGlzRGlzYWJsZWQ7XG4gICAgICBpZiAob25EZXRlY3RDaGFuZ2VzTm93KSB7XG4gICAgICAgIFByb21pc2UuYWxsKEFycmF5LmZyb20oYWN0aXZlRml4dHVyZXMpLm1hcChkZXRlY3RDaGFuZ2VzKSkudGhlbihvbkRldGVjdENoYW5nZXNOb3cpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIGFjdGl2ZUZpeHR1cmVzLmFkZChmaXh0dXJlKTtcbn1cblxuLyoqXG4gKiBVbmluc3RhbGxzIGEgaGFuZGxlciBmb3IgY2hhbmdlIGRldGVjdGlvbiBiYXRjaGluZyBzdGF0dXMgY2hhbmdlcyBmb3IgYSBzcGVjaWZpYyBmaXh0dXJlLlxuICogQHBhcmFtIGZpeHR1cmUgVGhlIGZpeHR1cmUgdG8gc3RvcCBoYW5kbGluZyBjaGFuZ2UgZGV0ZWN0aW9uIGJhdGNoaW5nIGZvci5cbiAqL1xuZnVuY3Rpb24gdW5pbnN0YWxsQXV0b0NoYW5nZURldGVjdGlvblN0YXR1c0hhbmRsZXIoZml4dHVyZTogQ29tcG9uZW50Rml4dHVyZTx1bmtub3duPikge1xuICBhY3RpdmVGaXh0dXJlcy5kZWxldGUoZml4dHVyZSk7XG4gIGlmICghYWN0aXZlRml4dHVyZXMuc2l6ZSkge1xuICAgIHN0b3BIYW5kbGluZ0F1dG9DaGFuZ2VEZXRlY3Rpb25TdGF0dXMoKTtcbiAgfVxufVxuXG4vKiogV2hldGhlciB3ZSBhcmUgY3VycmVudGx5IGluIHRoZSBmYWtlIGFzeW5jIHpvbmUuICovXG5mdW5jdGlvbiBpc0luRmFrZUFzeW5jWm9uZSgpIHtcbiAgcmV0dXJuIFpvbmUhLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKSAhPSBudWxsO1xufVxuXG4vKipcbiAqIFRyaWdnZXJzIGNoYW5nZSBkZXRlY3Rpb24gZm9yIGEgc3BlY2lmaWMgZml4dHVyZS5cbiAqIEBwYXJhbSBmaXh0dXJlIFRoZSBmaXh0dXJlIHRvIHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBmb3IuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGRldGVjdENoYW5nZXMoZml4dHVyZTogQ29tcG9uZW50Rml4dHVyZTx1bmtub3duPikge1xuICBmaXh0dXJlLmRldGVjdENoYW5nZXMoKTtcbiAgaWYgKGlzSW5GYWtlQXN5bmNab25lKCkpIHtcbiAgICBmbHVzaCgpO1xuICB9IGVsc2Uge1xuICAgIGF3YWl0IGZpeHR1cmUud2hlblN0YWJsZSgpO1xuICB9XG59XG5cbi8qKiBBIGBIYXJuZXNzRW52aXJvbm1lbnRgIGltcGxlbWVudGF0aW9uIGZvciBBbmd1bGFyJ3MgVGVzdGJlZC4gKi9cbmV4cG9ydCBjbGFzcyBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50IGV4dGVuZHMgSGFybmVzc0Vudmlyb25tZW50PEVsZW1lbnQ+IHtcbiAgLyoqIFdoZXRoZXIgdGhlIGVudmlyb25tZW50IGhhcyBiZWVuIGRlc3Ryb3llZC4gKi9cbiAgcHJpdmF0ZSBfZGVzdHJveWVkID0gZmFsc2U7XG5cbiAgLyoqIE9ic2VydmFibGUgdGhhdCBlbWl0cyB3aGVuZXZlciB0aGUgdGVzdCB0YXNrIHN0YXRlIGNoYW5nZXMuICovXG4gIHByaXZhdGUgX3Rhc2tTdGF0ZTogT2JzZXJ2YWJsZTxUYXNrU3RhdGU+O1xuXG4gIC8qKiBUaGUgb3B0aW9ucyBmb3IgdGhpcyBlbnZpcm9ubWVudC4gKi9cbiAgcHJpdmF0ZSBfb3B0aW9uczogVGVzdGJlZEhhcm5lc3NFbnZpcm9ubWVudE9wdGlvbnM7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKFxuICAgIHJhd1Jvb3RFbGVtZW50OiBFbGVtZW50LFxuICAgIHByaXZhdGUgX2ZpeHR1cmU6IENvbXBvbmVudEZpeHR1cmU8dW5rbm93bj4sXG4gICAgb3B0aW9ucz86IFRlc3RiZWRIYXJuZXNzRW52aXJvbm1lbnRPcHRpb25zLFxuICApIHtcbiAgICBzdXBlcihyYXdSb290RWxlbWVudCk7XG4gICAgdGhpcy5fb3B0aW9ucyA9IHsuLi5kZWZhdWx0RW52aXJvbm1lbnRPcHRpb25zLCAuLi5vcHRpb25zfTtcbiAgICB0aGlzLl90YXNrU3RhdGUgPSBUYXNrU3RhdGVab25lSW50ZXJjZXB0b3Iuc2V0dXAoKTtcbiAgICBpbnN0YWxsQXV0b0NoYW5nZURldGVjdGlvblN0YXR1c0hhbmRsZXIoX2ZpeHR1cmUpO1xuICAgIF9maXh0dXJlLmNvbXBvbmVudFJlZi5vbkRlc3Ryb3koKCkgPT4ge1xuICAgICAgdW5pbnN0YWxsQXV0b0NoYW5nZURldGVjdGlvblN0YXR1c0hhbmRsZXIoX2ZpeHR1cmUpO1xuICAgICAgdGhpcy5fZGVzdHJveWVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgYEhhcm5lc3NMb2FkZXJgIHJvb3RlZCBhdCB0aGUgZ2l2ZW4gZml4dHVyZSdzIHJvb3QgZWxlbWVudC4gKi9cbiAgc3RhdGljIGxvYWRlcihcbiAgICBmaXh0dXJlOiBDb21wb25lbnRGaXh0dXJlPHVua25vd24+LFxuICAgIG9wdGlvbnM/OiBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50T3B0aW9ucyxcbiAgKTogSGFybmVzc0xvYWRlciB7XG4gICAgcmV0dXJuIG5ldyBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50KGZpeHR1cmUubmF0aXZlRWxlbWVudCwgZml4dHVyZSwgb3B0aW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhIGBIYXJuZXNzTG9hZGVyYCBhdCB0aGUgZG9jdW1lbnQgcm9vdC4gVGhpcyBjYW4gYmUgdXNlZCBpZiBoYXJuZXNzZXMgYXJlXG4gICAqIGxvY2F0ZWQgb3V0c2lkZSBvZiBhIGZpeHR1cmUgKGUuZy4gb3ZlcmxheXMgYXBwZW5kZWQgdG8gdGhlIGRvY3VtZW50IGJvZHkpLlxuICAgKi9cbiAgc3RhdGljIGRvY3VtZW50Um9vdExvYWRlcihcbiAgICBmaXh0dXJlOiBDb21wb25lbnRGaXh0dXJlPHVua25vd24+LFxuICAgIG9wdGlvbnM/OiBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50T3B0aW9ucyxcbiAgKTogSGFybmVzc0xvYWRlciB7XG4gICAgcmV0dXJuIG5ldyBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50KGRvY3VtZW50LmJvZHksIGZpeHR1cmUsIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqIEdldHMgdGhlIG5hdGl2ZSBET00gZWxlbWVudCBjb3JyZXNwb25kaW5nIHRvIHRoZSBnaXZlbiBUZXN0RWxlbWVudC4gKi9cbiAgc3RhdGljIGdldE5hdGl2ZUVsZW1lbnQoZWw6IFRlc3RFbGVtZW50KTogRWxlbWVudCB7XG4gICAgaWYgKGVsIGluc3RhbmNlb2YgVW5pdFRlc3RFbGVtZW50KSB7XG4gICAgICByZXR1cm4gZWwuZWxlbWVudDtcbiAgICB9XG4gICAgdGhyb3cgRXJyb3IoJ1RoaXMgVGVzdEVsZW1lbnQgd2FzIG5vdCBjcmVhdGVkIGJ5IHRoZSBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50Jyk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBhbiBpbnN0YW5jZSBvZiB0aGUgZ2l2ZW4gaGFybmVzcyB0eXBlLCB1c2luZyB0aGUgZml4dHVyZSdzIHJvb3QgZWxlbWVudCBhcyB0aGVcbiAgICogaGFybmVzcydzIGhvc3QgZWxlbWVudC4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlIHVzZWQgd2hlbiBjcmVhdGluZyBhIGhhcm5lc3MgZm9yIHRoZSByb290IGVsZW1lbnRcbiAgICogb2YgYSBmaXh0dXJlLCBhcyBjb21wb25lbnRzIGRvIG5vdCBoYXZlIHRoZSBjb3JyZWN0IHNlbGVjdG9yIHdoZW4gdGhleSBhcmUgY3JlYXRlZCBhcyB0aGUgcm9vdFxuICAgKiBvZiB0aGUgZml4dHVyZS5cbiAgICovXG4gIHN0YXRpYyBhc3luYyBoYXJuZXNzRm9yRml4dHVyZTxUIGV4dGVuZHMgQ29tcG9uZW50SGFybmVzcz4oXG4gICAgZml4dHVyZTogQ29tcG9uZW50Rml4dHVyZTx1bmtub3duPixcbiAgICBoYXJuZXNzVHlwZTogQ29tcG9uZW50SGFybmVzc0NvbnN0cnVjdG9yPFQ+LFxuICAgIG9wdGlvbnM/OiBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50T3B0aW9ucyxcbiAgKTogUHJvbWlzZTxUPiB7XG4gICAgY29uc3QgZW52aXJvbm1lbnQgPSBuZXcgVGVzdGJlZEhhcm5lc3NFbnZpcm9ubWVudChmaXh0dXJlLm5hdGl2ZUVsZW1lbnQsIGZpeHR1cmUsIG9wdGlvbnMpO1xuICAgIGF3YWl0IGVudmlyb25tZW50LmZvcmNlU3RhYmlsaXplKCk7XG4gICAgcmV0dXJuIGVudmlyb25tZW50LmNyZWF0ZUNvbXBvbmVudEhhcm5lc3MoaGFybmVzc1R5cGUsIGZpeHR1cmUubmF0aXZlRWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogRmx1c2hlcyBjaGFuZ2UgZGV0ZWN0aW9uIGFuZCBhc3luYyB0YXNrcyBjYXB0dXJlZCBpbiB0aGUgQW5ndWxhciB6b25lLlxuICAgKiBJbiBtb3N0IGNhc2VzIGl0IHNob3VsZCBub3QgYmUgbmVjZXNzYXJ5IHRvIGNhbGwgdGhpcyBtYW51YWxseS4gSG93ZXZlciwgdGhlcmUgbWF5IGJlIHNvbWUgZWRnZVxuICAgKiBjYXNlcyB3aGVyZSBpdCBpcyBuZWVkZWQgdG8gZnVsbHkgZmx1c2ggYW5pbWF0aW9uIGV2ZW50cy5cbiAgICovXG4gIGFzeW5jIGZvcmNlU3RhYmlsaXplKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmICghZGlzYWJsZUF1dG9DaGFuZ2VEZXRlY3Rpb24pIHtcbiAgICAgIGlmICh0aGlzLl9kZXN0cm95ZWQpIHtcbiAgICAgICAgdGhyb3cgRXJyb3IoJ0hhcm5lc3MgaXMgYXR0ZW1wdGluZyB0byB1c2UgYSBmaXh0dXJlIHRoYXQgaGFzIGFscmVhZHkgYmVlbiBkZXN0cm95ZWQuJyk7XG4gICAgICB9XG5cbiAgICAgIGF3YWl0IGRldGVjdENoYW5nZXModGhpcy5fZml4dHVyZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFdhaXRzIGZvciBhbGwgc2NoZWR1bGVkIG9yIHJ1bm5pbmcgYXN5bmMgdGFza3MgdG8gY29tcGxldGUuIFRoaXMgYWxsb3dzIGhhcm5lc3NcbiAgICogYXV0aG9ycyB0byB3YWl0IGZvciBhc3luYyB0YXNrcyBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUuXG4gICAqL1xuICBhc3luYyB3YWl0Rm9yVGFza3NPdXRzaWRlQW5ndWxhcigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAvLyBJZiB3ZSBydW4gaW4gdGhlIGZha2UgYXN5bmMgem9uZSwgd2UgcnVuIFwiZmx1c2hcIiB0byBydW4gYW55IHNjaGVkdWxlZCB0YXNrcy4gVGhpc1xuICAgIC8vIGVuc3VyZXMgdGhhdCB0aGUgaGFybmVzc2VzIGJlaGF2ZSBpbnNpZGUgb2YgdGhlIEZha2VBc3luY1Rlc3Rab25lIHNpbWlsYXIgdG8gdGhlXG4gICAgLy8gXCJBc3luY1Rlc3Rab25lXCIgYW5kIHRoZSByb290IHpvbmUgKGkuZS4gbmVpdGhlciBmYWtlQXN5bmMgb3IgYXN5bmMpLiBOb3RlIHRoYXQgd2VcbiAgICAvLyBjYW5ub3QganVzdCByZWx5IG9uIHRoZSB0YXNrIHN0YXRlIG9ic2VydmFibGUgdG8gYmVjb21lIHN0YWJsZSBiZWNhdXNlIHRoZSBzdGF0ZSB3aWxsXG4gICAgLy8gbmV2ZXIgY2hhbmdlLiBUaGlzIGlzIGJlY2F1c2UgdGhlIHRhc2sgcXVldWUgd2lsbCBiZSBvbmx5IGRyYWluZWQgaWYgdGhlIGZha2UgYXN5bmNcbiAgICAvLyB6b25lIGlzIGJlaW5nIGZsdXNoZWQuXG4gICAgaWYgKGlzSW5GYWtlQXN5bmNab25lKCkpIHtcbiAgICAgIGZsdXNoKCk7XG4gICAgfVxuXG4gICAgLy8gV2FpdCB1bnRpbCB0aGUgdGFzayBxdWV1ZSBoYXMgYmVlbiBkcmFpbmVkIGFuZCB0aGUgem9uZSBpcyBzdGFibGUuIE5vdGUgdGhhdFxuICAgIC8vIHdlIGNhbm5vdCByZWx5IG9uIFwiZml4dHVyZS53aGVuU3RhYmxlXCIgc2luY2UgaXQgZG9lcyBub3QgY2F0Y2ggdGFza3Mgc2NoZWR1bGVkXG4gICAgLy8gb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLiBGb3IgdGVzdCBoYXJuZXNzZXMsIHdlIHdhbnQgdG8gZW5zdXJlIHRoYXQgdGhlXG4gICAgLy8gYXBwIGlzIGZ1bGx5IHN0YWJpbGl6ZWQgYW5kIHRoZXJlZm9yZSBuZWVkIHRvIHVzZSBvdXIgb3duIHpvbmUgaW50ZXJjZXB0b3IuXG4gICAgYXdhaXQgdGhpcy5fdGFza1N0YXRlLnBpcGUodGFrZVdoaWxlKHN0YXRlID0+ICFzdGF0ZS5zdGFibGUpKS50b1Byb21pc2UoKTtcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSByb290IGVsZW1lbnQgZm9yIHRoZSBkb2N1bWVudC4gKi9cbiAgcHJvdGVjdGVkIGdldERvY3VtZW50Um9vdCgpOiBFbGVtZW50IHtcbiAgICByZXR1cm4gZG9jdW1lbnQuYm9keTtcbiAgfVxuXG4gIC8qKiBDcmVhdGVzIGEgYFRlc3RFbGVtZW50YCBmcm9tIGEgcmF3IGVsZW1lbnQuICovXG4gIHByb3RlY3RlZCBjcmVhdGVUZXN0RWxlbWVudChlbGVtZW50OiBFbGVtZW50KTogVGVzdEVsZW1lbnQge1xuICAgIHJldHVybiBuZXcgVW5pdFRlc3RFbGVtZW50KGVsZW1lbnQsICgpID0+IHRoaXMuZm9yY2VTdGFiaWxpemUoKSk7XG4gIH1cblxuICAvKiogQ3JlYXRlcyBhIGBIYXJuZXNzTG9hZGVyYCByb290ZWQgYXQgdGhlIGdpdmVuIHJhdyBlbGVtZW50LiAqL1xuICBwcm90ZWN0ZWQgY3JlYXRlRW52aXJvbm1lbnQoZWxlbWVudDogRWxlbWVudCk6IEhhcm5lc3NFbnZpcm9ubWVudDxFbGVtZW50PiB7XG4gICAgcmV0dXJuIG5ldyBUZXN0YmVkSGFybmVzc0Vudmlyb25tZW50KGVsZW1lbnQsIHRoaXMuX2ZpeHR1cmUsIHRoaXMuX29wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBsaXN0IG9mIGFsbCBlbGVtZW50cyBtYXRjaGluZyB0aGUgZ2l2ZW4gc2VsZWN0b3IgdW5kZXIgdGhpcyBlbnZpcm9ubWVudCdzIHJvb3QgZWxlbWVudC5cbiAgICovXG4gIHByb3RlY3RlZCBhc3luYyBnZXRBbGxSYXdFbGVtZW50cyhzZWxlY3Rvcjogc3RyaW5nKTogUHJvbWlzZTxFbGVtZW50W10+IHtcbiAgICBhd2FpdCB0aGlzLmZvcmNlU3RhYmlsaXplKCk7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fb3B0aW9ucy5xdWVyeUZuKHNlbGVjdG9yLCB0aGlzLnJhd1Jvb3RFbGVtZW50KSk7XG4gIH1cbn1cbiJdfQ==