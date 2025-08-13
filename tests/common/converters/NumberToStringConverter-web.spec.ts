import { data } from "./Shared.ts";
import { testConverterInWebEnv } from "./testConverterInWebEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testConverterInWebEnv("NumberToStringConverter", "StringToNumberConverter", data.numberToString);
