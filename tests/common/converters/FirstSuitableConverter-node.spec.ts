import { expect, test } from "@playwright/test";
import { BigIntToStringConverter } from "../../../src/common/converters/BigIntToStringConverter.ts";
import { BooleanToStringConverter } from "../../../src/common/converters/BooleanToStringConverter.ts";
import { ConversionError } from "../../../src/common/converters/errors/ConversionError.ts";
import { FirstSuitableConverter } from "../../../src/common/converters/FirstSuitableConverter.ts";
import { NumberToStringConverter } from "../../../src/common/converters/NumberToStringConverter.ts";
import { StringToBigIntConverter } from "../../../src/common/converters/StringToBigIntConverter.ts";
import { StringToBooleanConverter } from "../../../src/common/converters/StringToBooleanConverter.ts";
import { StringToNumberConverter } from "../../../src/common/converters/StringToNumberConverter.ts";
import type { FirstSuitableConverterInput as TInput, FirstSuitableConverterOutput as TOutput } from "./FirstSuitableConverter-shared.ts";
import { firstSuitableConverterData as data } from "./FirstSuitableConverter-shared.ts";

test.describe("Node.js env", () => {
    test.describe("FirstSuitableConverter", () => {
        test.describe("instance", () => {
            test.describe(".getReverseConverter()", () => {
                test("should return an instance of FirstSuitableConverter", () => {
                    const instance = createBigIntOrBooleanOrNumberToStringConverter();
                    const reverseConverter = instance.getReverseConverter();
                    expect(reverseConverter).toBeInstanceOf(FirstSuitableConverter);
                });

                test("should return a new instance of FirstSuitableConverter on subsequent calls", () => {
                    const instance = createBigIntOrBooleanOrNumberToStringConverter();
                    const reverseConverter1 = instance.getReverseConverter();
                    const reverseConverter2 = instance.getReverseConverter();
                    expect(reverseConverter1).not.toBe(reverseConverter2);
                });

                test("should return a FirstSuitableConverter with reverse converters in the same order as the original converters", () => {
                    const instance = createBigIntOrBooleanOrNumberToStringConverter();
                    const reverseConverter = instance.getReverseConverter();
                    const reverseConverters = reverseConverter.getConverters();
                    expect(reverseConverters).toHaveLength(3);
                    expect(reverseConverters[0]).toBeInstanceOf(StringToBigIntConverter);
                    expect(reverseConverters[1]).toBeInstanceOf(StringToBooleanConverter);
                    expect(reverseConverters[2]).toBeInstanceOf(StringToNumberConverter);
                });
            });

            test.describe(".convert()", () => {
                test("should convert valid values", () => {
                    const converter = createBigIntOrBooleanOrNumberToStringConverter();
                    for (const [testCaseIdx, testCase] of data.validCases.entries()) {
                        const result = converter.convert(testCase.input);
                        expect(result as unknown, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(testCase.output);
                    }
                });

                test("should throw ConversionError for invalid values", () => {
                    const converter = createBigIntOrBooleanOrNumberToStringConverter();
                    for (const [testCaseIdx, testCase] of data.invalidCases.entries()) {
                        expect(() => converter.convert(testCase as TInput), `CaseIndex=${testCaseIdx.toString()}`).toThrow(new ConversionError(testCase));
                    }
                });
            });

            test.describe(".canConvert()", () => {
                test("should return true for valid values", () => {
                    const converter = createBigIntOrBooleanOrNumberToStringConverter();
                    for (const [testCaseIdx, testCase] of data.validCases.entries()) {
                        const result = converter.canConvert(testCase.input);
                        expect(result, `CaseIndex=${testCaseIdx.toString()}`).toBe(true);
                    }
                });

                test("should return false for invalid values", () => {
                    const converter = createBigIntOrBooleanOrNumberToStringConverter();
                    for (const [testCaseIdx, testCase] of data.invalidCases.entries()) {
                        const result = converter.canConvert(testCase as TInput);
                        expect(result, `CaseIndex=${testCaseIdx.toString()}`).toBe(false);
                    }
                });
            });

            test.describe(".getConverters()", () => {
                test("should return the list of converters used by the FirstSuitableConverter", () => {
                    const converter = createBigIntOrBooleanOrNumberToStringConverter();
                    const converters = converter.getConverters();
                    expect(converters).toHaveLength(3);
                    expect(converters[0]).toBeInstanceOf(BigIntToStringConverter);
                    expect(converters[1]).toBeInstanceOf(BooleanToStringConverter);
                    expect(converters[2]).toBeInstanceOf(NumberToStringConverter);
                });
            });
        });
    });
});

function createBigIntOrBooleanOrNumberToStringConverter(): FirstSuitableConverter<TInput, TOutput> {
    return new FirstSuitableConverter<TInput, TOutput>([BigIntToStringConverter.getInstance(), BooleanToStringConverter.getInstance(), NumberToStringConverter.getInstance()]);
}
