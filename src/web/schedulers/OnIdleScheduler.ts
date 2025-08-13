import type { SchedulerCallback } from "../../common/schedulers/Scheduler.ts";
import { Scheduler } from "../../common/schedulers/Scheduler.ts";
import type { AnimationFrameHandle, IdleCallbackHandle } from "../types/handles.ts";

/**
 * Scheduler that uses the browser's "requestIdleCallback" to schedule tasks.
 * If "requestIdleCallback" is not available, it falls back to "requestAnimationFrame".
 */
export class OnIdleScheduler extends Scheduler {
    /**
     * Schedules a single-shot task using "requestIdleCallback"; if "requestIdleCallback" is not available, it uses "requestAnimationFrame".
     *
     * @param callback - The callback to be executed when the browser is idle.
     */
    static override singleShot(callback: SchedulerCallback): void {
        requestIdleCallbackCrossBrowser(() => {
            this.callCallback(callback);
        });
    }

    /**
     * A cross-browser handle for the scheduled idle callback.
     * This is set to "null" when no idle callback is scheduled.
     */
    protected idleCallbackHandle: IdleCallbackCrossBrowserHandle | null = null;

    /**
     * Checks if the scheduler is currently scheduled.
     */
    protected get isScheduledCore(): boolean {
        return this.idleCallbackHandle !== null;
    }

    /**
     * Creates an instance of "OnIdleScheduler".
     */
    constructor(callback: SchedulerCallback) {
        super(callback);
    }

    /**
     * Schedules the callback to be executed when the browser is idle.
     * If an idle callback is already scheduled, it does nothing.
     */
    protected scheduleCore(): void {
        this.idleCallbackHandle ??= requestIdleCallbackCrossBrowser(() => {
            this.idleCallbackHandle = null;
            this.execute();
        });
    }

    /**
     * Cancels the scheduled idle callback.
     * If no idle callback is scheduled, it does nothing.
     */
    protected cancelCore(): void {
        if (this.idleCallbackHandle !== null) {
            cancelIdleCallbackCrossBrowser(this.idleCallbackHandle);
            this.idleCallbackHandle = null;
        }
    }
}

/**
 * Represents a modern handle for an idle callback using "requestIdleCallback".
 */
export interface IdleCallbackModernHandle {
    /**
     * Represents the type of the handle.
     */
    type: "idleCallback";

    /**
     * Represents the handle for the scheduled idle callback.
     */
    handle: IdleCallbackHandle;
}

/**
 * Represents a fallback handle for an idle callback using "requestAnimationFrame".
 */
export interface IdleCallbackFallbackHandle {
    /**
     * Represents the type of the handle.
     */
    type: "animationFrame";

    /**
     * Represents the handle for the scheduled animation frame.
     */
    handle: AnimationFrameHandle;
}

/**
 * Represents a cross-browser handle for an idle callback.
 * It can either be an "IdleCallbackHandle" (preferred) or an "AnimationFrameHandle" (fallback).
 */
export type IdleCallbackCrossBrowserHandle = IdleCallbackModernHandle | IdleCallbackFallbackHandle;

/**
 * Requests an idle callback using the browser's "requestIdleCallback" if available.
 * If "requestIdleCallback" is not available, it falls back to "requestAnimationFrame".
 *
 * @param callback - The callback to be executed when the browser is idle.
 * @returns A cross-browser handle for the scheduled idle callback.
 */
function requestIdleCallbackCrossBrowser(callback: () => void): IdleCallbackCrossBrowserHandle {
    if (typeof window.requestIdleCallback === "function" && typeof window.cancelIdleCallback === "function") {
        return {
            type: "idleCallback",
            handle: window.requestIdleCallback(callback),
        };
    }
    return {
        type: "animationFrame",
        handle: window.requestAnimationFrame(callback),
    };
}

/**
 * Cancels an idle callback using the browser's "cancelIdleCallback" if available.
 * If "cancelIdleCallback" is not available, it cancels the animation frame.
 *
 * @param handle - The cross-browser handle for the scheduled idle callback.
 */
function cancelIdleCallbackCrossBrowser(handle: IdleCallbackCrossBrowserHandle): void {
    if (handle.type === "idleCallback") {
        window.cancelIdleCallback(handle.handle);
    } else {
        window.cancelAnimationFrame(handle.handle);
    }
}
