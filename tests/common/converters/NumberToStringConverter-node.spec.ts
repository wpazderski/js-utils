import { NumberToStringConverter } from "../../../src/common/converters/NumberToStringConverter.ts";
import { StringToNumberConverter } from "../../../src/common/converters/StringToNumberConverter.ts";
import { data } from "./Shared.ts";
import { testConverterInNodeJsEnv } from "./testConverterInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testConverterInNodeJsEnv(NumberToStringConverter, StringToNumberConverter, data.numberToString);
