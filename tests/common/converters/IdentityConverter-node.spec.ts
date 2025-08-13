import { IdentityConverter } from "../../../src/common/converters/IdentityConverter.ts";
import { data } from "./Shared.ts";
import { testConverterInNodeJsEnv } from "./testConverterInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testConverterInNodeJsEnv(IdentityConverter, IdentityConverter, data.identity);
