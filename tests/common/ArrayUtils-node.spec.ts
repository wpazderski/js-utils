import { expect, test } from "@playwright/test";
import { comparators } from "@wpazderski/playwright-utils/webEnvExtensions/comparators/comparators.js";
import { ArrayUtils } from "../../src/common/ArrayUtils.ts";
import { data } from "./ArrayUtils-shared.ts";
import type * as types from "./ArrayUtils-shared.ts";

function testArrayUtilsCommonDoubleArrayFunction(functionName: types.CommonDoubleArrayFunctionName, testDataArr: types.CommonDoubleArrayFunctionData[]): void {
    test.describe(`.${functionName}()`, () => {
        for (const testData of testDataArr) {
            const { testName, testCases } = testData;
            // eslint-disable-next-line playwright/valid-title
            test(testName, () => {
                for (const [testCaseIdx, testCase] of testCases.entries()) {
                    const { arr1, arr2, expectedResult, comparator: comparatorName } = { comparator: undefined, ...testCase };
                    // eslint-disable-next-line playwright/no-conditional-in-test
                    const comparator = comparatorName === undefined ? undefined : comparators[comparatorName];
                    const result = ArrayUtils[functionName](arr1, arr2, comparator);
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
            test(testName, () => {
                for (const [testCaseIdx, testCase] of testCases.entries()) {
                    const { arr, expectedResult, comparator: comparatorName } = { comparator: undefined, ...testCase };
                    // eslint-disable-next-line playwright/no-conditional-in-test
                    const comparator = comparatorName === undefined ? undefined : comparators[comparatorName];
                    const result = ArrayUtils[functionName](arr, comparator);
                    expect(result, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(expectedResult);
                }
            });
        }
    });
}

test.describe("Node.js env", () => {
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
