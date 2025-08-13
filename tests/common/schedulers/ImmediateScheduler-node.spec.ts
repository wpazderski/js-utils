import { ImmediateScheduler } from "../../../src/common/schedulers/ImmediateScheduler.ts";
import { testSchedulerInNodeJsEnv } from "./testSchedulerInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInNodeJsEnv(ImmediateScheduler, {
    timing: "immediate",
    constructorOptions: undefined,
    singleShotOptions: undefined,
});
