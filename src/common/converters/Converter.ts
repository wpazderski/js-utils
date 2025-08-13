import { ConversionError } from "./errors/ConversionError.ts";

/**
 * Abstract base class for converters that convert values from one type to another.
 *
 * @template TInput - The type of the input value.
 * @template TOutput - The type of the output value.
 */
export abstract class Converter<TInput, TOutput> {
    /**
     * Returns the reverse converter for this converter.
     */
    abstract getReverseConverter(): Converter<TOutput, TInput>;

    /**
     * Converts a value of type "TInput" to a value of type "TOutput".
     *
     * @param value - The value to convert.
     * @returns The converted value of type "TOutput".
     */
    abstract convert(value: TInput): TOutput;

    /**
     * Checks if the given value can be converted by this converter.
     *
     * @param value - The value to check.
     * @returns True if the value can be converted, false otherwise.
     */
    abstract canConvert(value: TInput): boolean;

    /**
     * Throws a ConversionError for the given value.
     *
     * @param value - The value that caused the conversion error.
     * @returns never - This function does not return; it always throws an error.
     *
     * @throws {@link ConversionError} - An error indicating that the conversion failed.
     */
    protected throwConversionError(value: TInput): never {
        throw new ConversionError(value);
    }
}
