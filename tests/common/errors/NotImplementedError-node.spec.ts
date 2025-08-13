import { expect, test } from "@playwright/test";
import { NotImplementedError } from "../../../src/common/errors/NotImplementedError.ts";

test.describe("Node.js env", () => {
    test.describe("NotImplementedError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", () => {
                const error = new NotImplementedError("Test 123");
                expect(error).toBeInstanceOf(Error);
            });

            test("should have message that includes the subject", () => {
                const subject = "Test 123";
                const error = new NotImplementedError(subject);
                expect(error.message).toContain(subject);
            });
        });
    });
});
