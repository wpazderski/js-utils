import { Converter } from "./Converter.ts";
// eslint-disable-next-line import/no-cycle
import { StringToBooleanConverter } from "./StringToBooleanConverter.ts";

/**
 * Converter that converts a "boolean" to a "string".
 *
 * @template TInput - The type of the input value; must extend "boolean".
 * @template TOutput - The type of the output value; must extend "string".
 */
export class BooleanToStringConverter<TInput extends boolean = boolean, TOutput extends string = string> extends Converter<TInput, TOutput> {
    /**
     * Singleton instance of the BooleanToStringConverter.
     */
    private static readonly instance: BooleanToStringConverter = new BooleanToStringConverter();

    /**
     * Returns the singleton instance of the BooleanToStringConverter.
     *
     * @template TInput - The type of the input value; must extend "boolean".
     * @template TOutput - The type of the output value; must extend "string".
     * @returns The singleton instance of the BooleanToStringConverter.
     */
    static getInstance<TInput extends boolean = boolean, TOutput extends string = string>(): BooleanToStringConverter<TInput, TOutput> {
        return this.instance as BooleanToStringConverter<TInput, TOutput>;
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
    getReverseConverter(): StringToBooleanConverter<TOutput, TInput> {
        return StringToBooleanConverter.getInstance();
    }

    /**
     * Converts a value of type "boolean" to a value of type "string".
     *
     * @param value - The value to convert.
     * @returns The converted value.
     *
     * @throws {@link ConversionError} - If the value cannot be converted.
     */
    convert(value: TInput): TOutput {
        if (typeof value !== "boolean") {
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
        return typeof value === "boolean";
    }
}
