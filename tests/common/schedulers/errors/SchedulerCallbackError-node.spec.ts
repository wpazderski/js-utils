import { expect, test } from "@playwright/test";
import { SchedulerCallbackError } from "../../../../src/common/schedulers/errors/SchedulerCallbackError.ts";

test.describe("Node.js env", () => {
    test.describe("SchedulerCallbackError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", () => {
                const error = new SchedulerCallbackError(new Error("Test 123"));
                expect(error).toBeInstanceOf(Error);
            });

            test("should have message that includes the callback error message", () => {
                const callbackErrorMessage = "Test 123";
                const error = new SchedulerCallbackError(new Error(callbackErrorMessage));
                expect(error.message).toContain(callbackErrorMessage);
            });
        });
    });
});
