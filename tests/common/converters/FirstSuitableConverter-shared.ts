import { type ConvertersTestDataSet, type TestCases, data } from "./Shared.ts";

export type FirstSuitableConverterInput = bigint | boolean | number;
export type FirstSuitableConverterOutput = string;

export const firstSuitableConverterData: ConvertersTestDataSet<FirstSuitableConverterInput, FirstSuitableConverterOutput> = {
    validCases: [...data.bigIntToString.validCases, ...data.booleanToString.validCases, ...data.numberToString.validCases] as TestCases<
        FirstSuitableConverterInput,
        FirstSuitableConverterOutput
    >,
    invalidCases: [
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
};
