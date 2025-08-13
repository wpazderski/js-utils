import { expect, test } from "@playwright/test";
import { convertDataToSerializable } from "@wpazderski/playwright-utils/webEnvExtensions/serialization/convertDataToSerializable.js";
import { type StringExToStringExOneOfConverterValidValue as TOutput, type TestCases, data } from "./Shared.ts";
import { testConverterInWebEnv } from "./testConverterInWebEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testConverterInWebEnv("StringExToStringExConverter", "StringExToStringExConverter", data.stringExToStringEx, {
    static: {
        extraStaticBlock: () => {
            test.describe(".createOneOf()", () => {
                test("should return an instance of StringExToStringExConverter", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const instance = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf(null);
                        window.playwrightUtils.expect(instance).toBeInstanceOf(window.jsUtils.common.converters.StringExToStringExConverter);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should return a new instance on subsequent calls", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const instance1 = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf(null);
                        const instance2 = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf(null);
                        window.playwrightUtils.expect(instance1).not.toBe(instance2);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should return a converter with correct validValues (null)", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const instance1 = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf(null);
                        window.playwrightUtils.expect(instance1.getValidValues()).toBeNull();
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should return a converter with correct validValues (array of strings)", async ({ page }) => {
                    const isOk = await page.evaluate(
                        ([wrappedValidValues]) => {
                            const validValues = window.playwrightUtils.convertDataFromSerializable(wrappedValidValues) as TOutput[];
                            const instance1 = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf<string, TOutput>(validValues);
                            window.playwrightUtils.expect(instance1.getValidValues()).toStrictEqual(validValues);
                            return true;
                        },
                        [convertDataToSerializable(data.stringExToStringExOneOf.validValues)] as const,
                    );
                    expect(isOk).toBe(true);
                });
            });
        },
    },
    instance: {
        getReverseConverter: () => {
            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return an instance of StringExToStringExConverter when called on a oneOf converter", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const instance = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf(null);
                    const reverseConverter = instance.getReverseConverter();
                    window.playwrightUtils.expect(reverseConverter).toBeInstanceOf(window.jsUtils.common.converters.StringExToStringExConverter);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return the same instance of StringExToStringExConverter on subsequent calls for oneOf converters if validValues=null", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const instance = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf(null);
                    const reverseConverter1 = instance.getReverseConverter();
                    const reverseConverter2 = instance.getReverseConverter();
                    window.playwrightUtils.expect(reverseConverter1).toBe(reverseConverter2);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return a new instance of StringExToStringExConverter on subsequent calls for oneOf converters if validValues is not null", async ({ page }) => {
                const isOk = await page.evaluate(
                    ([wrappedValidValues]) => {
                        const validValues = window.playwrightUtils.convertDataFromSerializable(wrappedValidValues) as TOutput[];
                        const instance = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf<string, TOutput>(validValues);
                        const reverseConverter1 = instance.getReverseConverter();
                        const reverseConverter2 = instance.getReverseConverter();
                        window.playwrightUtils.expect(reverseConverter1).not.toBe(reverseConverter2);
                        return true;
                    },
                    [convertDataToSerializable(data.stringExToStringExOneOf.validValues)] as const,
                );
                expect(isOk).toBe(true);
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return a converter with correct validValues", async ({ page }) => {
                const isOk = await page.evaluate(
                    ([wrappedValidValues]) => {
                        const validValues = window.playwrightUtils.convertDataFromSerializable(wrappedValidValues) as TOutput[];
                        const instance = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf<string, TOutput>(validValues);
                        const reverseConverter = instance.getReverseConverter();
                        window.playwrightUtils.expect(reverseConverter.getValidValues()).toStrictEqual(validValues);
                        return true;
                    },
                    [convertDataToSerializable(data.stringExToStringExOneOf.validValues)] as const,
                );
                expect(isOk).toBe(true);
            });
        },
        canConvert: () => {
            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return true for valid values (passed to createOneOf())", async ({ page }) => {
                const isOk = await page.evaluate(
                    ([wrappedValidValues, wrappedValidCases]) => {
                        const validValues = window.playwrightUtils.convertDataFromSerializable(wrappedValidValues) as TOutput[];
                        const validCases = window.playwrightUtils.convertDataFromSerializable(wrappedValidCases) as TestCases<TOutput, TOutput>;
                        const converter = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf<string, TOutput>(validValues);
                        for (const [testCaseIdx, testCase] of validCases.entries()) {
                            const canConvert = converter.canConvert(testCase.input);
                            window.playwrightUtils.expect(canConvert, `CaseIndex=${testCaseIdx.toString()}`).toBe(true);
                        }
                        return true;
                    },
                    [convertDataToSerializable(data.stringExToStringExOneOf.validValues), convertDataToSerializable(data.stringExToStringExOneOf.validCases)] as const,
                );
                expect(isOk).toBe(true);
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should return false for invalid values (not passed to createOneOf())", async ({ page }) => {
                const isOk = await page.evaluate(
                    ([wrappedValidValues, wrappedInvalidCases]) => {
                        const validValues = window.playwrightUtils.convertDataFromSerializable(wrappedValidValues) as TOutput[];
                        const invalidCases = window.playwrightUtils.convertDataFromSerializable(wrappedInvalidCases) as TOutput[];
                        const converter = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf<string, TOutput>(validValues);
                        for (const [testCaseIdx, testCase] of invalidCases.entries()) {
                            const canConvert = converter.canConvert(testCase as string);
                            window.playwrightUtils.expect(canConvert, `CaseIndex=${testCaseIdx.toString()}`).toBe(false);
                        }
                        return true;
                    },
                    [convertDataToSerializable(data.stringExToStringExOneOf.validValues), convertDataToSerializable(data.stringExToStringExOneOf.invalidCases)] as const,
                );
                expect(isOk).toBe(true);
            });
        },
        convert: () => {
            // eslint-disable-next-line playwright/require-top-level-describe
            test("should convert valid values (passed to createOneOf())", async ({ page }) => {
                const isOk = await page.evaluate(
                    ([wrappedValidValues, wrappedValidCases]) => {
                        const validValues = window.playwrightUtils.convertDataFromSerializable(wrappedValidValues) as TOutput[];
                        const validCases = window.playwrightUtils.convertDataFromSerializable(wrappedValidCases) as TestCases<TOutput, TOutput>;
                        const converter = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf<string, TOutput>(validValues);
                        for (const [testCaseIdx, testCase] of validCases.entries()) {
                            const result = converter.convert(testCase.input);
                            window.playwrightUtils.expect(result as unknown, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(testCase.output);
                        }
                        return true;
                    },
                    [convertDataToSerializable(data.stringExToStringExOneOf.validValues), convertDataToSerializable(data.stringExToStringExOneOf.validCases)] as const,
                );
                expect(isOk).toBe(true);
            });

            // eslint-disable-next-line playwright/require-top-level-describe
            test("should throw ConversionError for invalid values (not passed to createOneOf())", async ({ page }) => {
                const isOk = await page.evaluate(
                    ([wrappedValidValues, wrappedInvalidCases]) => {
                        const validValues = window.playwrightUtils.convertDataFromSerializable(wrappedValidValues) as TOutput[];
                        const invalidCases = window.playwrightUtils.convertDataFromSerializable(wrappedInvalidCases) as TOutput[];
                        const converter = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf<string, TOutput>(validValues);
                        for (const [testCaseIdx, testCase] of invalidCases.entries()) {
                            window.playwrightUtils
                                .expect(() => converter.convert(testCase as string), `CaseIndex=${testCaseIdx.toString()}`)
                                .toThrow(new window.jsUtils.common.converters.errors.ConversionError(testCase));
                        }
                        return true;
                    },
                    [convertDataToSerializable(data.stringExToStringExOneOf.validValues), convertDataToSerializable(data.stringExToStringExOneOf.invalidCases)] as const,
                );
                expect(isOk).toBe(true);
            });
        },
        extraInstanceBlock: () => {
            test.describe(".getValidValues()", () => {
                test("should return null if validValues is null", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const instance = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf(null);
                        window.playwrightUtils.expect(instance.getValidValues()).toBeNull();
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should return a cloned array of valid values", async ({ page }) => {
                    const isOk = await page.evaluate(
                        ([wrappedValidValues]) => {
                            const validValues = window.playwrightUtils.convertDataFromSerializable(wrappedValidValues) as TOutput[];
                            const instance = window.jsUtils.common.converters.StringExToStringExConverter.createOneOf<string, TOutput>(validValues);
                            const actualValidValues = instance.getValidValues();
                            window.playwrightUtils.expect(actualValidValues).toStrictEqual(validValues);
                            window.playwrightUtils.expect(actualValidValues).not.toBe(validValues);
                            return true;
                        },
                        [convertDataToSerializable(data.stringExToStringExOneOf.validValues)] as const,
                    );
                    expect(isOk).toBe(true);
                });
            });
        },
    },
});
