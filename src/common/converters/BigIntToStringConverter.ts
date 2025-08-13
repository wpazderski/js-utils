import { Converter } from "./Converter.ts";
// eslint-disable-next-line import/no-cycle
import { StringToBigIntConverter } from "./StringToBigIntConverter.ts";

/**
 * Converter that converts a "bigint" to a "string".
 *
 * @template TInput - The type of the input value; must extend "bigint".
 * @template TOutput - The type of the output value; must extend "string".
 */
export class BigIntToStringConverter<TInput extends bigint = bigint, TOutput extends string = string> extends Converter<TInput, TOutput> {
    /**
     * Singleton instance of the BigIntToStringConverter.
     */
    private static readonly instance: BigIntToStringConverter = new BigIntToStringConverter();

    /**
     * Returns the singleton instance of the BigIntToStringConverter.
     *
     * @template TInput - The type of the input value; must extend "bigint".
     * @template TOutput - The type of the output value; must extend "string".
     * @returns The singleton instance of the BigIntToStringConverter.
     */
    static getInstance<TInput extends bigint = bigint, TOutput extends string = string>(): BigIntToStringConverter<TInput, TOutput> {
        return this.instance as BigIntToStringConverter<TInput, TOutput>;
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
    getReverseConverter(): StringToBigIntConverter<TOutput, TInput> {
        return StringToBigIntConverter.getInstance();
    }

    /**
     * Converts a value of type "bigint" to a value of type "string".
     *
     * @param value - The value to convert.
     * @returns The converted value.
     *
     * @throws {@link ConversionError} - If the value cannot be converted.
     */
    convert(value: TInput): TOutput {
        if (typeof value !== "bigint") {
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
        return typeof value === "bigint";
    }
}
