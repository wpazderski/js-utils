import { expect, test } from "@playwright/test";
import { Deferred } from "../../src/common/Deferred.ts";

test.describe("Node.js env", () => {
    test.describe("Deferred", () => {
        test.describe("instance", () => {
            test("should have correct initial state", () => {
                const deferred = new Deferred();
                expect(deferred.promise).toBeInstanceOf(Promise);
                expect(deferred.state).toBe("pending");
                expect(deferred.isPending).toBe(true);
                expect(deferred.isFinalized).toBe(false);
                expect(deferred.isResolved).toBe(false);
                expect(deferred.isRejected).toBe(false);
            });

            test("should resolve to the value passed to resolve()", async () => {
                const deferred = new Deferred<number>();
                deferred.resolve(142);
                await expect(deferred.promise).resolves.toBe(142);
                expect(deferred.state).toBe("resolved");
                expect(deferred.isPending).toBe(false);
                expect(deferred.isFinalized).toBe(true);
                expect(deferred.isResolved).toBe(true);
                expect(deferred.isRejected).toBe(false);
            });

            test("should reject with the error passed to reject()", async () => {
                const deferred = new Deferred<number>();
                const error = new Error("Test error");
                deferred.reject(error);
                await expect(deferred.promise).rejects.toThrow(error);
                expect(deferred.state).toBe("rejected");
                expect(deferred.isPending).toBe(false);
                expect(deferred.isFinalized).toBe(true);
                expect(deferred.isResolved).toBe(false);
                expect(deferred.isRejected).toBe(true);
            });

            test("should ignore calls to resolve() and reject() if the deferred has already been resolved", async () => {
                const deferred = new Deferred<number>();
                deferred.resolve(142);
                deferred.resolve(100);
                deferred.reject(new Error("Test error"));
                await expect(deferred.promise).resolves.toBe(142);
                expect(deferred.state).toBe("resolved");
                expect(deferred.isPending).toBe(false);
                expect(deferred.isFinalized).toBe(true);
                expect(deferred.isResolved).toBe(true);
                expect(deferred.isRejected).toBe(false);
            });

            test("should ignore calls to resolve() and reject() if the deferred has already been rejected", async () => {
                const deferred = new Deferred<number>();
                const error = new Error("Test error");
                deferred.reject(error);
                deferred.resolve(100);
                deferred.reject(new Error("Another error"));
                await expect(deferred.promise).rejects.toThrow(error);
                expect(deferred.state).toBe("rejected");
                expect(deferred.isPending).toBe(false);
                expect(deferred.isFinalized).toBe(true);
                expect(deferred.isResolved).toBe(false);
                expect(deferred.isRejected).toBe(true);
            });
        });
    });
});
