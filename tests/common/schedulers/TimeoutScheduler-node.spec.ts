import { expect, test } from "@playwright/test";
import { TimeoutScheduler } from "../../../src/common/schedulers/TimeoutScheduler.ts";
import { testSchedulerInNodeJsEnv } from "./testSchedulerInNodeJsEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInNodeJsEnv(
    TimeoutScheduler,
    {
        timing: "timeout",
        constructorOptions: { delayMsec: 50 },
        singleShotOptions: { delayMsec: 50 },
    },
    {
        static: {
            singleShot: () => {
                // eslint-disable-next-line playwright/require-top-level-describe
                test("should execute single-shot callback after specified delay", async () => {
                    const messages: string[] = [];
                    setTimeout(() => {
                        messages.push("before");
                    }, 75);
                    TimeoutScheduler.singleShot(() => messages.push("callback()"), { delayMsec: 75 });
                    setTimeout(() => {
                        messages.push("after");
                    }, 75);
                    await new Promise((resolve) => {
                        setTimeout(resolve, 150);
                    });
                    expect(messages).toStrictEqual(["before", "callback()", "after"]);
                });
            },
        },
        instance: {
            behavior: {
                extraBehaviorBlock: () => {
                    // eslint-disable-next-line playwright/require-top-level-describe
                    test("should execute scheduled callback after specified delay", async () => {
                        const messages: string[] = [];
                        const scheduler = new TimeoutScheduler(() => messages.push("callback()"), { delayMsec: 75 });
                        setTimeout(() => {
                            messages.push("before");
                        }, 75);
                        scheduler.schedule();
                        setTimeout(() => {
                            messages.push("after");
                        }, 75);
                        await new Promise((resolve) => {
                            setTimeout(resolve, 150);
                        });
                        expect(messages).toStrictEqual(["before", "callback()", "after"]);
                    });

                    test.describe("option: restartTimer", () => {
                        test.describe("onScheduleCallWhenNotScheduled (default)", () => {
                            test("should not restart timer when calling schedule() when the scheduler is already scheduled", async () => {
                                const messages1: string[] = [];
                                const messages2: string[] = [];
                                const scheduler1 = new TimeoutScheduler(() => messages1.push("callback()"), { delayMsec: 200 });
                                const scheduler2 = new TimeoutScheduler(() => messages2.push("callback()"), { delayMsec: 200, restartTimer: "onScheduleCallWhenNotScheduled" });
                                setTimeout(() => {
                                    messages1.push("before");
                                    messages2.push("before");
                                }, 200);
                                scheduler1.schedule();
                                scheduler2.schedule();
                                setTimeout(() => {
                                    messages1.push("after");
                                    messages2.push("after");
                                }, 200);
                                await new Promise((resolve) => {
                                    setTimeout(resolve, 100);
                                });
                                scheduler1.schedule();
                                scheduler2.schedule();
                                await new Promise((resolve) => {
                                    setTimeout(resolve, 500);
                                });
                                expect(messages1).toStrictEqual(["before", "callback()", "after"]);
                                expect(messages2).toStrictEqual(["before", "callback()", "after"]);
                            });
                        });

                        test.describe("onEveryScheduleCall", () => {
                            test("should restart timer every time schedule() is called", async () => {
                                const messages: string[] = [];
                                const scheduler = new TimeoutScheduler(() => messages.push("callback()"), { delayMsec: 200, restartTimer: "onEveryScheduleCall" });
                                setTimeout(() => {
                                    messages.push("before-1");
                                }, 200);
                                scheduler.schedule();
                                setTimeout(() => {
                                    messages.push("after-1");
                                }, 200);
                                await new Promise((resolve) => {
                                    setTimeout(resolve, 100);
                                });
                                setTimeout(() => {
                                    messages.push("before-2");
                                }, 200);
                                scheduler.schedule();
                                setTimeout(() => {
                                    messages.push("after-2");
                                }, 200);
                                await new Promise((resolve) => {
                                    setTimeout(resolve, 500);
                                });
                                expect(messages).toStrictEqual(["before-1", "after-1", "before-2", "callback()", "after-2"]);
                            });
                        });
                    });
                },
            },
        },
    },
);
