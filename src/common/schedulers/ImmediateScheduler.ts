import type { SchedulerCallback } from "./Scheduler.ts";
import { Scheduler } from "./Scheduler.ts";

/**
 * ImmediateScheduler is a scheduler that executes the callback immediately without any delay, synchronously.
 */
export class ImmediateScheduler extends Scheduler {
    /**
     * Calls the callback immediately, synchronously.
     *
     * @param callback - The callback to be executed.
     */
    static override singleShot(callback: SchedulerCallback): void {
        this.callCallback(callback);
    }

    /**
     * Indicates whether the scheduler is scheduled.
     */
    // eslint-disable-next-line @typescript-eslint/class-literal-property-style
    protected get isScheduledCore(): boolean {
        return false;
    }

    /**
     * Creates an instance of ImmediateScheduler.
     *
     * @param callback - The callback to be executed.
     */
    constructor(callback: SchedulerCallback) {
        super(callback);
    }

    /**
     * Schedules the callback to be executed immediately, synchronously.
     */
    protected scheduleCore(): void {
        this.execute();
    }

    /**
     * Cancels the scheduled callback.
     * This method does nothing for ImmediateScheduler since it executes immediately.
     */
    protected cancelCore(): void {}
}
