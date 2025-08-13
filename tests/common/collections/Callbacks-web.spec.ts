import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("Callbacks", () => {
        test.describe("instance", () => {
            test("should have name specified in the constructor", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const callbacks1 = new window.jsUtils.common.collections.Callbacks("TestCallbacks1");
                    window.playwrightUtils.expect(callbacks1.name).toBe("TestCallbacks1");
                    const callbacks2 = new window.jsUtils.common.collections.Callbacks();
                    window.playwrightUtils.expect(callbacks2.name).toBeUndefined();
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should call registered callbacks when call() is invoked", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const callbacks = new window.jsUtils.common.collections.Callbacks();
                    const results: string[] = [];
                    callbacks.add(() => {
                        results.push(`Callback 1`);
                    });
                    callbacks.add(() => {
                        results.push(`Callback 2`);
                    });
                    callbacks.call("TestValue");
                    window.playwrightUtils.expect(results).toStrictEqual(["Callback 1", "Callback 2"]);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should call registered callbacks with args passed to call()", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const callbacks = new window.jsUtils.common.collections.Callbacks();
                    const results: Array<{ callbackId: number; value: string; otherValue: number; anObject: { id: number; name: string } }> = [];
                    const testObject = { id: 1, name: "TestObject" };
                    callbacks.add((value: string, otherValue: number, anObject: typeof testObject) => {
                        results.push({ callbackId: 1, value, otherValue, anObject });
                    });
                    callbacks.add((value: string, otherValue: number, anObject: typeof testObject) => {
                        results.push({ callbackId: 2, value, otherValue, anObject });
                    });
                    callbacks.call("TestValue", 142, testObject);
                    window.playwrightUtils.expect(results).toStrictEqual([
                        { callbackId: 1, value: "TestValue", otherValue: 142, anObject: { id: 1, name: "TestObject" } },
                        { callbackId: 2, value: "TestValue", otherValue: 142, anObject: { id: 1, name: "TestObject" } },
                    ]);
                    window.playwrightUtils.expect(results[0]?.anObject).toBe(testObject);
                    window.playwrightUtils.expect(results[1]?.anObject).toBe(testObject);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should call callbacks in the order they were added", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const callbacks = new window.jsUtils.common.collections.Callbacks();
                    const results: string[] = [];
                    callbacks.add((value: string) => {
                        results.push(`Callback 1: ${value}`);
                    });
                    callbacks.add((value: string) => {
                        results.push(`Callback 2: ${value}`);
                    });
                    callbacks.add((value: string) => {
                        results.push(`Callback 3: ${value}`);
                    });
                    callbacks.call("TestValue");
                    window.playwrightUtils.expect(results).toStrictEqual(["Callback 1: TestValue", "Callback 2: TestValue", "Callback 3: TestValue"]);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should not call callbacks that were removed before call()", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const callbacks = new window.jsUtils.common.collections.Callbacks();
                    const results: string[] = [];
                    const callback1 = (): void => {
                        results.push(`Callback 1`);
                    };
                    const callback2 = (): void => {
                        results.push(`Callback 2`);
                    };
                    const callback3 = (): void => {
                        results.push(`Callback 3`);
                    };
                    callbacks.add(callback1);
                    callbacks.add(callback2);
                    callbacks.add(callback3);
                    callbacks.remove(callback2);
                    callbacks.call();
                    window.playwrightUtils.expect(results).toStrictEqual(["Callback 1", "Callback 3"]);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should not add the same callback multiple times", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const callbacks = new window.jsUtils.common.collections.Callbacks();
                    const results: string[] = [];
                    const callback = (): void => {
                        results.push(`Callback`);
                    };
                    callbacks.add(callback);
                    callbacks.add(callback);
                    callbacks.call();
                    window.playwrightUtils.expect(results).toStrictEqual(["Callback"]);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should do nothing when removing a callback that was not added", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const callbacks = new window.jsUtils.common.collections.Callbacks();
                    const results: string[] = [];
                    const callback1 = (): void => {
                        results.push(`Callback 1`);
                    };
                    const callback2 = (): void => {
                        results.push(`Callback 2`);
                    };
                    callbacks.add(callback1);
                    callbacks.remove(callback2);
                    callbacks.call();
                    window.playwrightUtils.expect(results).toStrictEqual(["Callback 1"]);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should do nothing when removing a callback that has already been removed", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const callbacks = new window.jsUtils.common.collections.Callbacks();
                    const results: string[] = [];
                    const callback1 = (): void => {
                        results.push(`Callback1`);
                    };
                    const callback2 = (): void => {
                        results.push(`Callback2`);
                    };
                    callbacks.add(callback1);
                    callbacks.add(callback2);
                    callbacks.remove(callback1);
                    callbacks.remove(callback1);
                    callbacks.call();
                    window.playwrightUtils.expect(results).toStrictEqual(["Callback2"]);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should not throw an error when calling call() with no callbacks registered", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const callbacks = new window.jsUtils.common.collections.Callbacks();
                    window.playwrightUtils
                        .expect(() => {
                            callbacks.call();
                        })
                        .not.toThrow();
                    return true;
                });
                expect(isOk).toBe(true);
            });
        });
    });
});
