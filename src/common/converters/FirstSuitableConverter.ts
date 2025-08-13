import { Converter } from "./Converter.ts";

/**
 * Converter that converts a value of type "TInput" to a value of type "TOutput" using the first suitable converter from a list of converters.
 *
 * @template TInput - The type of the input value.
 * @template TOutput - The type of the output value.
 */
export class FirstSuitableConverter<TInput, TOutput> extends Converter<TInput, TOutput> {
    /**
     * Array of converters to use for conversion.
     */
    protected converters: Array<Converter<TInput, TOutput>>;

    /**
     * Constructor that initializes the FirstSuitableConverter with an array of converters.
     *
     * @param converters - An array of converters to use for conversion.
     * @template TInput - The type of the input value.
     * @template TOutput - The type of the output value.
     */
    constructor(converters: Array<Converter<TInput, TOutput>>) {
        super();
        this.converters = converters;
    }

    /**
     * Returns the reverse converter for this converter.
     * Creates a new instance of FirstSuitableConverter with the reverse converters of each converter in the list.
     */
    getReverseConverter(): FirstSuitableConverter<TOutput, TInput> {
        const reverseConverters: Array<Converter<TOutput, TInput>> = [];
        for (const converter of this.converters) {
            const reverseConverter = converter.getReverseConverter();
            reverseConverters.push(reverseConverter);
        }
        return new FirstSuitableConverter<TOutput, TInput>(reverseConverters);
    }

    /**
     * Converts a value of type "TInput" to a value of type "TOutput" using the first suitable converter from the list.
     *
     * @param value - The value to convert.
     * @returns The converted value.
     *
     * @throws {@link ConversionError} - If the value cannot be converted.
     */
    convert(value: TInput): TOutput {
        const firstSuitableConverter = this.findFirstSuitableConverter(value);
        if (!firstSuitableConverter) {
            this.throwConversionError(value);
        }
        return firstSuitableConverter.convert(value);
    }

    /**
     * Checks if the given value can be converted by any of the converters in the list.
     *
     * @param value - The value to check.
     * @returns True if the value can be converted, false otherwise.
     */
    canConvert(value: TInput): boolean {
        const firstSuitableConverter = this.findFirstSuitableConverter(value);
        return firstSuitableConverter !== null;
    }

    /**
     * Returns the list of converters used by this FirstSuitableConverter.
     *
     * @returns An array of converters.
     */
    getConverters(): Array<Converter<TInput, TOutput>> {
        return this.converters;
    }

    /**
     * Finds the first suitable converter for the given value from the list of converters.
     *
     * @param value - The value to check.
     * @returns The first suitable converter if found, otherwise null.
     */
    protected findFirstSuitableConverter(value: TInput): Converter<TInput, TOutput> | null {
        let firstSuitableConverter: Converter<TInput, TOutput> | null = null;
        for (const converter of this.converters) {
            if (converter.canConvert(value)) {
                firstSuitableConverter = converter;
                break;
            }
        }
        return firstSuitableConverter;
    }
}
