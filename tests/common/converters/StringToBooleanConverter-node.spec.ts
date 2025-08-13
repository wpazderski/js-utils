import { BooleanToStringConverter } from "../../../src/common/converters/BooleanToStringConverter.ts";
import { StringToBooleanConverter } from "../../../src/common/converters/StringToBooleanConverter.ts";
import { data } from "./Shared.ts";
import { testConverterInNodeJsEnv } from "./testConverterInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testConverterInNodeJsEnv(StringToBooleanConverter, BooleanToStringConverter, data.stringToBoolean);
