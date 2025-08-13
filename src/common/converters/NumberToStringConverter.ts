import { Converter } from "./Converter.ts";
// eslint-disable-next-line import/no-cycle
import { StringToNumberConverter } from "./StringToNumberConverter.ts";

/**
 * Converter that converts a "number" to a "string".
 *
 * @template TInput - The type of the input value; must extend "number".
 * @template TOutput - The type of the output value; must extend "string".
 */
export class NumberToStringConverter<TInput extends number = number, TOutput extends string = string> extends Converter<TInput, TOutput> {
    /**
     * Singleton instance of the NumberToStringConverter.
     */
    private static readonly instance: NumberToStringConverter = new NumberToStringConverter();

    /**
     * Returns the singleton instance of the NumberToStringConverter.
     *
     * @template TInput - The type of the input value; must extend "number".
     * @template TOutput - The type of the output value; must extend "string".
     * @returns The singleton instance of the NumberToStringConverter.
     */
    static getInstance<TInput extends number = number, TOutput extends string = string>(): NumberToStringConverter<TInput, TOutput> {
        return this.instance as NumberToStringConverter<TInput, TOutput>;
    }

    /**
     * Private constructor to enforce singleton pattern.
     */
    private constructor() {
        super();
    }

    /**
     * Returns the reverse converter for this converter.
     */
    getReverseConverter(): StringToNumberConverter<TOutput, TInput> {
        return StringToNumberConverter.getInstance();
    }

    /**
     * Converts a value of type "number" to a value of type "string".
     *
     * @param value - The value to convert.
     * @returns The converted value of type "string".
     *
     * @throws {@link ConversionError} - If the value cannot be converted.
     */
    convert(value: TInput): TOutput {
        if (typeof value !== "number" || isNaN(value)) {
            this.throwConversionError(value);
        }
        return value.toString() as TOutput;
    }

    /**
     * Checks if the given value can be converted by this converter.
     *
     * @param value - The value to check.
     * @returns True if the value can be converted, false otherwise.
     */
    canConvert(value: TInput): boolean {
        return typeof value === "number" && !isNaN(value);
    }
}
