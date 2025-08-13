import { MicrotaskScheduler } from "../../../src/common/schedulers/MicrotaskScheduler.ts";
import { testSchedulerInNodeJsEnv } from "./testSchedulerInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInNodeJsEnv(MicrotaskScheduler, {
    timing: "microtask",
    constructorOptions: undefined,
    singleShotOptions: undefined,
});
