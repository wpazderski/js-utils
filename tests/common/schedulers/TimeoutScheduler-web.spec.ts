import { expect, test } from "@playwright/test";
import { testSchedulerInWebEnv } from "./testSchedulerInWebEnv.testUtils.ts";

// eslint-disable-next-line playwright/require-hook
testSchedulerInWebEnv(
    "TimeoutScheduler",
    {
        timing: "timeout",
        constructorOptions: { delayMsec: 50 },
        singleShotOptions: { delayMsec: 50 },
    },
    {
        static: {
            singleShot: () => {
                // eslint-disable-next-line playwright/require-top-level-describe
                test("should execute single-shot callback after specified delay", async ({ page }) => {
                    const isOk = await page.evaluate(async () => {
                        const messages: string[] = [];
                        setTimeout(() => {
                            messages.push("before");
                        }, 75);
                        window.jsUtils.common.schedulers.TimeoutScheduler.singleShot(() => messages.push("callback()"), { delayMsec: 75 });
                        setTimeout(() => {
                            messages.push("after");
                        }, 75);
                        await new Promise((resolve) => {
                            setTimeout(resolve, 150);
                        });
                        window.playwrightUtils.expect(messages).toStrictEqual(["before", "callback()", "after"]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            },
        },
        instance: {
            behavior: {
                extraBehaviorBlock: () => {
                    // eslint-disable-next-line playwright/require-top-level-describe
                    test("should execute scheduled callback after specified delay", async ({ page }) => {
                        const isOk = await page.evaluate(async () => {
                            const messages: string[] = [];
                            const scheduler = new window.jsUtils.common.schedulers.TimeoutScheduler(() => messages.push("callback()"), { delayMsec: 75 });
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
                            window.playwrightUtils.expect(messages).toStrictEqual(["before", "callback()", "after"]);
                            return true;
                        });
                        expect(isOk).toBe(true);
                    });

                    test.describe("option: restartTimer", () => {
                        test.describe("onScheduleCallWhenNotScheduled (default)", () => {
                            test("should not restart timer when calling schedule() when the scheduler is already scheduled", async ({ page }) => {
                                const isOk = await page.evaluate(async () => {
                                    const messages1: string[] = [];
                                    const messages2: string[] = [];
                                    const scheduler1 = new window.jsUtils.common.schedulers.TimeoutScheduler(() => messages1.push("callback()"), { delayMsec: 200 });
                                    const scheduler2 = new window.jsUtils.common.schedulers.TimeoutScheduler(() => messages2.push("callback()"), {
                                        delayMsec: 200,
                                        restartTimer: "onScheduleCallWhenNotScheduled",
                                    });
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
                                    window.playwrightUtils.expect(messages1).toStrictEqual(["before", "callback()", "after"]);
                                    window.playwrightUtils.expect(messages2).toStrictEqual(["before", "callback()", "after"]);
                                    return true;
                                });
                                expect(isOk).toBe(true);
                            });
                        });

                        test.describe("onEveryScheduleCall", () => {
                            test("should restart timer every time schedule() is called", async ({ page }) => {
                                const isOk = await page.evaluate(async () => {
                                    const messages: string[] = [];
                                    const scheduler = new window.jsUtils.common.schedulers.TimeoutScheduler(() => messages.push("callback()"), {
                                        delayMsec: 200,
                                        restartTimer: "onEveryScheduleCall",
                                    });
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
                                    window.playwrightUtils.expect(messages).toStrictEqual(["before-1", "after-1", "before-2", "callback()", "after-2"]);
                                    return true;
                                });
                                expect(isOk).toBe(true);
                            });
                        });
                    });
                },
            },
        },
    },
);
