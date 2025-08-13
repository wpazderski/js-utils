import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("CallbackError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const error = new window.jsUtils.common.collections.errors.CallbackError(["an error 987", new Error("Test error 789")], "TestEntry123");
                    window.playwrightUtils.expect(error).toBeInstanceOf(Error);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should have message that includes the Callbacks instance name and errors", async ({ page }) => {
                const errors = ["an error 987", new Error("Test error 789")] as const;
                const callbacksName = "TestEntry123";
                const isOk = await page.evaluate(
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    ([errors, callbacksName]) => {
                        const error = new window.jsUtils.common.collections.errors.CallbackError(errors, callbacksName);
                        window.playwrightUtils.expect(error.message).toContain(callbacksName);
                        window.playwrightUtils.expect(error.message).toContain(errors[0]);
                        window.playwrightUtils.expect(error.message).toContain((errors[1] as Error).message);
                        return true;
                    },
                    [errors as unknown, callbacksName] as [unknown[], string],
                );
                expect(isOk).toBe(true);
            });
        });
    });
});
