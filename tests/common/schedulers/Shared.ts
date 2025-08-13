import type { Page } from "@playwright/test";
import type { TimeoutSchedulerOptions, TimeoutSchedulerSingleShotOptions } from "../../../src/common/schedulers/TimeoutScheduler.ts";

export interface ExtraTests {
    beforeEach?: ((page: Page) => Promise<void> | void) | undefined;
    static?:
        | {
              singleShot?: (() => void) | undefined;
              extraStaticBlock?: (() => void) | undefined;
          }
        | undefined;
    instance?:
        | {
              behavior: {
                  extraBehaviorBlock?: (() => void) | undefined;
              };
              extraInstanceBlock?: (() => void) | undefined;
          }
        | undefined;
}

export interface CommonSchedulerParams {
    constructorOptions?: unknown;
    singleShotOptions?: unknown;
}

export interface ImmediateSchedulerParams extends CommonSchedulerParams {
    timing: "immediate";
}

export interface MacrotaskSchedulerParams extends CommonSchedulerParams {
    timing: "macrotask";
}

export interface MicrotaskSchedulerParams extends CommonSchedulerParams {
    timing: "microtask";
}

export interface TimeoutSchedulerParams extends CommonSchedulerParams {
    timing: "timeout";
    constructorOptions?: TimeoutSchedulerOptions | undefined;
    singleShotOptions?: TimeoutSchedulerSingleShotOptions | undefined;
}

export interface AnimationFrameSchedulerParams extends CommonSchedulerParams {
    timing: "animationFrame";
}

export interface OnIdleSchedulerParams extends CommonSchedulerParams {
    timing: "onIdle";
}

export type SchedulerParams =
    | ImmediateSchedulerParams
    | MacrotaskSchedulerParams
    | MicrotaskSchedulerParams
    | TimeoutSchedulerParams
    | AnimationFrameSchedulerParams
    | OnIdleSchedulerParams;

export const callbackCallSettlementTimeMsec = 500;
