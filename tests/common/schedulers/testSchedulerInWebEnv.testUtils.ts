import { type Page, expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";
import type { Scheduler as BaseScheduler, SchedulerCallback } from "../../../src/common/schedulers/Scheduler.ts";
import { type ExtraTests, type SchedulerParams, callbackCallSettlementTimeMsec } from "./Shared.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchedulerConstructor = (new (callback: SchedulerCallback, ...args: any[]) => BaseScheduler) & {
    singleShot: typeof BaseScheduler.singleShot;
};

export async function injectWindowExFunctions(page: Page): Promise<void> {
    await page.evaluate(
        // eslint-disable-next-line @typescript-eslint/no-shadow
        ([callbackCallSettlementTimeMsec]) => {
            async function waitForCallbackCallsToSettle(): Promise<void> {
                await new Promise((resolve) => {
                    setTimeout(resolve, callbackCallSettlementTimeMsec);
                });
            }

            // eslint-disable-next-line @typescript-eslint/max-params
            async function addMessageAfterSchedulerSimulation(targetArray: string[], message: string, params: SchedulerParams, context: "singleShot" | "instance"): Promise<void> {
                await new Promise<void>((resolve) => {
                    if (params.timing === "immediate") {
                        targetArray.push(message);
                        resolve();
                    } else if (params.timing === "microtask") {
                        void Promise.resolve().then(() => {
                            targetArray.push(message);
                            resolve();
                        });
                    } else if (params.timing === "macrotask") {
                        setTimeout(() => {
                            targetArray.push(message);
                            resolve();
                        }, 0);
                    } else if (params.timing === "timeout") {
                        const delay = context === "singleShot" ? (params.singleShotOptions?.delayMsec ?? 0) : (params.constructorOptions?.delayMsec ?? 0);
                        setTimeout(() => {
                            targetArray.push(message);
                            resolve();
                        }, delay);
                    } else if (params.timing === "animationFrame") {
                        requestAnimationFrame(() => {
                            targetArray.push(message);
                            resolve();
                        });
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    } else if (params.timing === "onIdle") {
                        if (typeof window.requestIdleCallback === "function" && typeof window.cancelIdleCallback === "function") {
                            window.requestIdleCallback(() => {
                                targetArray.push(message);
                                resolve();
                            });
                        } else {
                            window.requestAnimationFrame(() => {
                                targetArray.push(message);
                                resolve();
                            });
                        }
                    }
                });
            }

            function getSchedulerConstructor(schedulerName: SchedulerName): SchedulerConstructor {
                let SchedulerClass: SchedulerConstructor;
                if (schedulerName === "AnimationFrameScheduler" || schedulerName === "OnIdleScheduler") {
                    SchedulerClass = window.jsUtils.web.schedulers[schedulerName];
                } else {
                    SchedulerClass = window.jsUtils.common.schedulers[schedulerName];
                }
                return SchedulerClass;
            }

            (window as unknown as WindowEx).waitForCallbackCallsToSettle = waitForCallbackCallsToSettle;
            (window as unknown as WindowEx).addMessageAfterSchedulerSimulation = addMessageAfterSchedulerSimulation;
            (window as unknown as WindowEx).getSchedulerConstructor = getSchedulerConstructor;
        },
        [callbackCallSettlementTimeMsec] as [number],
    );
}

type SchedulerName = "ImmediateScheduler" | "MacrotaskScheduler" | "MicrotaskScheduler" | "TimeoutScheduler" | "AnimationFrameScheduler" | "OnIdleScheduler";

