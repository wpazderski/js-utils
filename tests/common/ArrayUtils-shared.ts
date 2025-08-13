import type { ArrayUtils } from "../../src/common/ArrayUtils.ts";

export type ComparatorName = "objectId";
export type ComparatorFunction = (a: unknown, b: unknown) => boolean;
export type CommonSingleArrayFunctionName = keyof Pick<typeof ArrayUtils, "getUniqueItems">;
export type CommonDoubleArrayFunctionName = keyof Pick<typeof ArrayUtils, "getExtraItems" | "getMissingItems" | "getCommonItems" | "areEqual" | "areEqualInAnyOrder">;

export interface CommonSingleArrayFunctionTestCase {
    arr: unknown[];
    expectedResult: unknown;
    comparator?: ComparatorName | undefined;
}

export interface CommonDoubleArrayFunctionTestCase {
    arr1: unknown[];
    arr2: unknown[];
    expectedResult: unknown;
    comparator?: ComparatorName | undefined;
}

export interface CommonSingleArrayFunctionData {
    testName: string;
    testCases: CommonSingleArrayFunctionTestCase[];
}

export interface CommonDoubleArrayFunctionData {
    testName: string;
    testCases: CommonDoubleArrayFunctionTestCase[];
}

export interface ArrayUtilsTestData {
    static: Record<CommonDoubleArrayFunctionName, CommonDoubleArrayFunctionData[]> & Record<CommonSingleArrayFunctionName, CommonSingleArrayFunctionData[]>;
}

