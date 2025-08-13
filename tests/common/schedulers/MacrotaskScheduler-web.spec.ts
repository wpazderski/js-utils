import { testSchedulerInWebEnv } from "./testSchedulerInWebEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInWebEnv("MacrotaskScheduler", {
    timing: "macrotask",
    constructorOptions: undefined,
    singleShotOptions: undefined,
});
