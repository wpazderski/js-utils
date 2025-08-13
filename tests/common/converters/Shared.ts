import type { Page } from "@playwright/test";

export interface TestCase<TInput, TOutput> {
    input: TInput;
    output: TOutput;
}

export type TestCases<TInput, TOutput> = Array<TestCase<TInput, TOutput>>;

export interface ConvertersTestDataSet<TInput, TOutput> {
    validCases: TestCases<TInput, TOutput>;
    invalidCases: unknown[];
}

type ConvertersTestDataSetKey =
    | "bigIntToString"
    | "stringToBigInt"
    | "booleanToString"
    | "stringToBoolean"
    | "numberToString"
    | "stringToNumber"
    | "objectToString"
    | "stringToObject"
    | "identity"
    | "stringExToStringEx"
    | "stringExToStringExOneOf";

const stringExToStringExOneOfConverterValidValues = ["a", "b", "c", "d", "4389", "e"] as const;
export type StringExToStringExOneOfConverterValidValue = (typeof stringExToStringExOneOfConverterValidValues)[number];

export const data = {
    bigIntToString: {
        validCases: [
            {
                input: 1234567890123456789012345678901234567890n,
                output: "1234567890123456789012345678901234567890",
            },
            {
                input: -1234567890123456789012345678901234567890n,
                output: "-1234567890123456789012345678901234567890",
            },
            {
                input: BigInt(0),
                output: "0",
            },
            {
                input: BigInt(-0),
                output: "0",
            },
        ],
        invalidCases: [
            1234,
            123.456789,
            -123.456789,
            0,
            -0,
            true,
            false,
            "loremIpsumDolorSitAmet",
            null,
            undefined,
            {},
            {
                id: 123,
            },
            [],
            [1, 2, 3],
            () => {},
            Symbol("test"),
            new Date(),
        ] as unknown[],
    },
    stringToBigInt: {
        validCases: [
            {
                input: "1234567890123456789012345678901234567890",
                output: 1234567890123456789012345678901234567890n,
            },
            {
                input: "-1234567890123456789012345678901234567890",
                output: -1234567890123456789012345678901234567890n,
            },
            {
                input: "0",
                output: BigInt(0),
            },
            {
                input: "-0",
                output: BigInt(0),
            },
            {
                input: "",
                output: BigInt(0),
            },
        ],
        invalidCases: [
            1234,
            123.456789,
            -123.456789,
            0,
            -0,
            true,
            false,
            "loremIpsumDolorSitAmet",
            null,
            undefined,
            {},
            {
                id: 123,
            },
            [],
            [1, 2, 3],
            () => {},
            Symbol("test"),
            new Date(),
        ] as unknown[],
    },
    booleanToString: {
        validCases: [
            {
                input: true,
                output: "true",
            },
            {
                input: false,
                output: "false",
            },
        ],
        invalidCases: [
            1234,
            123.456789,
            -123.456789,
            0,
            -0,
            1234567890123456789012345678901234567890n,
            -1234567890123456789012345678901234567890n,
            "",
            "loremIpsumDolorSitAmet",
            null,
            undefined,
            {},
            {
                id: 123,
            },
            [],
            [1, 2, 3],
            () => {},
            Symbol("test"),
            new Date(),
        ] as unknown[],
    },
    stringToBoolean: {
        validCases: [
            {
                input: "true",
                output: true,
            },
            {
                input: "1",
                output: true,
            },
            {
                input: "on",
                output: true,
            },
            {
                input: "enabled",
                output: true,
            },
            {
                input: "yes",
                output: true,
            },
            {
                input: "false",
                output: false,
            },
            {
                input: "0",
                output: false,
            },
            {
                input: "off",
                output: false,
            },
            {
                input: "disabled",
                output: false,
            },
            {
                input: "no",
                output: false,
            },
        ],
        invalidCases: [
            1234,
            123.456789,
            -123.456789,
            0,
            -0,
            1234567890123456789012345678901234567890n,
            -1234567890123456789012345678901234567890n,
            "",
            "loremIpsumDolorSitAmet",
            null,
            undefined,
            {},
            {
                id: 123,
            },
            [],
            [1, 2, 3],
            () => {},
            Symbol("test"),
            new Date(),
        ] as unknown[],
    },
    numberToString: {
        validCases: [
            {
                input: 123,
                output: "123",
            },
            {
                input: -123,
                output: "-123",
            },
            {
                input: 123.456789,
                output: "123.456789",
            },
            {
                input: -123.456789,
                output: "-123.456789",
            },
            {
                input: 0,
                output: "0",
            },
            {
                input: -0,
                output: "0",
            },
            {
                input: Number.POSITIVE_INFINITY,
                output: "Infinity",
            },
            {
                input: Number.NEGATIVE_INFINITY,
                output: "-Infinity",
            },
        ],
        invalidCases: [
            1234567890123456789012345678901234567890n,
            -1234567890123456789012345678901234567890n,
            Number.NaN,
            true,
            false,
            "loremIpsumDolorSitAmet",
            null,
            undefined,
            {},
            {
                id: 123,
            },
            [],
            [1, 2, 3],
            () => {},
            Symbol("test"),
            new Date(),
        ] as unknown[],
    },
    stringToNumber: {
        validCases: [
            {
                input: "123.456789",
                output: 123.456789,
            },
            {
                input: "-123.456789",
                output: -123.456789,
            },
            {
                input: "123",
                output: 123,
            },
            {
                input: "-123",
                output: -123,
            },
            {
                input: "0",
                output: 0,
            },
            {
                input: "-0",
                output: -0,
            },
            {
                input: "Infinity",
                output: Number.POSITIVE_INFINITY,
            },
            {
                input: "-Infinity",
                output: Number.NEGATIVE_INFINITY,
            },
        ],
        invalidCases: [
            1234567890123456789012345678901234567890n,
            -1234567890123456789012345678901234567890n,
            1234,
            123.456789,
            -123.456789,
            0,
            -0,
            Number.NaN,
            "loremIpsumDolorSitAmet",
            null,
            undefined,
            {},
            {
                id: 123,
            },
            [],
            [1, 2, 3],
            () => {},
            Symbol("test"),
            new Date(),
        ] as unknown[],
    },
    objectToString: {
        validCases: [
            {
                input: { key: "value" },
                output: '{"key":"value"}',
            },
            {
                input: { id: 123, name: "Test" },
                output: '{"id":123,"name":"Test"}',
            },
            {
                input: {},
                output: "{}",
            },
            {
                input: { array: [1, 2, 3], nested: { key: "value" } },
                output: '{"array":[1,2,3],"nested":{"key":"value"}}',
            },
            {
                input: [1, 2, 3, { key: "value" }],
                output: '[1,2,3,{"key":"value"}]',
            },
        ] as TestCases<object, string>,
        invalidCases: [
            1234,
            123.456789,
            -123.456789,
            0,
            -0,
            1234567890123456789012345678901234567890n,
            -1234567890123456789012345678901234567890n,
            "",
            "loremIpsumDolorSitAmet",
            undefined,
            true,
            false,
            () => {},
            Symbol("test"),
        ] as unknown[],
    },
    stringToObject: {
        validCases: [
            {
                input: '{"key":"value"}',
                output: { key: "value" },
            },
            {
                input: '{"id":123,"name":"Test"}',
                output: { id: 123, name: "Test" },
            },
            {
                input: "{}",
                output: {},
            },
            {
                input: '{"array":[1,2,3],"nested":{"key":"value"}}',
                output: { array: [1, 2, 3], nested: { key: "value" } },
            },
            {
                input: '[1,2,3,{"key":"value"}]',
                output: [1, 2, 3, { key: "value" }],
            },
        ] as TestCases<string, object>,
        invalidCases: [
            1234,
            123.456789,
            -123.456789,
            0,
            -0,
            1234567890123456789012345678901234567890n,
            -1234567890123456789012345678901234567890n,
            "",
            "loremIpsumDolorSitAmet",
            null,
            undefined,
            {},
            {
                id: 123,
            },
            [],
            [1, 2, 3],
            true,
            false,
            () => {},
            Symbol("test"),
            new Date(),
        ] as unknown[],
    },
    identity: {
        validCases: [
            {
                input: "test",
                output: "test",
            },
            {
                input: 123,
                output: 123,
            },
            {
                input: 123.456,
                output: 123.456,
            },
            {
                input: 0,
                output: 0,
            },
            {
                input: -0,
                output: -0,
            },
            {
                input: 1234567890123456789012345678901234567890n,
                output: 1234567890123456789012345678901234567890n,
            },
            {
                input: -1234567890123456789012345678901234567890n,
                output: -1234567890123456789012345678901234567890n,
            },
            {
                input: {},
                output: {},
            },
            {
                input: { array: [1, 2, 3], nested: { key: "value" } },
                output: { array: [1, 2, 3], nested: { key: "value" } },
            },
            {
                input: [],
                output: [],
            },
            {
                input: [1, 2, 3, { key: "value" }],
                output: [1, 2, 3, { key: "value" }],
            },
            {
                input: true,
                output: true,
            },
            {
                input: false,
                output: false,
            },
            {
                input: null,
                output: null,
            },
            {
                input: undefined,
                output: undefined,
            },
            ...((): Array<TestCase<unknown, unknown>> => {
                const fn = (): void => {};
                const smb = Symbol("test");
                const date = new Date();
                return [
                    {
                        input: fn,
                        output: fn,
                    },
                    {
                        input: smb,
                        output: smb,
                    },
                    {
                        input: date,
                        output: date,
                    },
                ];
            })(),
        ] as TestCases<unknown, unknown>,
        invalidCases: [] as unknown[],
    },
    stringExToStringEx: {
        validCases: [
            {
                input: "lorem ipsum dolor sit amet",
                output: "lorem ipsum dolor sit amet",
            },
            {
                input: "1234567890",
                output: "1234567890",
            },
            {
                input: "",
                output: "",
            },
        ] as TestCases<string, string>,
        invalidCases: [
            1234,
            123.456789,
            -123.456789,
            0,
            -0,
            1234567890123456789012345678901234567890n,
            -1234567890123456789012345678901234567890n,
            Number.NaN,
            true,
            false,
            null,
            undefined,
            {},
            {
                id: 123,
            },
            [],
            [1, 2, 3],
            () => {},
            Symbol("test"),
            new Date(),
        ] as unknown[],
    },

    stringExToStringExOneOf: {
        validValues: stringExToStringExOneOfConverterValidValues,
        validCases: [
            {
                input: "a",
                output: "a",
            },
            {
                input: "b",
                output: "b",
            },
            {
                input: "4389",
                output: "4389",
            },
        ] as TestCases<string, StringExToStringExOneOfConverterValidValue>,
        invalidCases: [
            1234,
            123.456789,
            -123.456789,
            0,
            -0,
            1234567890123456789012345678901234567890n,
            -1234567890123456789012345678901234567890n,
            "lorem ipsum dolor sit amet",
            "1234567890",
            "",
            Number.NaN,
            true,
            false,
            null,
            undefined,
            {},
            {
                id: 123,
            },
            [],
            [1, 2, 3],
            () => {},
            Symbol("test"),
            new Date(),
        ] as unknown[],
    },
} satisfies Record<ConvertersTestDataSetKey, ConvertersTestDataSet<unknown, unknown>> & {
    stringExToStringExOneOf: {
        validValues: typeof stringExToStringExOneOfConverterValidValues;
    };
};

export type ConvertersTestData = typeof data;

export interface ExtraTests {
    beforeEach?: ((page: Page) => Promise<void> | void) | undefined;
    static?:
        | {
              getInstance?: (() => void) | undefined;
              extraStaticBlock?: (() => void) | undefined;
          }
        | undefined;
    instance?:
        | {
              getReverseConverter?: (() => void) | undefined;
              convert?: (() => void) | undefined;
              canConvert?: (() => void) | undefined;
              extraInstanceBlock?: (() => void) | undefined;
          }
        | undefined;
}
