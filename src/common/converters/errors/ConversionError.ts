/**
 * Represents an error that occurs during conversion.
 */
export class ConversionError extends Error {
    /**
     * Creates a new ConversionError instance.
     *
     * @param value - The value that could not be converted.
     */
    constructor(value: unknown) {
        super(`Converter: can't convert from "${String(value)}".`);
    }
}
