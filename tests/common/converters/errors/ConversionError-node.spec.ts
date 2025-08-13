import { expect, test } from "@playwright/test";
import { ConversionError } from "../../../../src/common/converters/errors/ConversionError.ts";

test.describe("Node.js env", () => {
    test.describe("ConversionError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", () => {
                const error = new ConversionError("Test 123");
                expect(error).toBeInstanceOf(Error);
            });

            test("should have message that includes the value", () => {
                const value = "Test 123";
                const error = new ConversionError(value);
                expect(error.message).toContain(value);
            });
        });
    });
});
