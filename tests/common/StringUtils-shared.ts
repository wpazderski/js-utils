import type { StringUtils } from "../../src/common/StringUtils.ts";

export type CommonSingleStringFunctionName = keyof Pick<
    typeof StringUtils,
    "lowerCaseFirstLetter" | "upperCaseFirstLetter" | "camelCaseToKebabCase" | "kebabCaseToCamelCase" | "pascalCaseToKebabCase" | "kebabCaseToPascalCase"
>;

export interface CommonSingleStringFunctionTestCase {
    str: string;
    expectedResult: string;
}

export interface CommonSingleStringFunctionData {
    testName: string;
    testCases: CommonSingleStringFunctionTestCase[];
}

export interface StringUtilsTestData {
    static: Record<CommonSingleStringFunctionName, CommonSingleStringFunctionData[]>;
}

interface CamelKebabPascalCaseString {
    camel: string;
    kebab: string;
    pascal: string;
    skipTestingMethods?: Array<"camelCaseToKebabCase" | "kebabCaseToCamelCase" | "pascalCaseToKebabCase" | "kebabCaseToPascalCase"> | undefined;
}

const camelKebabPascalCaseStrings: CamelKebabPascalCaseString[] = [
    {
        camel: "loremIpsumDolorSitAmet",
        kebab: "lorem-ipsum-dolor-sit-amet",
        pascal: "LoremIpsumDolorSitAmet",
    },
    {
        camel: "stringWithNumbers123LoremIpsum",
        kebab: "string-with-numbers123-lorem-ipsum",
        pascal: "StringWithNumbers123LoremIpsum",
    },
    {
        camel: "withConsecutiveDashes",
        kebab: "with---consecutive-dashes",
        pascal: "WithConsecutiveDashes",
        skipTestingMethods: ["camelCaseToKebabCase", "pascalCaseToKebabCase"],
    },
    {
        camel: "",
        kebab: "",
        pascal: "",
    },
];

export const data: StringUtilsTestData = {
    static: {
        lowerCaseFirstLetter: [
            {
                testName: "returns correct strings for basic cases",
                testCases: [
                    {
                        str: "lorem ipsum dolor sit amet",
                        expectedResult: "lorem ipsum dolor sit amet",
                    },
                    {
                        str: "Lorem ipsum dolor sit amet",
                        expectedResult: "lorem ipsum dolor sit amet",
                    },
                    {
                        str: "LOREM IPSUM DOLOR SIT AMET",
                        expectedResult: "lOREM IPSUM DOLOR SIT AMET",
                    },
                    {
                        str: " Lorem ipsum dolor sit amet",
                        expectedResult: " Lorem ipsum dolor sit amet",
                    },
                    {
                        str: "1234567890",
                        expectedResult: "1234567890",
                    },
                    {
                        str: "",
                        expectedResult: "",
                    },
                ],
            },
            {
                testName: "converts only the first letter to lowercase for multiline strings",
                testCases: [
                    {
                        str: "Lorem ipsum dolor sit amet\nConsectetur adipiscing elit",
                        expectedResult: "lorem ipsum dolor sit amet\nConsectetur adipiscing elit",
                    },
                    {
                        str: "Lorem ipsum dolor sit amet\r\nConsectetur adipiscing elit",
                        expectedResult: "lorem ipsum dolor sit amet\r\nConsectetur adipiscing elit",
                    },
                ],
            },
        ],
        upperCaseFirstLetter: [
            {
                testName: "returns correct strings for basic cases",
                testCases: [
                    {
                        str: "lorem ipsum dolor sit amet",
                        expectedResult: "Lorem ipsum dolor sit amet",
                    },
                    {
                        str: "Lorem ipsum dolor sit amet",
                        expectedResult: "Lorem ipsum dolor sit amet",
                    },
                    {
                        str: "LOREM IPSUM DOLOR SIT AMET",
                        expectedResult: "LOREM IPSUM DOLOR SIT AMET",
                    },
                    {
                        str: " lorem ipsum dolor sit amet",
                        expectedResult: " lorem ipsum dolor sit amet",
                    },
                    {
                        str: "1234567890",
                        expectedResult: "1234567890",
                    },
                    {
                        str: "",
                        expectedResult: "",
                    },
                ],
            },
            {
                testName: "converts only the first letter to uppercase for multiline strings",
                testCases: [
                    {
                        str: "lorem ipsum dolor sit amet\nconsectetur adipiscing elit",
                        expectedResult: "Lorem ipsum dolor sit amet\nconsectetur adipiscing elit",
                    },
                    {
                        str: "lorem ipsum dolor sit amet\r\nconsectetur adipiscing elit",
                        expectedResult: "Lorem ipsum dolor sit amet\r\nconsectetur adipiscing elit",
                    },
                ],
            },
        ],
        camelCaseToKebabCase: [
            {
                testName: "returns correct strings for basic cases",
                testCases: camelKebabPascalCaseStrings
                    .filter((str) => str.skipTestingMethods?.includes("camelCaseToKebabCase") !== true)
                    .map((str) => ({
                        str: str.camel,
                        expectedResult: str.kebab,
                    })),
            },
        ],
        kebabCaseToCamelCase: [
            {
                testName: "returns correct strings for basic cases",
                testCases: camelKebabPascalCaseStrings
                    .filter((str) => str.skipTestingMethods?.includes("kebabCaseToCamelCase") !== true)
                    .map((str) => ({
                        str: str.kebab,
                        expectedResult: str.camel,
                    })),
            },
        ],
        pascalCaseToKebabCase: [
            {
                testName: "returns correct strings for basic cases",
                testCases: camelKebabPascalCaseStrings
                    .filter((str) => str.skipTestingMethods?.includes("pascalCaseToKebabCase") !== true)
                    .map((str) => ({
                        str: str.pascal,
                        expectedResult: str.kebab,
                    })),
            },
        ],
        kebabCaseToPascalCase: [
            {
                testName: "returns correct strings for basic cases",
                testCases: camelKebabPascalCaseStrings
                    .filter((str) => str.skipTestingMethods?.includes("kebabCaseToPascalCase") !== true)
                    .map((str) => ({
                        str: str.kebab,
                        expectedResult: str.pascal,
                    })),
            },
        ],
    },
};
