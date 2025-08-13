// eslint-disable-next-line import/no-cycle
import { BooleanToStringConverter } from "./BooleanToStringConverter.ts";
import { Converter } from "./Converter.ts";

/**
 * Converter that converts a "string" to a "boolean".
 *
 * @template TInput - The type of the input value; must extend "string".
 * @template TOutput - The type of the output value; must extend "boolean".
 */
export class StringToBooleanConverter<TInput extends string = string, TOutput extends boolean = boolean> extends Converter<TInput, TOutput> {
    /**
     * Singleton instance of the StringToBooleanConverter.
     */
    private static readonly instance: StringToBooleanConverter = new StringToBooleanConverter();

    /**
     * Returns the singleton instance of the StringToBooleanConverter.
     *
     * @template TInput - The type of the input value; must extend `string`.
     * @template TOutput - The type of the output value; must extend `boolean`.
     * @returns The singleton instance of the StringToBooleanConverter.
     */
    static getInstance<TInput extends string = string, TOutput extends boolean = boolean>(): StringToBooleanConverter<TInput, TOutput> {
        return this.instance as StringToBooleanConverter<TInput, TOutput>;
    }

    /**
     * An array of strings that represent "true" values.
     */
    private readonly trueStrings: string[] = ["true", "1", "on", "enabled", "yes"];

    /**
     * An array of strings that represent "false" values.
     */
    private readonly falseStrings: string[] = ["false", "0", "off", "disabled", "no"];

    /**
     * Private constructor to enforce singleton pattern.
     */
    private constructor() {
        super();
    }

    /**
     * Returns the reverse converter for this converter.
     */
    getReverseConverter(): BooleanToStringConverter<TOutput, TInput> {
        return BooleanToStringConverter.getInstance();
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
        const cleanValue = value.trim().toLowerCase();
        if (this.isTrueString(cleanValue)) {
            return true as TOutput;
        }
        if (this.isFalseString(cleanValue)) {
            return false as TOutput;
        }
        this.throwConversionError(value);
    }

    /**
     * Checks if the given value can be converted by this converter.
     *
     * @param value - The value to check.
     * @returns True if the value can be converted, false otherwise.
     */
    canConvert(value: TInput): boolean {
        if (typeof value !== "string") {
            return false;
        }
        return this.isTrueString(value) || this.isFalseString(value);
    }

    /**
     * Checks if the given value is a valid "true" string.
     *
     * @param value - The value to check.
     * @returns True if the value is a valid "true" string, false otherwise.
     */
    private isTrueString(value: string): boolean {
        return this.trueStrings.includes(value);
    }

    /**
     * Checks if the given value is a valid "false" string.
     *
     * @param value - The value to check.
     * @returns True if the value is a valid "false" string, false otherwise.
     */
    private isFalseString(value: string): boolean {
        return this.falseStrings.includes(value);
    }
}
