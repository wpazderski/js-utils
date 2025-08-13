import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";
import { data } from "./ArrayUtils-shared.ts";
import type * as types from "./ArrayUtils-shared.ts";

type CommonSingleArrayFunctionPageEvaluateArgs = [readonly unknown[], types.ComparatorName | undefined, types.CommonSingleArrayFunctionName];
type CommonDoubleArrayFunctionPageEvaluateArgs = [readonly unknown[], readonly unknown[], types.ComparatorName | undefined, types.CommonDoubleArrayFunctionName];

function testArrayUtilsCommonDoubleArrayFunction(functionName: types.CommonDoubleArrayFunctionName, testDataArr: types.CommonDoubleArrayFunctionData[]): void {
    test.describe(`.${functionName}()`, () => {
        for (const testData of testDataArr) {
            const { testName, testCases } = testData;
            // eslint-disable-next-line playwright/valid-title
            test(testName, async ({ page }) => {
                for (const [testCaseIdx, testCase] of testCases.entries()) {
                    const { arr1, arr2, expectedResult, comparator: comparatorName } = { comparator: undefined, ...testCase };
                    const result = await page.evaluate(
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        ([arr1, arr2, comparatorName, functionName]) => {
                            const comparator = comparatorName === undefined ? undefined : window.playwrightUtils.comparators[comparatorName];
                            return window.jsUtils.common.ArrayUtils[functionName](arr1, arr2, comparator);
                        },
                        [arr1, arr2, comparatorName, functionName] as CommonDoubleArrayFunctionPageEvaluateArgs,
                    );
                    expect(result, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(expectedResult);
                }
            });
        }
    });
}

function testArrayUtilsCommonSingleArrayFunction(functionName: types.CommonSingleArrayFunctionName, testDataArr: types.CommonSingleArrayFunctionData[]): void {
    test.describe(`.${functionName}()`, () => {
        for (const testData of testDataArr) {
            const { testName, testCases } = testData;
            // eslint-disable-next-line playwright/valid-title
            test(testName, async ({ page }) => {
                for (const [testCaseIdx, testCase] of testCases.entries()) {
                    const { arr, expectedResult, comparator: comparatorName } = { comparator: undefined, ...testCase };
                    const result = await page.evaluate(
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        ([arr, comparatorName, functionName]) => {
                            const comparator = comparatorName === undefined ? undefined : window.playwrightUtils.comparators[comparatorName];
                            return window.jsUtils.common.ArrayUtils[functionName](arr, comparator);
                        },
                        [arr, comparatorName, functionName] as CommonSingleArrayFunctionPageEvaluateArgs,
                    );
                    expect(result, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(expectedResult);
                }
            });
        }
    });
}

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("ArrayUtils", () => {
        test.describe("static", () => {
            /* eslint-disable playwright/require-hook */
            testArrayUtilsCommonDoubleArrayFunction("getExtraItems", data.static.getExtraItems);
            testArrayUtilsCommonDoubleArrayFunction("getMissingItems", data.static.getMissingItems);
            testArrayUtilsCommonDoubleArrayFunction("getCommonItems", data.static.getCommonItems);
            testArrayUtilsCommonSingleArrayFunction("getUniqueItems", data.static.getUniqueItems);
            testArrayUtilsCommonDoubleArrayFunction("areEqual", data.static.areEqual);
            testArrayUtilsCommonDoubleArrayFunction("areEqualInAnyOrder", data.static.areEqualInAnyOrder);
            /* eslint-enable playwright/require-hook */
        });
    });
});
