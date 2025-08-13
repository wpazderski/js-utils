import type { SchedulerCallback } from "./Scheduler.ts";
import { TimeoutScheduler } from "./TimeoutScheduler.ts";

/**
 * MacrotaskScheduler is a scheduler that executes the callback in the next macrotask queue.
 * Uses setTimeout with a delay of 0 milliseconds.
 */
export class MacrotaskScheduler extends TimeoutScheduler {
    /**
     * Calls the callback in the next macrotask queue.
     */
    static override singleShot(callback: SchedulerCallback): void {
        super.singleShot(callback, { delayMsec: 0 });
    }

    /**
     * Creates an instance of MacrotaskScheduler.
     *
     * @param callback - The callback to be executed in the next macrotask queue.
     */
    constructor(callback: SchedulerCallback) {
        super(callback, {
            delayMsec: 0,
            restartTimer: "onScheduleCallWhenNotScheduled",
        });
    }
}
