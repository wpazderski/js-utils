/**
 * Represents an error that is thrown when a method or functionality has not been implemented.
 */
export class NotImplementedError extends Error {
    /**
     * Creates a new instance of NotImplementedError.
     *
     * @param subject - Optional subject or context for the error message. If not provided, a generic message will be used.
     */
    constructor(subject?: string) {
        super(subject === undefined ? "Not implemented." : `${subject} has not been implemented.`);
    }
}
