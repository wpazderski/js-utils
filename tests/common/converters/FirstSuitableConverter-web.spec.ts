import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { convertDataToSerializable } from "@wpazderski/playwright-utils/webEnvExtensions/serialization/convertDataToSerializable.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";
import type { FirstSuitableConverter } from "../../../src/common/converters/FirstSuitableConverter.ts";
import type { FirstSuitableConverterInput as TInput, FirstSuitableConverterOutput as TOutput } from "./FirstSuitableConverter-shared.ts";
import { firstSuitableConverterData as data } from "./FirstSuitableConverter-shared.ts";
import type { TestCases } from "./Shared.ts";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);

        await page.evaluate(() => {
            (window as unknown as WindowEx).createBigIntOrBooleanOrNumberToStringConverter = () => {
                return new window.jsUtils.common.converters.FirstSuitableConverter<TInput, TOutput>([
                    window.jsUtils.common.converters.BigIntToStringConverter.getInstance(),
                    window.jsUtils.common.converters.BooleanToStringConverter.getInstance(),
                    window.jsUtils.common.converters.NumberToStringConverter.getInstance(),
                ]);
            };
        });
    });

    test.describe("FirstSuitableConverter", () => {
        test.describe("instance", () => {
            test.describe(".getReverseConverter()", () => {
                test("should return an instance of FirstSuitableConverter", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const instance = (window as unknown as WindowEx).createBigIntOrBooleanOrNumberToStringConverter();
                        const reverseConverter = instance.getReverseConverter();
                        window.playwrightUtils.expect(reverseConverter).toBeInstanceOf(window.jsUtils.common.converters.FirstSuitableConverter);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should return a new instance of FirstSuitableConverter on subsequent calls", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const instance = (window as unknown as WindowEx).createBigIntOrBooleanOrNumberToStringConverter();
                        const reverseConverter1 = instance.getReverseConverter();
                        const reverseConverter2 = instance.getReverseConverter();
                        window.playwrightUtils.expect(reverseConverter1).not.toBe(reverseConverter2);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should return a FirstSuitableConverter with reverse converters in the same order as the original converters", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const instance = (window as unknown as WindowEx).createBigIntOrBooleanOrNumberToStringConverter();
                        const reverseConverter = instance.getReverseConverter();
                        const reverseConverters = reverseConverter.getConverters();
                        window.playwrightUtils.expect(reverseConverters).toHaveLength(3);
                        window.playwrightUtils.expect(reverseConverters[0]).toBeInstanceOf(window.jsUtils.common.converters.StringToBigIntConverter);
                        window.playwrightUtils.expect(reverseConverters[1]).toBeInstanceOf(window.jsUtils.common.converters.StringToBooleanConverter);
                        window.playwrightUtils.expect(reverseConverters[2]).toBeInstanceOf(window.jsUtils.common.converters.StringToNumberConverter);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".convert()", () => {
                test("should convert valid values", async ({ page }) => {
                    const isOk = await page.evaluate(
                        ([wrappedValidCases]) => {
                            const validCases = window.playwrightUtils.convertDataFromSerializable(wrappedValidCases) as TestCases<TInput, TOutput>;
                            const converter = (window as unknown as WindowEx).createBigIntOrBooleanOrNumberToStringConverter();
                            for (const [testCaseIdx, testCase] of validCases.entries()) {
                                const result = converter.convert(testCase.input);
                                window.playwrightUtils.expect(result as unknown, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(testCase.output);
                            }
                            return true;
                        },
                        [convertDataToSerializable(data.validCases)] as const,
                    );
                    expect(isOk).toBe(true);
                });

                test("should throw ConversionError for invalid values", async ({ page }) => {
                    const isOk = await page.evaluate(
                        ([wrappedInvalidCases]) => {
                            const invalidCases = window.playwrightUtils.convertDataFromSerializable(wrappedInvalidCases) as TInput[];
                            const converter = (window as unknown as WindowEx).createBigIntOrBooleanOrNumberToStringConverter();
                            for (const [testCaseIdx, testCase] of invalidCases.entries()) {
                                window.playwrightUtils
                                    .expect(() => converter.convert(testCase), `CaseIndex=${testCaseIdx.toString()}`)
                                    .toThrow(new window.jsUtils.common.converters.errors.ConversionError(testCase));
                            }
                            return true;
                        },
                        [convertDataToSerializable(data.invalidCases)] as const,
                    );
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".canConvert()", () => {
                test("should return true for valid values", async ({ page }) => {
                    const isOk = await page.evaluate(
                        ([wrappedValidCases]) => {
                            const validCases = window.playwrightUtils.convertDataFromSerializable(wrappedValidCases) as TestCases<TInput, TOutput>;
                            const converter = (window as unknown as WindowEx).createBigIntOrBooleanOrNumberToStringConverter();
                            for (const [testCaseIdx, testCase] of validCases.entries()) {
                                const result = converter.canConvert(testCase.input);
                                window.playwrightUtils.expect(result, `CaseIndex=${testCaseIdx.toString()}`).toBe(true);
                            }
                            return true;
                        },
                        [convertDataToSerializable(data.validCases)] as const,
                    );
                    expect(isOk).toBe(true);
                });

                test("should return false for invalid values", async ({ page }) => {
                    const isOk = await page.evaluate(
                        ([wrappedInvalidCases]) => {
                            const invalidCases = window.playwrightUtils.convertDataFromSerializable(wrappedInvalidCases) as TInput[];
                            const converter = (window as unknown as WindowEx).createBigIntOrBooleanOrNumberToStringConverter();
                            for (const [testCaseIdx, testCase] of invalidCases.entries()) {
                                const result = converter.canConvert(testCase);
                                window.playwrightUtils.expect(result, `CaseIndex=${testCaseIdx.toString()}`).toBe(false);
                            }
                            return true;
                        },
                        [convertDataToSerializable(data.invalidCases)] as const,
                    );
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".getConverters()", () => {
                test("should return the list of converters used by the FirstSuitableConverter", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const converter = (window as unknown as WindowEx).createBigIntOrBooleanOrNumberToStringConverter();
                        const converters = converter.getConverters();
                        window.playwrightUtils.expect(converters).toHaveLength(3);
                        window.playwrightUtils.expect(converters[0]).toBeInstanceOf(window.jsUtils.common.converters.BigIntToStringConverter);
                        window.playwrightUtils.expect(converters[1]).toBeInstanceOf(window.jsUtils.common.converters.BooleanToStringConverter);
                        window.playwrightUtils.expect(converters[2]).toBeInstanceOf(window.jsUtils.common.converters.NumberToStringConverter);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });
        });
    });
});

interface WindowEx extends Window {
    createBigIntOrBooleanOrNumberToStringConverter: () => FirstSuitableConverter<TInput, TOutput>;
}
