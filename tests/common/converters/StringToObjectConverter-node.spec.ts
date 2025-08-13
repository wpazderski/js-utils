import { ObjectToStringConverter } from "../../../src/common/converters/ObjectToStringConverter.ts";
import { StringToObjectConverter } from "../../../src/common/converters/StringToObjectConverter.ts";
import { data } from "./Shared.ts";
import { testConverterInNodeJsEnv } from "./testConverterInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testConverterInNodeJsEnv(StringToObjectConverter, ObjectToStringConverter, data.stringToObject);
