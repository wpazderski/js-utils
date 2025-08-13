import { expect, test } from "@playwright/test";
import { SchedulerCallbackError } from "../../../src/common/schedulers/errors/SchedulerCallbackError.ts";
import type { Scheduler as BaseScheduler, SchedulerCallback } from "../../../src/common/schedulers/Scheduler.ts";
import { type ExtraTests, type SchedulerParams, callbackCallSettlementTimeMsec } from "./Shared.ts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SchedulerConstructor = (new (callback: SchedulerCallback, ...args: any[]) => BaseScheduler) & {
    singleShot: typeof BaseScheduler.singleShot;
};

export function testSchedulerInNodeJsEnv(SchedulerClass: SchedulerConstructor, params: SchedulerParams, extraTests?: ExtraTests): void {
    const schedulerName = SchedulerClass.name;
    test.describe("Node.js env", () => {
        test.beforeEach(async ({ page }) => {
            await extraTests?.beforeEach?.(page);
        });

        // eslint-disable-next-line playwright/valid-title
        test.describe(schedulerName, () => {
            test.describe("static", () => {
                test.describe(".singleShot()", () => {
                    test("should call the callback at the appropriate time", async () => {
                        const messages: string[] = [];
                        void addMessageAfterSchedulerSimulation(messages, "before", params, "singleShot");
                        SchedulerClass.singleShot(() => {
                            messages.push("callback()");
                        }, params.singleShotOptions);
                        await addMessageAfterSchedulerSimulation(messages, "after", params, "singleShot");
                        expect(messages).toStrictEqual(["before", "callback()", "after"]);
                    });

                    test("should call the callback only once", async () => {
                        let callCount = 0;
                        SchedulerClass.singleShot(() => {
                            callCount++;
                        }, params.singleShotOptions);
                        await waitForCallbackCallsToSettle();
                        expect(callCount).toBe(1);
                    });

                    if (params.timing === "immediate") {
                        test("should throw SchedulerCallbackError when an error is thrown in the callback", () => {
                            const errorMessage = "Test error 123";
                            const error = new Error(errorMessage);
                            expect(() => {
                                SchedulerClass.singleShot(() => {
                                    throw error;
                                }, params.singleShotOptions);
                            }).toThrow(new SchedulerCallbackError(error));
                        });
                    }

                    extraTests?.static?.singleShot?.();
                });

                extraTests?.static?.extraStaticBlock?.();
            });

            test.describe("instance", () => {
                test.describe("behavior", () => {
                    test("should not be scheduled initially", () => {
                        const instance = new SchedulerClass(() => {}, params.constructorOptions);
                        expect(instance.isScheduled).toBe(false);
                    });

                    test("should not be frozen initially", () => {
                        const instance = new SchedulerClass(() => {}, params.constructorOptions);
                        expect(instance.isFrozen).toBe(false);
                    });

                    if (params.timing === "immediate") {
                        test("should not be in scheduled state after schedule() call", () => {
                            const instance = new SchedulerClass(() => {}, params.constructorOptions);
                            instance.schedule();
                            expect(instance.isScheduled).toBe(false);
                        });
                    } else {
                        test("should be in scheduled state after schedule() call", () => {
                            const instance = new SchedulerClass(() => {}, params.constructorOptions);
                            instance.schedule();
                            expect(instance.isScheduled).toBe(true);
                        });
                    }

                    test("should be in frozen state after freeze() call", () => {
                        const instance = new SchedulerClass(() => {}, params.constructorOptions);
                        instance.freeze();
                        expect(instance.isFrozen).toBe(true);
                    });

                    test("should not be in frozen state after freeze() followed by unfreeze() call", () => {
                        const instance = new SchedulerClass(() => {}, params.constructorOptions);
                        instance.freeze();
                        instance.unfreeze();
                        expect(instance.isFrozen).toBe(false);
                    });

                    test("should not call the callback when not scheduled, cancelled or frozen", async () => {
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

                        await waitForCallbackCallsToSettle();
                        let expectedMessages: string[] = [];
                        // eslint-disable-next-line playwright/no-conditional-in-test
                        if (params.timing === "immediate") {
                            // ImmediateScheduler fires immediately - cancelling/freezing after scheduling does not prevent the callback from being called, because it has already been called.
                            expectedMessages = [
                                "callback() - scheduled, then cancelled",
                                "callback() - scheduled, then frozen",
                                "callback() - scheduled, then frozen, then cancelled",
                            ];
                        }
                        expect(messages).toStrictEqual(expectedMessages);
                    });

                    if (params.timing !== "immediate") {
                        test("should call the callback once when scheduled multiple times", async () => {
                            const messages: string[] = [];
                            const instance = new SchedulerClass(() => {
                                messages.push("callback()");
                            }, params.constructorOptions);
                            void addMessageAfterSchedulerSimulation(messages, "before", params, "instance");
                            instance.schedule();
                            instance.schedule();
                            instance.schedule();
                            void addMessageAfterSchedulerSimulation(messages, "after", params, "instance");
                            await waitForCallbackCallsToSettle();
                            expect(messages).toStrictEqual(["before", "callback()", "after"]);
                        });
                    }

                    if (params.timing !== "immediate") {
                        test("should call the callback once after schedule() -> freeze() -> unfreeze()", async () => {
                            const messages: string[] = [];
                            const instance = new SchedulerClass(() => {
                                messages.push("callback()");
                            }, params.constructorOptions);
                            instance.schedule();
                            instance.freeze();
                            void addMessageAfterSchedulerSimulation(messages, "before", params, "instance");
                            instance.unfreeze();
                            void addMessageAfterSchedulerSimulation(messages, "after", params, "instance");
                            await waitForCallbackCallsToSettle();
                            expect(messages).toStrictEqual(["before", "callback()", "after"]);
                        });
                    }

                    if (params.timing !== "immediate") {
                        test("should not call the callback after schedule() -> freeze() -> cancel() -> unfreeze()", async () => {
                            const messages: string[] = [];
                            const instance = new SchedulerClass(() => {
                                messages.push("callback()");
                            }, params.constructorOptions);
                            instance.schedule();
                            instance.freeze();
                            instance.cancel();
                            instance.unfreeze();
                            await waitForCallbackCallsToSettle();
                            expect(messages).toStrictEqual([]);
                        });
                    }

                    test("should call the callback once after freeze() -> schedule() -> unfreeze()", async () => {
                        const messages: string[] = [];
                        const instance = new SchedulerClass(() => {
                            messages.push("callback()");
                        }, params.constructorOptions);
                        instance.freeze();
                        instance.schedule();
                        void addMessageAfterSchedulerSimulation(messages, "before", params, "instance");
                        instance.unfreeze();
                        void addMessageAfterSchedulerSimulation(messages, "after", params, "instance");
                        await waitForCallbackCallsToSettle();
                        expect(messages).toStrictEqual(["before", "callback()", "after"]);
                    });

                    test("should do nothing when cancelling a Scheduler that is not scheduled", async () => {
                        const messages: string[] = [];
                        const instance = new SchedulerClass(() => {
                            messages.push("callback()");
                        }, params.constructorOptions);
                        instance.cancel();
                        expect(instance.isScheduled).toBe(false);
                        expect(instance.isFrozen).toBe(false);
                        instance.cancel();
                        instance.cancel();
                        instance.cancel();
                        expect(instance.isScheduled).toBe(false);
                        expect(instance.isFrozen).toBe(false);
                        await waitForCallbackCallsToSettle();
                        expect(instance.isScheduled).toBe(false);
                        expect(instance.isFrozen).toBe(false);
                        expect(messages).toStrictEqual([]);
                    });

                    test("should do nothing when freezing a Scheduler that is frozen", async () => {
                        const messages: string[] = [];
                        const instance = new SchedulerClass(() => {
                            messages.push("callback()");
                        }, params.constructorOptions);
                        instance.freeze();
                        expect(instance.isScheduled).toBe(false);
                        expect(instance.isFrozen).toBe(true);
                        instance.freeze();
                        instance.freeze();
                        instance.freeze();
                        expect(instance.isScheduled).toBe(false);
                        expect(instance.isFrozen).toBe(true);
                        instance.schedule();
                        instance.freeze();
                        expect(instance.isScheduled).toBe(true);
                        expect(instance.isFrozen).toBe(true);
                        instance.freeze();
                        instance.freeze();
                        instance.freeze();
                        expect(instance.isScheduled).toBe(true);
                        expect(instance.isFrozen).toBe(true);
                        await waitForCallbackCallsToSettle();
                        expect(instance.isScheduled).toBe(true);
                        expect(instance.isFrozen).toBe(true);
                        expect(messages).toStrictEqual([]);
                    });

                    test("should do nothing when unfreezing a Scheduler that is not frozen", async () => {
                        const messages: string[] = [];
                        const instance = new SchedulerClass(() => {
                            messages.push("callback()");
                        }, params.constructorOptions);
                        instance.unfreeze();
                        expect(instance.isScheduled).toBe(false);
                        expect(instance.isFrozen).toBe(false);
                        instance.unfreeze();
                        instance.unfreeze();
                        instance.unfreeze();
                        expect(instance.isScheduled).toBe(false);
                        expect(instance.isFrozen).toBe(false);
                        await waitForCallbackCallsToSettle();
                        expect(instance.isScheduled).toBe(false);
                        expect(instance.isFrozen).toBe(false);
                        expect(messages).toStrictEqual([]);
                    });

                    if (params.timing === "immediate") {
                        test("should throw SchedulerCallbackError when an error is thrown in the callback", () => {
                            const errorMessage = "Test error 123";
                            const error = new Error(errorMessage);
                            expect(() => {
                                const instance = new SchedulerClass(() => {
                                    throw error;
                                }, params.constructorOptions);
                                instance.schedule();
                            }).toThrow(new SchedulerCallbackError(error));
                        });
                    }

                    extraTests?.instance?.behavior.extraBehaviorBlock?.();
                });

                extraTests?.instance?.extraInstanceBlock?.();
            });
        });
    });
}

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
