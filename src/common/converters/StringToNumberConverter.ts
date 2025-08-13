import { Converter } from "./Converter.ts";
// eslint-disable-next-line import/no-cycle
import { NumberToStringConverter } from "./NumberToStringConverter.ts";

/**
 * Converter that converts a "string" to a "number".
 *
 * @template TInput - The type of the input value; must extend `string`.
 * @template TOutput - The type of the output value; must extend `number`.
 */
export class StringToNumberConverter<TInput extends string = string, TOutput extends number = number> extends Converter<TInput, TOutput> {
    /**
     * Singleton instance of the StringToNumberConverter.
     */
    private static readonly instance: StringToNumberConverter = new StringToNumberConverter();

    /**
     * Returns the singleton instance of the StringToNumberConverter.
     *
     * @template TInput - The type of the input value; must extend `string`.
     * @template TOutput - The type of the output value; must extend `number`.
     * @returns The singleton instance of the StringToNumberConverter.
     */
    static getInstance<TInput extends string = string, TOutput extends number = number>(): StringToNumberConverter<TInput, TOutput> {
        return this.instance as StringToNumberConverter<TInput, TOutput>;
    }

    /**
     * Private constructor to enforce singleton pattern.
     * This ensures that only one instance of the StringToNumberConverter exists.
     */
    private constructor() {
        super();
    }

    /**
     * Returns the reverse converter for this converter.
     */
    getReverseConverter(): NumberToStringConverter<TOutput, TInput> {
        return NumberToStringConverter.getInstance();
    }

    /**
     * Converts a value of type "TInput" to a value of type "TOutput".
     *
     * @param value - The value to convert.
     * @returns The converted value of type "TOutput".
     *
     * @throws {@link ConversionError} - If the value cannot be converted.
     */
    convert(value: TInput): TOutput {
        if (typeof value !== "string") {
            this.throwConversionError(value);
        }
        const parsedValue = parseFloat(value);
        if (isNaN(parsedValue)) {
            this.throwConversionError(value);
        }
        return parsedValue as TOutput;
    }

    /**
     * Checks if the given value can be converted by this converter.
     *
     * @param value - The value to check.
     * @returns True if the value can be converted, false otherwise.
     */
    canConvert(value: TInput): boolean {
        return typeof value === "string" && !isNaN(parseFloat(value));
    }
}
