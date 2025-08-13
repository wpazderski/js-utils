import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { convertDataToSerializable } from "@wpazderski/playwright-utils/webEnvExtensions/serialization/convertDataToSerializable.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";
import type { Converter as BaseConverter } from "../../../src/common/converters/Converter.ts";
import type { ConvertersTestDataSet, ExtraTests, TestCases } from "./Shared.ts";

type ConverterConstructor<TInput, TOutput> = typeof BaseConverter<TInput, TOutput> & {
    getInstance: () => BaseConverter<TInput, TOutput>;
};

type ConverterName =
    | "BigIntToStringConverter"
    | "BooleanToStringConverter"
    | "NumberToStringConverter"
    | "ObjectToStringConverter"
    | "StringToBigIntConverter"
    | "StringToBooleanConverter"
    | "StringToNumberConverter"
    | "StringToObjectConverter"
    | "IdentityConverter"
    | "StringExToStringExConverter";

// eslint-disable-next-line @typescript-eslint/max-params
export function testConverterInWebEnv<TInput, TOutput>(
    converterName: ConverterName,
    reverseConverterName: ConverterName,
    data: ConvertersTestDataSet<TInput, TOutput>,
    extraTests?: ExtraTests,
): void {
    test.describe("Web env", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/");
            PageUtils.pipeWebConsoleToStdout(page);
            await setupWebEnvExtensions(page);

            await extraTests?.beforeEach?.(page);
        });

        // eslint-disable-next-line playwright/valid-title
        test.describe(converterName, () => {
            test.describe("static", () => {
                test.describe(".getInstance()", () => {
                    test(`should return an instance of ${converterName}`, async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([converterName]) => {
                                const ConverterClass = window.jsUtils.common.converters[converterName] as ConverterConstructor<TInput, TOutput>;
                                window.playwrightUtils.expect(ConverterClass.getInstance()).toBeInstanceOf(ConverterClass);
                                return true;
                            },
                            [converterName] as [ConverterName],
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should return the same instance on subsequent calls", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([converterName]) => {
                                const ConverterClass = window.jsUtils.common.converters[converterName] as ConverterConstructor<TInput, TOutput>;
                                const instance1 = ConverterClass.getInstance();
                                const instance2 = ConverterClass.getInstance();
                                window.playwrightUtils.expect(instance1).toBe(instance2);
                                return true;
                            },
                            [converterName] as [ConverterName],
                        );
                        expect(isOk).toBe(true);
                    });

                    extraTests?.static?.getInstance?.();
                });

                extraTests?.static?.extraStaticBlock?.();
            });

            test.describe("instance", () => {
                test.describe(".getReverseConverter()", () => {
                    test(`should return an instance of ${reverseConverterName}`, async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([converterName, reverseConverterName]) => {
                                const ConverterClass = window.jsUtils.common.converters[converterName] as ConverterConstructor<TInput, TOutput>;
                                const ReverseConverterClass = window.jsUtils.common.converters[reverseConverterName] as ConverterConstructor<TOutput, TInput>;
                                const instance = ConverterClass.getInstance();
                                const reverseConverter = instance.getReverseConverter();
                                window.playwrightUtils.expect(reverseConverter).toBeInstanceOf(ReverseConverterClass);
                                return true;
                            },
                            [converterName, reverseConverterName] as [ConverterName, ConverterName],
                        );
                        expect(isOk).toBe(true);
                    });

                    test(`should return the same instance of ${reverseConverterName} on subsequent calls`, async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([converterName]) => {
                                const ConverterClass = window.jsUtils.common.converters[converterName] as ConverterConstructor<TInput, TOutput>;
                                const instance = ConverterClass.getInstance();
                                const reverseConverter1 = instance.getReverseConverter();
                                const reverseConverter2 = instance.getReverseConverter();
                                window.playwrightUtils.expect(reverseConverter1).toBe(reverseConverter2);
                                return true;
                            },
                            [converterName] as [ConverterName],
                        );
                        expect(isOk).toBe(true);
                    });

                    extraTests?.instance?.getReverseConverter?.();
                });

                test.describe(".convert()", () => {
                    test("should convert valid values", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([converterName, wrappedValidCases]) => {
                                const validCases = window.playwrightUtils.convertDataFromSerializable(wrappedValidCases) as TestCases<TInput, TOutput>;
                                const ConverterClass = window.jsUtils.common.converters[converterName] as ConverterConstructor<TInput, TOutput>;
                                const converter = ConverterClass.getInstance();
                                for (const [testCaseIdx, testCase] of validCases.entries()) {
                                    const result = converter.convert(testCase.input);
                                    if (typeof testCase.output === "function" && typeof result === "function") {
                                        window.playwrightUtils.expect(result.toString() === testCase.output.toString(), `CaseIndex=${testCaseIdx.toString()}`).toBe(true);
                                    } else {
                                        window.playwrightUtils.expect(result, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(testCase.output);
                                    }
                                }
                                return true;
                            },
                            [converterName, convertDataToSerializable(data.validCases)] as const,
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should throw ConversionError for invalid values", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([converterName, wrappedInvalidCases]) => {
                                const invalidCases = window.playwrightUtils.convertDataFromSerializable(wrappedInvalidCases) as TInput[];
                                const ConverterClass = window.jsUtils.common.converters[converterName] as ConverterConstructor<TInput, TOutput>;
                                const converter = ConverterClass.getInstance();
                                for (const [testCaseIdx, testCase] of invalidCases.entries()) {
                                    window.playwrightUtils
                                        .expect(() => converter.convert(testCase), `CaseIndex=${testCaseIdx.toString()}`)
                                        .toThrow(new window.jsUtils.common.converters.errors.ConversionError(testCase));
                                }
                                return true;
                            },
                            [converterName, convertDataToSerializable(data.invalidCases)] as const,
                        );
                        expect(isOk).toBe(true);
                    });

                    extraTests?.instance?.convert?.();
                });

                test.describe(".canConvert()", () => {
                    test("should return true for valid values", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([converterName, wrappedValidCases]) => {
                                const validCases = window.playwrightUtils.convertDataFromSerializable(wrappedValidCases) as TestCases<TInput, TOutput>;
                                const ConverterClass = window.jsUtils.common.converters[converterName] as ConverterConstructor<TInput, TOutput>;
                                const converter = ConverterClass.getInstance();
                                for (const [testCaseIdx, testCase] of validCases.entries()) {
                                    const result = converter.canConvert(testCase.input);
                                    window.playwrightUtils.expect(result, `CaseIndex=${testCaseIdx.toString()}`).toBe(true);
                                }
                                return true;
                            },
                            [converterName, convertDataToSerializable(data.validCases)] as const,
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should return false for invalid values", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([converterName, wrappedInvalidCases]) => {
                                const invalidCases = window.playwrightUtils.convertDataFromSerializable(wrappedInvalidCases) as TInput[];
                                const ConverterClass = window.jsUtils.common.converters[converterName] as ConverterConstructor<TInput, TOutput>;
                                const converter = ConverterClass.getInstance();
                                for (const [testCaseIdx, testCase] of invalidCases.entries()) {
                                    const result = converter.canConvert(testCase);
                                    window.playwrightUtils.expect(result, `CaseIndex=${testCaseIdx.toString()}`).toBe(false);
                                }
                                return true;
                            },
                            [converterName, convertDataToSerializable(data.invalidCases)] as const,
                        );
                        expect(isOk).toBe(true);
                    });

                    extraTests?.instance?.canConvert?.();
                });

                extraTests?.instance?.extraInstanceBlock?.();
            });
        });
    });
}
