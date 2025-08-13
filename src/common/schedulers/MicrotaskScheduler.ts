import type { SchedulerCallback } from "./Scheduler.ts";
import { Scheduler } from "./Scheduler.ts";

/**
 * MicrotaskScheduler is a scheduler that executes the callback in the next microtask queue.
 * It uses queueMicrotask() to schedule the callback.
 */
export class MicrotaskScheduler extends Scheduler {
    /**
     * Calls the callback in the next microtask queue.
     */
    static override singleShot(callback: SchedulerCallback): void {
        queueMicrotaskEx(() => {
            this.callCallback(callback);
        });
    }

    /**
     * Internal microtask handle that can be used to read current state of the microtask and to manage it (e.g. cancel it).
     * If no microtask is scheduled, this handle is null.
     */
    protected microtaskExHandle: MicrotaskExHandle | null = null;

    /**
     * Indicates whether the scheduler is scheduled.
     */
    protected get isScheduledCore(): boolean {
        return this.microtaskExHandle !== null;
    }

    /**
     * Creates an instance of MicrotaskScheduler.
     *
     * @param callback - The callback to be executed in the next microtask queue.
     */
    constructor(callback: SchedulerCallback) {
        super(callback);
    }

    /**
     * Schedules the callback to be executed in the next microtask queue.
     * If the scheduler is already scheduled, it will not reschedule it.
     */
    protected scheduleCore(): void {
        this.microtaskExHandle ??= queueMicrotaskEx(() => {
            this.microtaskExHandle = null;
            this.execute();
        });
    }

    /**
     * Cancels the scheduled microtask.
     * If no microtask is scheduled, this method does nothing.
     */
    protected cancelCore(): void {
        if (this.microtaskExHandle !== null) {
            this.microtaskExHandle.cancel();
            this.microtaskExHandle = null;
        }
    }
}

/**
 * An internal handle for managing microtasks.
 * It allows to cancel the microtask and check if it has been cancelled.
 */
export interface MicrotaskExHandle {
    /**
     * Cancels the scheduled microtask.
     */
    cancel: () => void;

    /**
     * Checks if the microtask has been cancelled.
     *
     * @returns true if the microtask has been cancelled, false otherwise.
     */
    isCancelled: () => boolean;
}

/**
 * Queues a cancellable microtask.
 *
 * @param callback - The callback to be executed in the microtask.
 * @returns A handle that can be used to cancel the microtask and check its state.
 */
function queueMicrotaskEx(callback: SchedulerCallback): MicrotaskExHandle {
    let isCancelled = false;
    queueMicrotask(() => {
        if (isCancelled) {
            return;
        }
        callback();
    });
    return {
        cancel: () => {
            isCancelled = true;
        },
        isCancelled: () => isCancelled,
    };
}
