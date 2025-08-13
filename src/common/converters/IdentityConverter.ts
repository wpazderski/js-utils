import { Converter } from "./Converter.ts";

/**
 * Converter that converts given value to the same value (no-op).
 * This is useful when a converter has to be provided, but no actual conversion is needed.
 *
 * @template T - The type of the value to convert; also the type of the value returned by convert().
 */
export class IdentityConverter<T = unknown> extends Converter<T, T> {
    /**
     * Singleton instance of the IdentityConverter.
     */
    private static readonly instance: IdentityConverter = new IdentityConverter();

    /**
     * Returns the singleton instance of the IdentityConverter.
     */
    static getInstance<T = unknown>(): IdentityConverter<T> {
        return this.instance as IdentityConverter<T>;
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
    getReverseConverter(): IdentityConverter<T> {
        return IdentityConverter.getInstance();
    }

    /**
     * Converts a value of type "T" to a value of type "T".
     *
     * @param value - The value to convert.
     * @returns The converted value of type "T"; strictly equal to the input value.
     */
    convert(value: T): T {
        return value;
    }

    /**
     * Checks if the given value can be converted by this converter.
     * Since this converter is a no-op, it can convert any value, therefore it always returns true.
     */
    canConvert(_value: T): true {
        return true;
    }
}
