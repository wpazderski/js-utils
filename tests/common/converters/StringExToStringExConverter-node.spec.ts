import { expect, test } from "@playwright/test";
import { ConversionError } from "../../../src/common/converters/errors/ConversionError.ts";
import { StringExToStringExConverter } from "../../../src/common/converters/StringExToStringExConverter.ts";
import { type StringExToStringExOneOfConverterValidValue as TOutput, data } from "./Shared.ts";
import { testConverterInNodeJsEnv } from "./testConverterInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testConverterInNodeJsEnv(StringExToStringExConverter, StringExToStringExConverter, data.stringExToStringEx, {
    static: {
        extraStaticBlock: () => {
            test.describe(".createOneOf()", () => {
                test("should return an instance of StringExToStringExConverter", () => {
                    const instance = StringExToStringExConverter.createOneOf(null);
                    expect(instance).toBeInstanceOf(StringExToStringExConverter);
                });

                test("should return a new instance on subsequent calls", () => {
                    const instance1 = StringExToStringExConverter.createOneOf(null);
                    const instance2 = StringExToStringExConverter.createOneOf(null);
                    expect(instance1).not.toBe(instance2);
                });

                test("should return a converter with correct validValues (null)", () => {
                    const instance1 = StringExToStringExConverter.createOneOf(null);
                    expect(instance1.getValidValues()).toBeNull();
                });

                test("should return a converter with correct validValues (array of strings)", () => {
                    const instance1 = StringExToStringExConverter.createOneOf<string, TOutput>(data.stringExToStringExOneOf.validValues);
                    expect(instance1.getValidValues()).toStrictEqual(data.stringExToStringExOneOf.validValues);
                });
            });
        },
    },
    instance: {
        getReverseConverter: () => {
            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return an instance of StringExToStringExConverter when called on a oneOf converter", () => {
                const instance = StringExToStringExConverter.createOneOf(null);
                const reverseConverter = instance.getReverseConverter();
                expect(reverseConverter).toBeInstanceOf(StringExToStringExConverter);
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return the same instance of StringExToStringExConverter on subsequent calls for oneOf converters if validValues=null", () => {
                const instance = StringExToStringExConverter.createOneOf(null);
                const reverseConverter1 = instance.getReverseConverter();
                const reverseConverter2 = instance.getReverseConverter();
                expect(reverseConverter1).toBe(reverseConverter2);
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return a new instance of StringExToStringExConverter on subsequent calls for oneOf converters if validValues is not null", () => {
                const instance = StringExToStringExConverter.createOneOf<string, TOutput>(data.stringExToStringExOneOf.validValues);
                const reverseConverter1 = instance.getReverseConverter();
                const reverseConverter2 = instance.getReverseConverter();
                expect(reverseConverter1).not.toBe(reverseConverter2);
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return a converter with correct validValues", () => {
                const instance = StringExToStringExConverter.createOneOf<string, TOutput>(data.stringExToStringExOneOf.validValues);
                const reverseConverter = instance.getReverseConverter();
                expect(reverseConverter.getValidValues()).toStrictEqual(data.stringExToStringExOneOf.validValues);
            });
        },
        canConvert: () => {
            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return true for valid values (passed to createOneOf())", () => {
                const converter = StringExToStringExConverter.createOneOf<string, TOutput>(data.stringExToStringExOneOf.validValues);
                for (const [testCaseIdx, testCase] of data.stringExToStringExOneOf.validCases.entries()) {
                    const canConvert = converter.canConvert(testCase.input);
                    expect(canConvert, `CaseIndex=${testCaseIdx.toString()}`).toBe(true);
                }
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return false for invalid values (not passed to createOneOf())", () => {
                const converter = StringExToStringExConverter.createOneOf<string, TOutput>(data.stringExToStringExOneOf.validValues);
                for (const [testCaseIdx, testCase] of data.stringExToStringExOneOf.invalidCases.entries()) {
                    const canConvert = converter.canConvert(testCase as string);
                    expect(canConvert, `CaseIndex=${testCaseIdx.toString()}`).toBe(false);
                }
            });
        },
        convert: () => {
            // eslint-disable-next-line playwright/require-top-level-describe
            test("should convert valid values (passed to createOneOf())", () => {
                const converter = StringExToStringExConverter.createOneOf<string, TOutput>(data.stringExToStringExOneOf.validValues);
                for (const [testCaseIdx, testCase] of data.stringExToStringExOneOf.validCases.entries()) {
                    const result = converter.convert(testCase.input);
                    expect(result as unknown, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(testCase.output);
                }
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should throw ConversionError for invalid values (not passed to createOneOf())", () => {
                const converter = StringExToStringExConverter.createOneOf<string, TOutput>(data.stringExToStringExOneOf.validValues);
                for (const [testCaseIdx, testCase] of data.stringExToStringExOneOf.invalidCases.entries()) {
                    expect(() => converter.convert(testCase as string), `CaseIndex=${testCaseIdx.toString()}`).toThrow(new ConversionError(testCase));
                }
            });
        },
        extraInstanceBlock: () => {
            test.describe(".getValidValues()", () => {
                test("should return null if validValues is null", () => {
                    const instance = StringExToStringExConverter.createOneOf(null);
                    expect(instance.getValidValues()).toBeNull();
                });

                test("should return a cloned array of valid values", () => {
                    const instance = StringExToStringExConverter.createOneOf<string, TOutput>(data.stringExToStringExOneOf.validValues);
                    const validValues = instance.getValidValues();
                    expect(validValues).toStrictEqual(data.stringExToStringExOneOf.validValues);
                    expect(validValues).not.toBe(data.stringExToStringExOneOf.validValues);
                });
            });
        },
    },
});
