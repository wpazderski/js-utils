import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("RegistryEntryNotRegisteredError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", async ({ page }) => {
                const isOk = await page.evaluate(() => {
                    const error = new window.jsUtils.common.collections.errors.RegistryEntryNotRegisteredError("TestEntry123");
                    window.playwrightUtils.expect(error).toBeInstanceOf(Error);
                    return true;
                });
                expect(isOk).toBe(true);
            });

            test("should have message that includes the entry name", async ({ page }) => {
                const entryName = "TestEntry123";
                const isOk = await page.evaluate(
                    // eslint-disable-next-line @typescript-eslint/no-shadow
                    ([entryName]) => {
                        const error = new window.jsUtils.common.collections.errors.RegistryEntryNotRegisteredError(entryName);
                        window.playwrightUtils.expect(error.message).toContain(entryName);
                        return true;
                    },
                    [entryName] as [string],
                );
                expect(isOk).toBe(true);
            });
        });
    });
});
