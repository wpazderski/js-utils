import type { CallbacksName } from "../Callbacks.ts";

/**
 * Represents an error that occurs in callbacks.
 * This error is thrown when one or more callbacks throw an error during execution.
 * It aggregates all errors thrown by the callbacks.
 */
export class CallbackError extends Error {
    /**
     * Formats error messages from an array of errors into a single multiline string.
     */
    private static getErrorMessages(errors: unknown[]): string {
        return errors.map((error) => `    - ${error instanceof Error ? error.message : String(error)}`).join("\n");
    }

    /**
     * Creates a new CallbackError instance.
     *
     * @param errors - An array of errors thrown by the callbacks.
     * @param callbacksName - Optional name of the Callbacks instance where these errors occurred.
     */
    constructor(errors: unknown[], callbacksName: CallbacksName | undefined) {
        super(`Error${errors.length === 1 ? "" : "s"} in callbacks "${callbacksName ?? "<unnamed>"}":\n${CallbackError.getErrorMessages(errors)}`);
    }
}
