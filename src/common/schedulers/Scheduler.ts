import { NotImplementedError } from "../errors/NotImplementedError.ts";
import { SchedulerCallbackError } from "./errors/SchedulerCallbackError.ts";

/**
 * Represents a callback function that can be scheduled.
 */
export type SchedulerCallback = () => void;

/**
 * Abstract base class for scheduling callbacks.
 */
export abstract class Scheduler {
    /**
     * Schedules a callback to be executed once.
     * This method is static and should be overridden by subclasses to provide specific scheduling behavior.
     *
     * @param _callback - The callback to be executed.
     * @param _options - Optional parameters for scheduling.
     *
     * @throws {@link NotImplementedError} If not implemented in the subclass.
     */
    static singleShot(_callback: SchedulerCallback, _options?: unknown): void {
        throw new NotImplementedError(`singleShot()`);
    }

    /**
     * Calls the provided callback function.
     *
     * @param callback - The callback function to be executed.
     *
     * @throws {@link SchedulerCallbackError} If the callback throws an error during execution.
     */
    protected static callCallback(callback: SchedulerCallback): void {
        try {
            callback();
        } catch (error) {
            throw new SchedulerCallbackError(error);
        }
    }

    /**
     * The callback function to be executed by the scheduler.
     */
    protected callback: SchedulerCallback;

    /**
     * Indicates whether the scheduler is frozen.
     */
    protected _isFrozen = false;

    /**
     * Indicates whether the scheduler should be scheduled on unfreeze.
     */
    protected shouldBeScheduledOnUnfreeze = false;

    /**
     * Indicates whether the scheduler allows scheduling (scheduleCore() call) when it is already scheduled.
     * This can be overridden in subclasses to change the default behavior.
     */
    protected allowSchedulingWhenScheduled = false;

    /**
     * Indicates whether the scheduler is currently scheduled.
     */
    get isScheduled(): boolean {
        return this.shouldBeScheduledOnUnfreeze || this.isScheduledCore;
    }

    /**
     * Indicates whether the scheduler is scheduled.
     */
    protected abstract get isScheduledCore(): boolean;

    /**
     * Indicates whether the scheduler is frozen.
     */
    get isFrozen(): boolean {
        return this._isFrozen;
    }

    /**
     * Creates an instance of the Scheduler.
     *
     * @param callback - The callback function to be executed by the scheduler.
     */
    constructor(callback: SchedulerCallback) {
        this.callback = callback;
    }

    /**
     * Schedules the callback to be executed.
     */
    protected abstract scheduleCore(): void;

    /**
     * Cancels the scheduled callback.
     */
    protected abstract cancelCore(): void;

    /**
     * Freezes the scheduler, preventing it from executing the callback.
     * If the scheduler is currently scheduled, it will be canceled and then rescheduled on unfreeze().
     * If the scheduler is already frozen, this method does nothing.
     */
    freeze(): void {
        if (this._isFrozen) {
            return;
        }
        this._isFrozen = true;
        if (this.isScheduledCore) {
            this.shouldBeScheduledOnUnfreeze = true;
            this.cancelCore();
        }
    }

    /**
     * Unfreezes the scheduler, allowing it to execute the callback again.
     * If the scheduler was frozen with a scheduled callback, it will be rescheduled.
     * If schedule() was called while frozen, it will be scheduled now.
     * If the scheduler is not frozen, this method does nothing.
     */
    unfreeze(): void {
        if (!this._isFrozen) {
            return;
        }
        this._isFrozen = false;
        if (this.shouldBeScheduledOnUnfreeze) {
            this.shouldBeScheduledOnUnfreeze = false;
            this.scheduleCore();
        }
    }

    /**
     * Schedules the callback to be executed.
     * If the scheduler is already scheduled, it does nothing.
     * If the scheduler is frozen, it will be scheduled on unfreeze().
     */
    schedule(): void {
        if (this.isScheduledCore && !this.allowSchedulingWhenScheduled) {
            return;
        }
        if (this._isFrozen) {
            this.shouldBeScheduledOnUnfreeze = true;
        } else {
            this.scheduleCore();
        }
    }

    /**
     * Cancels the scheduled callback.
     */
    cancel(): void {
        this.shouldBeScheduledOnUnfreeze = false;
        if (!this.isScheduledCore) {
            return;
        }
        this.cancelCore();
    }

    /**
     * Executes the callback immediately.
     */
    protected execute(): void {
        (this.constructor as typeof Scheduler).callCallback(this.callback);
    }
}
