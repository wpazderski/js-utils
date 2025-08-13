type PromiseResolver<T> = (value: T | PromiseLike<T>) => void;
type PromiseRejector = (reason?: unknown) => void;

/**
 * Represents the state of a deferred object.
 */
export type DeferredState = "pending" | "rejected" | "resolved";

/**
 * A Deferred object represents a value that may not be available yet but will be resolved or rejected in the future.
 */
export class Deferred<T> {
    /**
     * The promise that will be resolved or rejected in the future.
     * It can be used to wait for the value to be available.
     */
    private _promise: Promise<T>;

    /**
     * The current state of the Deferred object.
     */
    private _state: DeferredState = "pending";

    /**
     * The resolver function for the promise.
     * It is used to resolve the promise with a value.
     */
    private promiseResolver: PromiseResolver<T>;

    /**
     * The rejector function for the promise.
     * It is used to reject the promise with a reason.
     */
    private promiseRejector: PromiseRejector;

    /**
     * The promise associated with this Deferred object.
     * It can be used to wait for the value to be resolved or rejected.
     */
    get promise(): Promise<T> {
        return this._promise;
    }

    private set promise(promise: Promise<T>) {
        this._promise = promise;
    }

    /**
     * The current state of the Deferred object.
     */
    get state(): DeferredState {
        return this._state;
    }

    private set state(state: DeferredState) {
        this._state = state;
    }

    /**
     * Checks if the Deferred object is still pending.
     */
    get isPending(): boolean {
        return this.state === "pending";
    }

    /**
     * Checks if the Deferred object has been finalized (either resolved or rejected).
     */
    get isFinalized(): boolean {
        return this.state === "resolved" || this.state === "rejected";
    }

    /**
     * Checks if the Deferred object has been resolved.
     */
    get isResolved(): boolean {
        return this.state === "resolved";
    }

    /**
     * Checks if the Deferred object has been rejected.
     */
    get isRejected(): boolean {
        return this.state === "rejected";
    }

    /**
     * Creates a new Deferred object.
     */
    constructor() {
        this.promiseResolver = () => {};
        this.promiseRejector = () => {};
        this._promise = new Promise<T>((resolve, reject) => {
            this.promiseResolver = resolve;
            this.promiseRejector = reject;
        });
    }

    /**
     * Resolves the Deferred object with a value.
     * If the Deferred object has already been resolved or rejected, this method does nothing.
     *
     * @param value The value to resolve the Deferred object with.
     */
    resolve(value: T): void {
        if (this.isPending) {
            this.state = "resolved";
            this.promiseResolver(value);
        }
    }

    /**
     * Rejects the Deferred object with an optional reason.
     * If the Deferred object has already been resolved or rejected, this method does nothing.
     *
     * @param reason The reason for rejection (optional).
     */
    reject(reason?: unknown): void {
        if (this.isPending) {
            this.state = "rejected";
            this.promiseRejector(reason);
        }
    }
}
