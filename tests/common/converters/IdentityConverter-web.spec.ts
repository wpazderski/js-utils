import { data } from "./Shared.ts";
import { testConverterInWebEnv } from "./testConverterInWebEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testConverterInWebEnv("IdentityConverter", "IdentityConverter", data.identity);
