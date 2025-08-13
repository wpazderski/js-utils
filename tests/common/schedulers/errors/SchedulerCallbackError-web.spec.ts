import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("SchedulerCallbackError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const error = new window.jsUtils.common.schedulers.errors.SchedulerCallbackError(new Error("Test 123"));
                    window.playwrightUtils.expect(error).toBeInstanceOf(Error);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should have message that includes the callback error message", async ({ page }) => {
                const callbackErrorMessage = "Test 123";
                const isOk = await page.evaluate(
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    ([callbackErrorMessage]) => {
                        const error = new window.jsUtils.common.schedulers.errors.SchedulerCallbackError(new Error(callbackErrorMessage));
                        window.playwrightUtils.expect(error.message).toContain(callbackErrorMessage);
                        return true;
                    },
                    [callbackErrorMessage] as [string],
                );
                expect(isOk).toBe(true);
            });
        });
    });
});
