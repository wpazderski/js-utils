import { Converter } from "./Converter.ts";
// eslint-disable-next-line import/no-cycle
import { StringToObjectConverter } from "./StringToObjectConverter.ts";

/**
 * Converter that converts an object to a string representation.
 *
 * @template TInput - The type of the input value; must extend `object`.
 * @template TOutput - The type of the output value; must extend `string`.
 */
export class ObjectToStringConverter<TInput extends object = object, TOutput extends string = string> extends Converter<TInput, TOutput> {
    /**
     * Singleton instance of the ObjectToStringConverter.
     */
    private static readonly instance: ObjectToStringConverter = new ObjectToStringConverter();

    /**
     * Returns the singleton instance of the ObjectToStringConverter.
     *
     * @template TInput - The type of the input value; must extend `object`.
     * @template TOutput - The type of the output value; must extend `string`.
     * @returns The singleton instance of the ObjectToStringConverter.
     */
    static getInstance<TInput extends object = object, TOutput extends string = string>(): ObjectToStringConverter<TInput, TOutput> {
        return this.instance as ObjectToStringConverter<TInput, TOutput>;
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
    getReverseConverter(): StringToObjectConverter<TOutput, TInput> {
        return StringToObjectConverter.getInstance();
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
        if (typeof value !== "object") {
            this.throwConversionError(value);
        }
        return JSON.stringify(value) as TOutput;
    }

    /**
     * Checks if the given value can be converted by this converter.
     *
     * @param value - The value to check.
     * @returns True if the value can be converted, false otherwise.
     */
    canConvert(value: TInput): boolean {
        return typeof value === "object";
    }
}
