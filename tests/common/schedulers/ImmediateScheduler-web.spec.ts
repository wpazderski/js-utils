import { testSchedulerInWebEnv } from "./testSchedulerInWebEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInWebEnv("ImmediateScheduler", {
    timing: "immediate",
    constructorOptions: undefined,
    singleShotOptions: undefined,
});
