// eslint-disable-next-line import/no-cycle
import { BigIntToStringConverter } from "./BigIntToStringConverter.ts";
import { Converter } from "./Converter.ts";

/**
 * Converter that converts a "string" to a "bigint".
 *
 * @template TInput - The type of the input value; must extend "string".
 * @template TOutput - The type of the output value; must extend "bigint
 */
export class StringToBigIntConverter<TInput extends string = string, TOutput extends bigint = bigint> extends Converter<TInput, TOutput> {
    /**
     * Singleton instance of the StringToBigIntConverter.
     */
    private static readonly instance: StringToBigIntConverter = new StringToBigIntConverter();

    /**
     * Returns the singleton instance of the StringToBigIntConverter.
     *
     * @template TInput - The type of the input value; must extend "string".
     * @template TOutput - The type of the output value; must extend "bigint".
     * @returns The singleton instance of the StringToBigIntConverter.
     */
    static getInstance<TInput extends string = string, TOutput extends bigint = bigint>(): StringToBigIntConverter<TInput, TOutput> {
        return this.instance as StringToBigIntConverter<TInput, TOutput>;
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
    getReverseConverter(): BigIntToStringConverter<TOutput, TInput> {
        return BigIntToStringConverter.getInstance();
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
        try {
            const parsedValue = BigInt(value);
            return parsedValue as TOutput;
        } catch {
            this.throwConversionError(value);
        }
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
        let didConversionSucceed = false;
        try {
            BigInt(value);
            didConversionSucceed = true;
        } catch {} // eslint-disable-line no-empty
        return didConversionSucceed;
    }
}
