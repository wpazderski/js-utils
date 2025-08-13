import { BigIntToStringConverter } from "../../../src/common/converters/BigIntToStringConverter.ts";
import { StringToBigIntConverter } from "../../../src/common/converters/StringToBigIntConverter.ts";
import { data } from "./Shared.ts";
import { testConverterInNodeJsEnv } from "./testConverterInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testConverterInNodeJsEnv(BigIntToStringConverter, StringToBigIntConverter, data.bigIntToString);
