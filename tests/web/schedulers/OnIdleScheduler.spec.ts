import { testSchedulerInWebEnv } from "../../common/schedulers/testSchedulerInWebEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInWebEnv("OnIdleScheduler", {
    timing: "onIdle",
    constructorOptions: undefined,
    singleShotOptions: undefined,
});
