import { expect, test } from "@playwright/test";
import { RegistryEntryAlreadyRegisteredError } from "../../../../src/common/collections/errors/RegistryEntryAlreadyRegisteredError.ts";

test.describe("Node.js env", () => {
    test.describe("RegistryEntryAlreadyRegisteredError", () => {
        test.describe("instance", () => {
            test("should be an instance of Error", () => {
                const error = new RegistryEntryAlreadyRegisteredError("TestEntry123");
                expect(error).toBeInstanceOf(Error);
            });

            test("should have message that includes the entry name", () => {
                const entryName = "TestEntry123";
                const error = new RegistryEntryAlreadyRegisteredError(entryName);
                expect(error.message).toContain(entryName);
            });
        });
    });
});
