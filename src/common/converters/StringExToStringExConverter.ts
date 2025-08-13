import { Converter } from "./Converter.ts";

/**
 * Converter that converts a value of type "TInput" to a value of type "TOutput" where both types extend "string".
 * Singleton variant can be used to convert between two opaque string types.
 * A custom instance created with static {@link createOneOf | createOneOf()} method can be used to ensure that only specific string values are allowed.
 *
 * @template TInput - The type of the input value; must extend "string".
 * @template TOutput - The type of the output value; must extend "string".
 */
export class StringExToStringExConverter<TInput extends string = string, TOutput extends string = string> extends Converter<TInput, TOutput> {
    /**
     * Singleton instance of the StringExToStringExConverter.
     */
    private static readonly instance: StringExToStringExConverter = new StringExToStringExConverter();

    /**
     * Returns the singleton instance of the StringExToStringExConverter.
     *
     * @template TInput - The type of the input value; must extend "string".
     * @template TOutput - The type of the output value; must extend "string".
     * @returns The singleton instance of the StringExToStringExConverter.
     */
    static getInstance<TInput extends string = string, TOutput extends string = string>(): StringExToStringExConverter<TInput, TOutput> {
        return this.instance as StringExToStringExConverter<TInput, TOutput>;
    }

    /**
     * Creates a new instance of StringExToStringExConverter with specified valid values.
     *
     * @template TInput - The type of the input value; must extend "string".
     * @template TOutput - The type of the output value; must extend "string".
     * @param validValues - An array of valid values or null if all strings are allowed.
     * @returns A new instance of String
     */
    static createOneOf<TInput extends string = string, TOutput extends string = string>(validValues: readonly string[] | null): StringExToStringExConverter<TInput, TOutput> {
        const instance = new StringExToStringExConverter<TInput, TOutput>();
        instance.validValues = validValues;
        return instance;
    }

    /**
     * An array of valid values or null if all strings are allowed.
     */
    protected validValues: readonly string[] | null = null;

    /**
     * Returns the reverse converter for this converter.
     */
    getReverseConverter(): StringExToStringExConverter<TOutput, TInput> {
        if (this.validValues !== null) {
            return StringExToStringExConverter.createOneOf<TOutput, TInput>(this.validValues);
        }
        return StringExToStringExConverter.getInstance();
    }

    /**
     * Returns a cloned array of valid values or null if all strings are allowed.
     */
    getValidValues(): string[] | null {
        return this.validValues === null ? null : [...this.validValues];
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
        if (typeof value !== "string" || !this.isValidValue(value)) {
            this.throwConversionError(value);
        }
        return value as string as TOutput;
    }

    /**
     * Checks if the given value can be converted by this converter.
     *
     * @param value - The value to check.
     * @returns True if the value can be converted, false otherwise.
     */
    canConvert(value: TInput): boolean {
        return typeof value === "string" && this.isValidValue(value);
    }

    /**
     * Checks if the given value is a valid value.
     *
     * @param value - The value to check.
     * @returns True if the value is a valid value, false otherwise.
     */
    protected isValidValue(value: string): boolean {
        return this.validValues === null ? true : this.validValues.includes(value as TInput);
    }
}
