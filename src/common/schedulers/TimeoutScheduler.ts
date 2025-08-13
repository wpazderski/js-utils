import type { TimeoutHandle } from "../types/handles.ts";
import type { SchedulerCallback } from "./Scheduler.ts";
import { Scheduler } from "./Scheduler.ts";

/**
 * Options for {@link TimeoutScheduler.singleShot}.
 */
export interface TimeoutSchedulerSingleShotOptions {
    /**
     * The delay in milliseconds after which the callback will be executed.
     */
    delayMsec: number;
}

/**
 * Options for {@link TimeoutScheduler}.
 */
export interface TimeoutSchedulerOptions {
    /**
     * The delay in milliseconds after which the callback will be executed.
     */
    delayMsec?: number | undefined;

    /**
     * Defines timer restart behavior.
     * - "onScheduleCallWhenNotScheduled" - restart timer only when calling schedule() when the scheduler is not scheduled.
     * - "onEveryScheduleCall" - restart timer every time schedule() is called.
     *
     * Default: "onScheduleCallWhenNotScheduled".
     */
    restartTimer?: "onScheduleCallWhenNotScheduled" | "onEveryScheduleCall" | undefined;
}

/**
 * TimeoutScheduler is a scheduler that executes the callback after a specified delay using setTimeout().
 */
export class TimeoutScheduler extends Scheduler {
    /**
     * Schedules a callback to be executed once after a specified delay.
     *
     * @param callback - The callback to be executed.
     * @param options - Options for the single shot scheduling, including the delay in milliseconds.
     */
    static override singleShot(callback: SchedulerCallback, options?: TimeoutSchedulerSingleShotOptions): void {
        setTimeout(() => {
            this.callCallback(callback);
        }, options?.delayMsec ?? 0);
    }

    /**
     * Options for the timeout scheduler.
     */
    protected options: TimeoutSchedulerOptions;

    /**
     * Handle returned by setTimeout().
     * Value depends on the environment:
     * - In browsers, it is a number.
     * - In Node.js, it is a NodeJS.Timeout object.
     */
    protected timeoutHandle: TimeoutHandle | null = null;

    /**
     * Indicates whether the scheduler is currently scheduled.
     */
    protected get isScheduledCore(): boolean {
        return this.timeoutHandle !== null;
    }

    /**
     * Creates an instance of TimeoutScheduler.
     */
    constructor(callback: SchedulerCallback, options: TimeoutSchedulerOptions) {
        super(callback);
        this.options = options;
        this.allowSchedulingWhenScheduled = true;
    }

    /**
     * Schedules the callback to be executed after the specified delay.
     * If the scheduler is already scheduled, it will not reschedule it unless the `restartTimer` option is set to "onEveryScheduleCall".
     */
    protected scheduleCore(): void {
        if (this.options.restartTimer === "onEveryScheduleCall" && this.timeoutHandle !== null) {
            this.cancelCore();
        }
        this.timeoutHandle ??= setTimeout(() => {
            this.timeoutHandle = null;
            this.execute();
        }, this.options.delayMsec ?? 0);
    }

    /**
     * Cancels the scheduled callback.
     * If no callback is scheduled, this method does nothing.
     */
    protected cancelCore(): void {
        if (this.timeoutHandle !== null) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
    }
}
