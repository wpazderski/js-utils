import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("Deferred", () => {
        test.describe("instance", () => {
            test("should have correct initial state", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const deferred = new window.jsUtils.common.Deferred();
                    window.playwrightUtils.expect(deferred.promise).toBeInstanceOf(Promise);
                    window.playwrightUtils.expect(deferred.state).toBe("pending");
                    window.playwrightUtils.expect(deferred.isPending).toBe(true);
                    window.playwrightUtils.expect(deferred.isFinalized).toBe(false);
                    window.playwrightUtils.expect(deferred.isResolved).toBe(false);
                    window.playwrightUtils.expect(deferred.isRejected).toBe(false);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should resolve to the value passed to resolve()", async ({ page }) => {
                const isOk = await page.evaluate(async () => {
                    const deferred = new window.jsUtils.common.Deferred<number>();
                    deferred.resolve(142);
                    await window.playwrightUtils.expect(deferred.promise).resolves.toBe(142);
                    await Promise.allSettled([deferred.promise]);
                    window.playwrightUtils.expect(deferred.state).toBe("resolved");
                    window.playwrightUtils.expect(deferred.isPending).toBe(false);
                    window.playwrightUtils.expect(deferred.isFinalized).toBe(true);
                    window.playwrightUtils.expect(deferred.isResolved).toBe(true);
                    window.playwrightUtils.expect(deferred.isRejected).toBe(false);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should reject with the error passed to reject()", async ({ page }) => {
                const isOk = await page.evaluate(async () => {
                    const deferred = new window.jsUtils.common.Deferred<number>();
                    const error = new Error("Test error");
                    deferred.reject(error);
                    await window.playwrightUtils.expect(deferred.promise).rejects.toThrow(error);
                    await Promise.allSettled([deferred.promise]);
                    window.playwrightUtils.expect(deferred.state).toBe("rejected");
                    window.playwrightUtils.expect(deferred.isPending).toBe(false);
                    window.playwrightUtils.expect(deferred.isFinalized).toBe(true);
                    window.playwrightUtils.expect(deferred.isResolved).toBe(false);
                    window.playwrightUtils.expect(deferred.isRejected).toBe(true);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should ignore calls to resolve() and reject() if the deferred has already been resolved", async ({ page }) => {
                const isOk = await page.evaluate(async () => {
                    const deferred = new window.jsUtils.common.Deferred<number>();
                    deferred.resolve(142);
                    deferred.resolve(100);
                    deferred.reject(new Error("Test error"));
                    await window.playwrightUtils.expect(deferred.promise).resolves.toBe(142);
                    await Promise.allSettled([deferred.promise]);
                    window.playwrightUtils.expect(deferred.state).toBe("resolved");
                    window.playwrightUtils.expect(deferred.isPending).toBe(false);
                    window.playwrightUtils.expect(deferred.isFinalized).toBe(true);
                    window.playwrightUtils.expect(deferred.isResolved).toBe(true);
                    window.playwrightUtils.expect(deferred.isRejected).toBe(false);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should ignore calls to resolve() and reject() if the deferred has already been rejected", async ({ page }) => {
                const isOk = await page.evaluate(async () => {
                    const deferred = new window.jsUtils.common.Deferred<number>();
                    const error = new Error("Test error");
                    deferred.reject(error);
                    deferred.resolve(100);
                    deferred.reject(new Error("Another error"));
                    await window.playwrightUtils.expect(deferred.promise).rejects.toThrow(error);
                    await Promise.allSettled([deferred.promise]);
                    window.playwrightUtils.expect(deferred.state).toBe("rejected");
                    window.playwrightUtils.expect(deferred.isPending).toBe(false);
                    window.playwrightUtils.expect(deferred.isFinalized).toBe(true);
                    window.playwrightUtils.expect(deferred.isResolved).toBe(false);
                    window.playwrightUtils.expect(deferred.isRejected).toBe(true);
                    return true;
                });
                expect(isOk).toBe(true);
            });
        });
    });
});
