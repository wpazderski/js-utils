import { expect, test } from "@playwright/test";
import type { Converter as BaseConverter } from "../../../src/common/converters/Converter.ts";
import { ConversionError } from "../../../src/common/converters/errors/ConversionError.ts";
import type { ConvertersTestDataSet, ExtraTests } from "./Shared.ts";

type ConverterConstructor<TInput, TOutput> = typeof BaseConverter<TInput, TOutput> & {
    getInstance: () => BaseConverter<TInput, TOutput>;
};

// eslint-disable-next-line @typescript-eslint/max-params
export function testConverterInNodeJsEnv<TInput, TOutput>(
    ConverterClass: ConverterConstructor<TInput, TOutput>,
    ReverseConverterClass: ConverterConstructor<TOutput, TInput>,
    data: ConvertersTestDataSet<TInput, TOutput>,
    extraTests?: ExtraTests,
): void {
    const converterName = ConverterClass.name;
    const reverseConverterName = ReverseConverterClass.name;
    test.describe("Node.js env", () => {
        test.beforeEach(async ({ page }) => {
            await extraTests?.beforeEach?.(page);
        });

        // eslint-disable-next-line playwright/valid-title
        test.describe(converterName, () => {
            test.describe("static", () => {
                test.describe(".getInstance()", () => {
                    test(`should return an instance of ${converterName}`, () => {
                        const instance = ConverterClass.getInstance();
                        expect(instance).toBeInstanceOf(ConverterClass);
                    });

                    test("should return the same instance on subsequent calls", () => {
                        const instance1 = ConverterClass.getInstance();
                        const instance2 = ConverterClass.getInstance();
                        expect(instance1).toBe(instance2);
                    });

                    extraTests?.static?.getInstance?.();
                });

                extraTests?.static?.extraStaticBlock?.();
            });

            test.describe("instance", () => {
                test.describe(".getReverseConverter()", () => {
                    test(`should return an instance of ${reverseConverterName}`, () => {
                        const instance = ConverterClass.getInstance();
                        const reverseConverter = instance.getReverseConverter();
                        expect(reverseConverter).toBeInstanceOf(ReverseConverterClass);
                    });

                    test(`should return the same instance of ${reverseConverterName} on subsequent calls`, () => {
                        const instance = ConverterClass.getInstance();
                        const reverseConverter1 = instance.getReverseConverter();
                        const reverseConverter2 = instance.getReverseConverter();
                        expect(reverseConverter1).toBe(reverseConverter2);
                    });

                    extraTests?.instance?.getReverseConverter?.();
                });

                test.describe(".convert()", () => {
                    test("should convert valid values", () => {
                        const converter = ConverterClass.getInstance();
                        for (const [testCaseIdx, testCase] of data.validCases.entries()) {
                            const result = converter.convert(testCase.input);
                            expect(result as unknown, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(testCase.output);
                        }
                    });

                    test("should throw ConversionError for invalid values", () => {
                        const converter = ConverterClass.getInstance();
                        for (const [testCaseIdx, testCase] of data.invalidCases.entries()) {
                            expect(() => converter.convert(testCase as TInput), `CaseIndex=${testCaseIdx.toString()}`).toThrow(new ConversionError(testCase));
                        }
                    });

                    extraTests?.instance?.convert?.();
                });

                test.describe(".canConvert()", () => {
                    test("should return true for valid values", () => {
                        const converter = ConverterClass.getInstance();
                        for (const [testCaseIdx, testCase] of data.validCases.entries()) {
                            const result = converter.canConvert(testCase.input);
                            expect(result, `CaseIndex=${testCaseIdx.toString()}`).toBe(true);
                        }
                    });

                    test("should return false for invalid values", () => {
                        const converter = ConverterClass.getInstance();
                        for (const [testCaseIdx, testCase] of data.invalidCases.entries()) {
                            const result = converter.canConvert(testCase as TInput);
                            expect(result, `CaseIndex=${testCaseIdx.toString()}`).toBe(false);
                        }
                    });

                    extraTests?.instance?.canConvert?.();
                });

                extraTests?.instance?.extraInstanceBlock?.();
            });
        });
    });
}
