/**
 * Represents an error that is thrown when a callback in a scheduler throws an error.
 */
export class SchedulerCallbackError extends Error {
    /**
     * Creates a new instance of SchedulerCallbackError.
     *
     * @param error - The error that occurred during the execution of the callback.
     */
    constructor(error: unknown) {
        super(`Scheduler: an error has occurred while executing a callback: ${String(error)}.`);
        const originalStack = error instanceof Error ? (error.stack ?? "") : "";
        this.stack = `${this.stack ?? ""}\n${originalStack}`;
    }
}
