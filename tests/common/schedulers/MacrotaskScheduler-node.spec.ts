import { MacrotaskScheduler } from "../../../src/common/schedulers/MacrotaskScheduler.ts";
import { testSchedulerInNodeJsEnv } from "./testSchedulerInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInNodeJsEnv(MacrotaskScheduler, {
    timing: "macrotask",
    constructorOptions: undefined,
    singleShotOptions: undefined,
});
