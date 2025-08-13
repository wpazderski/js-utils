import type { SchedulerCallback } from "../../common/schedulers/Scheduler.ts";
import { Scheduler } from "../../common/schedulers/Scheduler.ts";
import type { AnimationFrameHandle } from "../types/handles.ts";

/**
 * Scheduler that uses the browser's `requestAnimationFrame` to schedule tasks.
 */
export class AnimationFrameScheduler extends Scheduler {
    /**
     * Schedules a single-shot task using `requestAnimationFrame`.
     *
     * @param callback - The callback to be executed when the next animation frame is available.
     */
    static override singleShot(callback: SchedulerCallback): void {
        window.requestAnimationFrame(() => {
            this.callCallback(callback);
        });
    }

    /**
     * Handle for the scheduled animation frame.
     * This is set to `null` when no animation frame is scheduled.
     */
    protected animationFrameHandle: AnimationFrameHandle | null = null;

    /**
     * Checks if the scheduler is currently scheduled.
     */
    protected get isScheduledCore(): boolean {
        return this.animationFrameHandle !== null;
    }

    /**
     * Creates an instance of `AnimationFrameScheduler`.
     *
     * @param callback - The callback to be executed when the next animation frame is available.
     */
    constructor(callback: SchedulerCallback) {
        super(callback);
    }

    /**
     * Schedules the callback to be executed on the next animation frame.
     * If an animation frame is already scheduled, it does nothing.
     */
    protected scheduleCore(): void {
        this.animationFrameHandle ??= window.requestAnimationFrame(() => {
            this.animationFrameHandle = null;
            this.execute();
        });
    }

    /**
     * Cancels the scheduled animation frame.
     * If no animation frame is scheduled, it does nothing.
     */
    protected cancelCore(): void {
        if (this.animationFrameHandle !== null) {
            window.cancelAnimationFrame(this.animationFrameHandle);
            this.animationFrameHandle = null;
        }
    }
}