export function testSchedulerInWebEnv(schedulerName: SchedulerName, params: SchedulerParams, extraTests?: ExtraTests): void {
    test.describe("Web env", () => {
        test.beforeEach(async ({ page }) => {
            await page.goto("/");
            PageUtils.pipeWebConsoleToStdout(page);
            await setupWebEnvExtensions(page);
            await injectWindowExFunctions(page);

            await extraTests?.beforeEach?.(page);
        });

        // eslint-disable-next-line playwright/valid-title
        test.describe(schedulerName, () => {
            test.describe("static", () => {
                test.describe(".singleShot()", () => {
                    test("should call the callback at the appropriate time", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            async ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const messages: string[] = [];
                                void (window as unknown as WindowEx).addMessageAfterSchedulerSimulation(messages, "before", params, "singleShot");
                                SchedulerClass.singleShot(() => {
                                    messages.push("callback()");
                                }, params.singleShotOptions);
                                await (window as unknown as WindowEx).addMessageAfterSchedulerSimulation(messages, "after", params, "singleShot");
                                window.playwrightUtils.expect(messages).toStrictEqual(["before", "callback()", "after"]);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should call the callback only once", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            async ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                let callCount = 0;
                                SchedulerClass.singleShot(() => {
                                    callCount++;
                                }, params.singleShotOptions);
                                await (window as unknown as WindowEx).waitForCallbackCallsToSettle();
                                window.playwrightUtils.expect(callCount).toBe(1);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    if (params.timing === "immediate") {
                        test("should throw SchedulerCallbackError when an error is thrown in the callback", async ({ page }) => {
                            const isOk = await page.evaluate(
                                // eslint-disable-next-line @typescript-eslint/no-shadow
                                ([schedulerName, params]) => {
                                    const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                    const errorMessage = "Test error 123";
                                    const error = new Error(errorMessage);
                                    window.playwrightUtils
                                        .expect(() => {
                                            SchedulerClass.singleShot(() => {
                                                throw error;
                                            }, params.singleShotOptions);
                                        })
                                        .toThrow(new window.jsUtils.common.schedulers.errors.SchedulerCallbackError(error));
                                    return true;
                                },
                                [schedulerName, params] as [SchedulerName, SchedulerParams],
                            );
                            expect(isOk).toBe(true);
                        });
                    }

                    extraTests?.static?.singleShot?.();
                });

                extraTests?.static?.extraStaticBlock?.();
            });

            test.describe("instance", () => {
                test.describe("behavior", () => {
                    test("should not be scheduled initially", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const instance = new SchedulerClass(() => {}, params.constructorOptions);
                                window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should not be frozen initially", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const instance = new SchedulerClass(() => {}, params.constructorOptions);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(false);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    if (params.timing === "immediate") {
                        test("should not be in scheduled state after schedule() call", async ({ page }) => {
                            const isOk = await page.evaluate(
                                // eslint-disable-next-line @typescript-eslint/no-shadow
                                ([schedulerName, params]) => {
                                    const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                    const instance = new SchedulerClass(() => {}, params.constructorOptions);
                                    instance.schedule();
                                    window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                    return true;
                                },
                                [schedulerName, params] as [SchedulerName, SchedulerParams],
                            );
                            expect(isOk).toBe(true);
                        });
                    } else {
                        test("should be in scheduled state after schedule() call", async ({ page }) => {
                            const isOk = await page.evaluate(
                                // eslint-disable-next-line @typescript-eslint/no-shadow
                                ([schedulerName, params]) => {
                                    const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                    const instance = new SchedulerClass(() => {}, params.constructorOptions);
                                    instance.schedule();
                                    window.playwrightUtils.expect(instance.isScheduled).toBe(true);
                                    return true;
                                },
                                [schedulerName, params] as [SchedulerName, SchedulerParams],
                            );
                            expect(isOk).toBe(true);
                        });
                    }

                    test("should be in frozen state after freeze() call", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const instance = new SchedulerClass(() => {}, params.constructorOptions);
                                instance.freeze();
                                window.playwrightUtils.expect(instance.isFrozen).toBe(true);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should not be in frozen state after freeze() followed by unfreeze() call", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const instance = new SchedulerClass(() => {}, params.constructorOptions);
                                instance.freeze();
                                instance.unfreeze();
                                window.playwrightUtils.expect(instance.isFrozen).toBe(false);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should not call the callback when not scheduled, cancelled or frozen", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            async ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const messages: string[] = [];
                                // @ts-expect-error No need to use the variable; instance of SchedulerClass is assigned for consistency
                                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                                const instance1 = new SchedulerClass(() => {
                                    messages.push("callback() - not scheduled");
                                }, params.constructorOptions);

                                const instance2 = new SchedulerClass(() => {
                                    messages.push("callback() - scheduled, then cancelled");
                                }, params.constructorOptions);
                                instance2.schedule();
                                instance2.cancel();

                                const instance3 = new SchedulerClass(() => {
                                    messages.push("callback() - scheduled, then frozen");
                                }, params.constructorOptions);
                                instance3.schedule();
                                instance3.freeze();

                                const instance4 = new SchedulerClass(() => {
                                    messages.push("callback() - frozen, then scheduled");
                                }, params.constructorOptions);
                                instance4.freeze();
                                instance4.schedule();

                                const instance5 = new SchedulerClass(() => {
                                    messages.push("callback() - scheduled, then frozen, then cancelled");
                                }, params.constructorOptions);
                                instance5.schedule();
                                instance5.freeze();
                                instance5.cancel();

                                const instance6 = new SchedulerClass(() => {
                                    messages.push("callback() - frozen, then scheduled, then cancelled");
                                }, params.constructorOptions);
                                instance6.freeze();
                                instance6.schedule();
                                instance6.cancel();

                                await (window as unknown as WindowEx).waitForCallbackCallsToSettle();
                                let expectedMessages: string[] = [];
                                if (params.timing === "immediate") {
                                    // ImmediateScheduler fires immediately - cancelling/freezing after scheduling does not prevent the callback from being called, because it has already been called.
                                    expectedMessages = [
                                        "callback() - scheduled, then cancelled",
                                        "callback() - scheduled, then frozen",
                                        "callback() - scheduled, then frozen, then cancelled",
                                    ];
                                }
                                window.playwrightUtils.expect(messages).toStrictEqual(expectedMessages);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    if (params.timing !== "immediate") {
                        test("should call the callback once when scheduled multiple times", async ({ page }) => {
                            const isOk = await page.evaluate(
                                // eslint-disable-next-line @typescript-eslint/no-shadow
                                async ([schedulerName, params]) => {
                                    const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                    const messages: string[] = [];
                                    const instance = new SchedulerClass(() => {
                                        messages.push("callback()");
                                    }, params.constructorOptions);
                                    void (window as unknown as WindowEx).addMessageAfterSchedulerSimulation(messages, "before", params, "instance");
                                    instance.schedule();
                                    instance.schedule();
                                    instance.schedule();
                                    void (window as unknown as WindowEx).addMessageAfterSchedulerSimulation(messages, "after", params, "instance");
                                    await (window as unknown as WindowEx).waitForCallbackCallsToSettle();
                                    window.playwrightUtils.expect(messages).toStrictEqual(["before", "callback()", "after"]);
                                    return true;
                                },
                                [schedulerName, params] as [SchedulerName, SchedulerParams],
                            );
                            expect(isOk).toBe(true);
                        });
                    }

                    if (params.timing !== "immediate") {
                        test("should call the callback once after schedule() -> freeze() -> unfreeze()", async ({ page }) => {
                            const isOk = await page.evaluate(
                                // eslint-disable-next-line @typescript-eslint/no-shadow
                                async ([schedulerName, params]) => {
                                    const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                    const messages: string[] = [];
                                    const instance = new SchedulerClass(() => {
                                        messages.push("callback()");
                                    }, params.constructorOptions);
                                    instance.schedule();
                                    instance.freeze();
                                    void (window as unknown as WindowEx).addMessageAfterSchedulerSimulation(messages, "before", params, "instance");
                                    instance.unfreeze();
                                    void (window as unknown as WindowEx).addMessageAfterSchedulerSimulation(messages, "after", params, "instance");
                                    await (window as unknown as WindowEx).waitForCallbackCallsToSettle();
                                    window.playwrightUtils.expect(messages).toStrictEqual(["before", "callback()", "after"]);
                                    return true;
                                },
                                [schedulerName, params] as [SchedulerName, SchedulerParams],
                            );
                            expect(isOk).toBe(true);
                        });
                    }

                    if (params.timing !== "immediate") {
                        test("should not call the callback after schedule() -> freeze() -> cancel() -> unfreeze()", async ({ page }) => {
                            const isOk = await page.evaluate(
                                // eslint-disable-next-line @typescript-eslint/no-shadow
                                async ([schedulerName, params]) => {
                                    const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                    const messages: string[] = [];
                                    const instance = new SchedulerClass(() => {
                                        messages.push("callback()");
                                    }, params.constructorOptions);
                                    instance.schedule();
                                    instance.freeze();
                                    instance.cancel();
                                    instance.unfreeze();
                                    await (window as unknown as WindowEx).waitForCallbackCallsToSettle();
                                    window.playwrightUtils.expect(messages).toStrictEqual([]);
                                    return true;
                                },
                                [schedulerName, params] as [SchedulerName, SchedulerParams],
                            );
                            expect(isOk).toBe(true);
                        });
                    }

                    test("should call the callback once after freeze() -> schedule() -> unfreeze()", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            async ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const messages: string[] = [];
                                const instance = new SchedulerClass(() => {
                                    messages.push("callback()");
                                }, params.constructorOptions);
                                instance.freeze();
                                instance.schedule();
                                void (window as unknown as WindowEx).addMessageAfterSchedulerSimulation(messages, "before", params, "instance");
                                instance.unfreeze();
                                void (window as unknown as WindowEx).addMessageAfterSchedulerSimulation(messages, "after", params, "instance");
                                await (window as unknown as WindowEx).waitForCallbackCallsToSettle();
                                window.playwrightUtils.expect(messages).toStrictEqual(["before", "callback()", "after"]);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should do nothing when cancelling a Scheduler that is not scheduled", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            async ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const messages: string[] = [];
                                const instance = new SchedulerClass(() => {
                                    messages.push("callback()");
                                }, params.constructorOptions);
                                instance.cancel();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(false);
                                instance.cancel();
                                instance.cancel();
                                instance.cancel();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(false);
                                await (window as unknown as WindowEx).waitForCallbackCallsToSettle();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(false);
                                window.playwrightUtils.expect(messages).toStrictEqual([]);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should do nothing when freezing a Scheduler that is frozen", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            async ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const messages: string[] = [];
                                const instance = new SchedulerClass(() => {
                                    messages.push("callback()");
                                }, params.constructorOptions);
                                instance.freeze();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(true);
                                instance.freeze();
                                instance.freeze();
                                instance.freeze();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(true);
                                instance.schedule();
                                instance.freeze();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(true);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(true);
                                instance.freeze();
                                instance.freeze();
                                instance.freeze();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(true);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(true);
                                await (window as unknown as WindowEx).waitForCallbackCallsToSettle();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(true);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(true);
                                window.playwrightUtils.expect(messages).toStrictEqual([]);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    test("should do nothing when unfreezing a Scheduler that is not frozen", async ({ page }) => {
                        const isOk = await page.evaluate(
                            // eslint-disable-next-line @typescript-eslint/no-shadow
                            async ([schedulerName, params]) => {
                                const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                const messages: string[] = [];
                                const instance = new SchedulerClass(() => {
                                    messages.push("callback()");
                                }, params.constructorOptions);
                                instance.unfreeze();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(false);
                                instance.unfreeze();
                                instance.unfreeze();
                                instance.unfreeze();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(false);
                                await (window as unknown as WindowEx).waitForCallbackCallsToSettle();
                                window.playwrightUtils.expect(instance.isScheduled).toBe(false);
                                window.playwrightUtils.expect(instance.isFrozen).toBe(false);
                                window.playwrightUtils.expect(messages).toStrictEqual([]);
                                return true;
                            },
                            [schedulerName, params] as [SchedulerName, SchedulerParams],
                        );
                        expect(isOk).toBe(true);
                    });

                    if (params.timing === "immediate") {
                        test("should throw SchedulerCallbackError when an error is thrown in the callback", async ({ page }) => {
                            const isOk = await page.evaluate(
                                // eslint-disable-next-line @typescript-eslint/no-shadow
                                ([schedulerName, params]) => {
                                    const SchedulerClass = (window as unknown as WindowEx).getSchedulerConstructor(schedulerName);
                                    const errorMessage = "Test error 123";
                                    const error = new Error(errorMessage);
                                    window.playwrightUtils
                                        .expect(() => {
                                            const instance = new SchedulerClass(() => {
                                                throw error;
                                            }, params.constructorOptions);
                                            instance.schedule();
                                        })
                                        .toThrow(new window.jsUtils.common.schedulers.errors.SchedulerCallbackError(error));
                                    return true;
                                },
                                [schedulerName, params] as [SchedulerName, SchedulerParams],
                            );
                            expect(isOk).toBe(true);
                        });
                    }

                    extraTests?.instance?.behavior.extraBehaviorBlock?.();
                });

                extraTests?.instance?.extraInstanceBlock?.();
            });
        });
    });
}

export interface WindowEx extends Window {
    waitForCallbackCallsToSettle: () => Promise<void>;
    // eslint-disable-next-line @typescript-eslint/max-params
    addMessageAfterSchedulerSimulation: (targetArray: string[], message: string, params: SchedulerParams, context: "singleShot" | "instance") => Promise<void>;
    getSchedulerConstructor: (schedulerName: SchedulerName) => SchedulerConstructor;
}
