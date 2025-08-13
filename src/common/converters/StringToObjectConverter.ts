import { Converter } from "./Converter.ts";
// eslint-disable-next-line import/no-cycle
import { ObjectToStringConverter } from "./ObjectToStringConverter.ts";

/**
 * Converter that converts a "string" to an "object".
 *
 * @template TInput - The type of the input value; must extend "string".
 * @template TOutput - The type of the output value; must extend "object".
 */
export class StringToObjectConverter<TInput extends string = string, TOutput extends object = object> extends Converter<TInput, TOutput> {
    /**
     * Singleton instance of the StringToObjectConverter.
     */
    private static readonly instance: StringToObjectConverter = new StringToObjectConverter();

    /**
     * Returns the singleton instance of the StringToObjectConverter.
     *
     * @template TInput - The type of the input value; must extend `string`.
     * @template TOutput - The type of the output value; must extend `object`.
     * @returns The singleton instance of the StringToObjectConverter.
     */
    static getInstance<TInput extends string = string, TOutput extends object = object>(): StringToObjectConverter<TInput, TOutput> {
        return this.instance as StringToObjectConverter<TInput, TOutput>;
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
    getReverseConverter(): ObjectToStringConverter<TOutput, TInput> {
        return ObjectToStringConverter.getInstance();
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
            const parsedValue = JSON.parse(value) as TOutput;
            return parsedValue;
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
            JSON.parse(value);
            didConversionSucceed = true;
        } catch {} // eslint-disable-line no-empty
        return didConversionSucceed;
    }
}
