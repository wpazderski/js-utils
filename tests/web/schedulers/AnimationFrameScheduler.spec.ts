import { testSchedulerInWebEnv } from "../../common/schedulers/testSchedulerInWebEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInWebEnv("AnimationFrameScheduler", {
    timing: "animationFrame",
    constructorOptions: undefined,
    singleShotOptions: undefined,
});
