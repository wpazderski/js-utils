import { expect, test } from "@playwright/test";
import { StringUtils } from "../../src/common/StringUtils.ts";
import { data } from "./StringUtils-shared.ts";
import type * as types from "./StringUtils-shared.ts";

function testStringUtilsCommonSingleStringFunction(functionName: types.CommonSingleStringFunctionName, testDataArr: types.CommonSingleStringFunctionData[]): void {
    test.describe(`.${functionName}()`, () => {
        for (const testData of testDataArr) {
            const { testName, testCases } = testData;
            // eslint-disable-next-line playwright/valid-title
            test(testName, () => {
                for (const [testCaseIdx, testCase] of testCases.entries()) {
                    const { str, expectedResult } = { ...testCase };
                    const result = StringUtils[functionName](str);
                    expect(result, `CaseIndex=${testCaseIdx.toString()}`).toStrictEqual(expectedResult);
                }
            });
        }
    });
}

test.describe("Node.js env", () => {
    test.describe("StringUtils", () => {
        test.describe("static", () => {
            /* eslint-disable playwright/require-hook */
            testStringUtilsCommonSingleStringFunction("lowerCaseFirstLetter", data.static.lowerCaseFirstLetter);
            testStringUtilsCommonSingleStringFunction("upperCaseFirstLetter", data.static.upperCaseFirstLetter);
            testStringUtilsCommonSingleStringFunction("camelCaseToKebabCase", data.static.camelCaseToKebabCase);
            testStringUtilsCommonSingleStringFunction("kebabCaseToCamelCase", data.static.kebabCaseToCamelCase);
            testStringUtilsCommonSingleStringFunction("pascalCaseToKebabCase", data.static.pascalCaseToKebabCase);
            testStringUtilsCommonSingleStringFunction("kebabCaseToPascalCase", data.static.kebabCaseToPascalCase);
            /* eslint-enable playwright/require-hook */
        });
    });
});
