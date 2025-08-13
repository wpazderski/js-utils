import type { Opaque } from "../types/basic.ts";
import { CallbackError } from "./errors/CallbackError.ts";

/**
 * Represents name of a Callbacks instance.
 */
export type CallbacksName = Opaque<string, typeof _CallbacksName>;
declare const _CallbacksName: unique symbol;

/**
 * Collection of callbacks that can be added, removed and called.
 *
 * @template T - Type of the callback function.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class Callbacks<T extends (...args: any[]) => any> {
    /**
     * Name of the Callbacks instance.
     * This is used for debugging and error reporting.
     */
    readonly name: CallbacksName | undefined;

    /**
     * Array of callbacks.
     */
    protected readonly callbacks: T[] = [];

    /**
     * Creates a new Callbacks instance.
     *
     * @param name - Optional name for the Callbacks instance, used for debugging and error reporting.
     * @template T - Type of the callback function.
     */
    constructor(name?: CallbacksName) {
        this.name = name;
    }

    /**
     * Adds a callback to the collection.
     * If the callback is already present, it will not be added again.
     *
     * @param callback - The callback function to add.
     */
    add(callback: T): void {
        if (this.callbacks.includes(callback)) {
            return;
        }
        this.callbacks.push(callback);
    }

    /**
     * Removes a callback from the collection.
     * If the callback is not present, it will do nothing.
     *
     * @param callback - The callback function to remove.
     */
    remove(callback: T): void {
        const index = this.callbacks.indexOf(callback);
        if (index !== -1) {
            this.callbacks.splice(index, 1);
        }
    }

    /**
     * Calls all callbacks in the collection with the provided arguments.
     * If any callback throws an error, it will be collected and thrown as a CallbackError after all callbacks have been called.
     *
     * @param args - Arguments to pass to the callbacks.
     *
     * @throws {@link CallbackError} If any callback throws an error, a {@link CallbackError} will be thrown containing all errors. The CallbackError will include the name of the Callbacks instance if it was provided.
     */
    call(...args: Parameters<T>): void {
        const errors: unknown[] = [];
        for (const callback of this.callbacks) {
            try {
                callback(...args);
            } catch (error) {
                errors.push(error);
            }
        }
        if (errors.length > 0) {
            throw new CallbackError(errors, this.name);
        }
    }
}
