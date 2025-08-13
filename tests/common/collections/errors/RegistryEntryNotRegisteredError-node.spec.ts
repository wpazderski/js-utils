import { expect, test } from "@playwright/test";
import { RegistryEntryNotRegisteredError } from "../../../../src/common/collections/errors/RegistryEntryNotRegisteredError.ts";

test.describe("Node.js env", () => {
    test.describe("RegistryEntryNotRegisteredError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", () => {
                const error = new RegistryEntryNotRegisteredError("TestEntry123");
                expect(error).toBeInstanceOf(Error);
            });

            test("should have message that includes the entry name", () => {
                const entryName = "TestEntry123";
                const error = new RegistryEntryNotRegisteredError(entryName);
                expect(error.message).toContain(entryName);
            });
        });
    });
});
