import { expect, test } from "@playwright/test";
import { CallbackError } from "../../../../src/common/collections/errors/CallbackError.ts";

test.describe("Node.js env", () => {
    test.describe("CallbackError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", () => {
                const error = new CallbackError(["an error 987", new Error("Test error 789")], "TestEntry123");
                expect(error).toBeInstanceOf(Error);
            });

            test("should have message that includes the Callbacks instance name and errors", () => {
                const errors = ["an error 987", new Error("Test error 789")] as const;
                const callbacksName = "TestEntry123";
                const error = new CallbackError(errors as unknown as unknown[], callbacksName);
                expect(error.message).toContain(callbacksName);
                expect(error.message).toContain(errors[0]);
                expect(error.message).toContain(errors[1].message);
            });
        });
    });
});