export const data: ArrayUtilsTestData = {
    static: {
        getExtraItems: [
            {
                testName: "returns correct items for basic cases",
                testCases: [
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["b", "c", "d"],
                        expectedResult: ["a"],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c"],
                        expectedResult: [],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: [],
                        expectedResult: ["a", "b", "c"],
                    },
                    {
                        arr1: [],
                        arr2: ["b", "c", "d"],
                        expectedResult: [],
                    },
                    {
                        arr1: [],
                        arr2: [],
                        expectedResult: [],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c"],
                        expectedResult: [],
                    },
                    {
                        arr1: ["c", "b", "a"],
                        arr2: ["a", "b", "c"],
                        expectedResult: [],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["c", "b", "a"],
                        expectedResult: [],
                    },
                    {
                        arr1: ["1", "2", "3"],
                        arr2: [1, 2, 3],
                        expectedResult: ["1", "2", "3"],
                    },
                ],
            },
            {
                testName: "treats duplicates as a single item",
                testCases: [
                    {
                        arr1: ["a", "b", "c", "a", "b"],
                        arr2: ["b", "c", "d"],
                        expectedResult: ["a"],
                    },
                    {
                        arr1: ["a", "b", "c", "a", "b"],
                        arr2: [],
                        expectedResult: ["a", "b", "c"],
                    },
                    {
                        arr1: [],
                        arr2: ["b", "c", "d", "b", "c"],
                        expectedResult: [],
                    },
                ],
            },
            {
                testName: "uses comparator function correctly if provided",
                testCases: [
                    {
                        arr1: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        arr2: [{ id: "b" }, { id: "c" }, { id: "d" }],
                        expectedResult: [{ id: "a" }, { id: "b" }, { id: "c" }],
                    },
                    {
                        arr1: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        arr2: [{ id: "b" }, { id: "c" }, { id: "d" }],
                        expectedResult: [{ id: "a" }],
                        comparator: "objectId",
                    },
                ],
            },
        ],
        getMissingItems: [
            {
                testName: "returns correct items for basic cases",
                testCases: [
                    {
                        arr1: ["b", "c", "d"],
                        arr2: ["a", "b", "c"],
                        expectedResult: ["a"],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c"],
                        expectedResult: [],
                    },
                    {
                        arr1: [],
                        arr2: ["a", "b", "c"],
                        expectedResult: ["a", "b", "c"],
                    },
                    {
                        arr1: ["b", "c", "d"],
                        arr2: [],
                        expectedResult: [],
                    },
                    {
                        arr1: [],
                        arr2: [],
                        expectedResult: [],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c"],
                        expectedResult: [],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["c", "b", "a"],
                        expectedResult: [],
                    },
                    {
                        arr1: ["c", "b", "a"],
                        arr2: ["a", "b", "c"],
                        expectedResult: [],
                    },
                    {
                        arr1: [1, 2, 3],
                        arr2: ["1", "2", "3"],
                        expectedResult: ["1", "2", "3"],
                    },
                ],
            },
            {
                testName: "treats duplicates as a single item",
                testCases: [
                    {
                        arr1: ["b", "c", "d"],
                        arr2: ["a", "b", "c", "a", "b"],
                        expectedResult: ["a"],
                    },
                    {
                        arr1: [],
                        arr2: ["a", "b", "c", "a", "b"],
                        expectedResult: ["a", "b", "c"],
                    },
                    {
                        arr1: ["b", "c", "d", "b", "c"],
                        arr2: [],
                        expectedResult: [],
                    },
                ],
            },
            {
                testName: "uses comparator function correctly if provided",
                testCases: [
                    {
                        arr1: [{ id: "b" }, { id: "c" }, { id: "d" }],
                        arr2: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: [{ id: "a" }, { id: "b" }, { id: "c" }],
                    },
                    {
                        arr1: [{ id: "b" }, { id: "c" }, { id: "d" }],
                        arr2: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: [{ id: "a" }],
                        comparator: "objectId",
                    },
                ],
            },
        ],
        getCommonItems: [
            {
                testName: "returns correct items for basic cases",
                testCases: [
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["b", "c", "d"],
                        expectedResult: ["b", "c"],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c"],
                        expectedResult: ["a", "b", "c"],
                    },
                    {
                        arr1: [],
                        arr2: ["a", "b", "c"],
                        expectedResult: [],
                    },
                    {
                        arr1: ["b", "c", "d"],
                        arr2: [],
                        expectedResult: [],
                    },
                    {
                        arr1: [],
                        arr2: [],
                        expectedResult: [],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c"],
                        expectedResult: ["a", "b", "c"],
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["c", "b", "a"],
                        expectedResult: ["a", "b", "c"],
                    },
                    {
                        arr1: ["c", "b", "a"],
                        arr2: ["a", "b", "c"],
                        expectedResult: ["c", "b", "a"],
                    },
                    {
                        arr1: ["1", "2", "3"],
                        arr2: [1, 2, 3],
                        expectedResult: [],
                    },
                ],
            },
            {
                testName: "treats duplicates as a single item",
                testCases: [
                    {
                        arr1: ["b", "c", "d"],
                        arr2: ["a", "b", "c", "a", "b"],
                        expectedResult: ["b", "c"],
                    },
                    {
                        arr1: [],
                        arr2: ["a", "b", "c", "a", "b"],
                        expectedResult: [],
                    },
                    {
                        arr1: ["b", "c", "d", "b", "c"],
                        arr2: [],
                        expectedResult: [],
                    },
                ],
            },
            {
                testName: "uses comparator function correctly if provided",
                testCases: [
                    {
                        arr1: [{ id: "b" }, { id: "c" }, { id: "d" }],
                        arr2: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: [],
                    },
                    {
                        arr1: [{ id: "b" }, { id: "c" }, { id: "d" }],
                        arr2: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: [{ id: "b" }, { id: "c" }],
                        comparator: "objectId",
                    },
                ],
            },
        ],
        getUniqueItems: [
            {
                testName: "returns correct items for basic cases",
                testCases: [
                    {
                        arr: ["a", "b", "c"],
                        expectedResult: ["a", "b", "c"],
                    },
                    {
                        arr: ["a", "b", "c", "a", "b"],
                        expectedResult: ["a", "b", "c"],
                    },
                    {
                        arr: [],
                        expectedResult: [],
                    },
                    {
                        arr: ["1", "2", "3", 1, 2, 3],
                        expectedResult: ["1", "2", "3", 1, 2, 3],
                    },
                ],
            },
            {
                testName: "uses comparator function correctly if provided",
                testCases: [
                    {
                        arr: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "a" }, { id: "b" }],
                        expectedResult: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "a" }, { id: "b" }],
                    },
                    {
                        arr: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "a" }, { id: "b" }],
                        expectedResult: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        comparator: "objectId",
                    },
                ],
            },
        ],
        areEqual: [
            {
                testName: "returns correct values for given arrays - basic cases",
                testCases: [
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c"],
                        expectedResult: true,
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "d"],
                        expectedResult: false,
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["c", "b", "a"],
                        expectedResult: false,
                    },
                    {
                        arr1: [],
                        arr2: [],
                        expectedResult: true,
                    },
                    {
                        arr1: ["1", "2", "3"],
                        arr2: [1, 2, 3],
                        expectedResult: false,
                    },
                    {
                        arr1: ["a", "b", "c", "a", "b"],
                        arr2: ["a", "b", "c"],
                        expectedResult: false,
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c", "d"],
                        expectedResult: false,
                    },
                ],
            },
            {
                testName: "uses comparator function correctly if provided",
                testCases: [
                    {
                        arr1: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        arr2: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: false,
                    },
                    {
                        arr1: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        arr2: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: true,
                        comparator: "objectId",
                    },
                ],
            },
        ],
        areEqualInAnyOrder: [
            {
                testName: "returns correct values for given arrays - basic cases",
                testCases: [
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c"],
                        expectedResult: true,
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "d"],
                        expectedResult: false,
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["c", "b", "a"],
                        expectedResult: true,
                    },
                    {
                        arr1: [],
                        arr2: [],
                        expectedResult: true,
                    },
                    {
                        arr1: ["1", "2", "3"],
                        arr2: [1, 2, 3],
                        expectedResult: false,
                    },
                    {
                        arr1: ["a", "b", "c", "a", "b"],
                        arr2: ["a", "b", "c"],
                        expectedResult: false,
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c", "d"],
                        expectedResult: false,
                    },
                ],
            },
            {
                testName: "treats duplicates as separate items",
                testCases: [
                    {
                        arr1: ["a", "b", "c", "a", "b"],
                        arr2: ["a", "b", "c"],
                        expectedResult: false,
                    },
                    {
                        arr1: ["a", "b", "c"],
                        arr2: ["a", "b", "c", "d"],
                        expectedResult: false,
                    },
                    {
                        arr1: ["a", "b", "a", "b", "c"],
                        arr2: ["a", "b", "c", "a", "b"],
                        expectedResult: true,
                    },
                ],
            },
            {
                testName: "uses comparator function correctly if provided",
                testCases: [
                    {
                        arr1: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        arr2: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: false,
                    },
                    {
                        arr1: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        arr2: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: true,
                        comparator: "objectId",
                    },
                    {
                        arr1: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "a" }],
                        arr2: [{ id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: false,
                        comparator: "objectId",
                    },
                    {
                        arr1: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "a" }],
                        arr2: [{ id: "a" }, { id: "a" }, { id: "b" }, { id: "c" }],
                        expectedResult: true,
                        comparator: "objectId",
                    },
                ],
            },
        ],
    },
};
