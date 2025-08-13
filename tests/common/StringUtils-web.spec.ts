import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { data } from "./StringUtils-shared.ts";
import type * as types from "./StringUtils-shared.ts";

type CommonSingleStringFunctionPageEvaluateArgs = [string, types.CommonSingleStringFunctionName];

function testStringUtilsCommonSingleStringFunction(functionName: types.CommonSingleStringFunctionName, testDataArr: types.CommonSingleStringFunctionData[]): void {
    test.describe(`.${functionName}()`, () => {
        for (const testData of testDataArr) {
            const { testName, testCases } = testData;
            // eslint-disable-next-line playwright/valid-title
            test(testName, async ({ page }) => {
                for (const [testCaseIdx, testCase] of testCases.entries()) {
                    const { str, expectedResult } = { ...testCase };
                    const result = await page.evaluate(
                        // eslint-disable-next-line @typescript-eslint/no-shadow
                        ([str, functionName]) => {
                            return window.jsUtils.common.StringUtils[functionName](str);
                        },
                        [str, functionName] as CommonSingleStringFunctionPageEvaluateArgs,
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
    });

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
