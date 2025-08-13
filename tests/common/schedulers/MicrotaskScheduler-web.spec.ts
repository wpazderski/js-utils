import { testSchedulerInWebEnv } from "./testSchedulerInWebEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInWebEnv("MicrotaskScheduler", {
    timing: "microtask",
    constructorOptions: undefined,
    singleShotOptions: undefined,
});
