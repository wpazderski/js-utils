import { Deferred } from "./Deferred.ts";

/**
 * Provides a simple lock mechanism to ensure that only one operation can be executed at a time.
 */
export class Lock {
    private deferred: Deferred<void> = new Deferred<void>();

    /**
     * Creates a new Lock instance.
     */
    constructor() {
        this.deferred.resolve();
    }

    /**
     * Executes a function while holding the lock.
     * The function will be awaited.
     * If an error is thrown during the function execution, it will be propagated; lock will be released regardless.
     *
     * @param func The function to execute while holding the lock.
     * @returns The result of the function execution (awaited).
     */
    async withLock<T>(func: () => T | Promise<T>): Promise<T> {
        const deferred = await this.obtain();
        try {
            return await func();
        } finally {
            deferred.resolve();
        }
    }

    /**
     * Obtains the lock, ensuring that any previous operations have completed.
     *
     * @returns A promise that resolves when the lock is obtained; promised value is a Deferred object that can be resolved to release the lock.
     */
    private async obtain(): Promise<Deferred<void>> {
        const oldDeferred = this.deferred;
        const newDeferred = new Deferred<void>();
        this.deferred = newDeferred;
        await oldDeferred.promise;
        return newDeferred;
    }
}
