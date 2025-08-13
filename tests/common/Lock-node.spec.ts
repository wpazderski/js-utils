import { expect, test } from "@playwright/test";
import { Lock } from "../../src/common/Lock.ts";

test.describe("Node.js env", () => {
    test.describe("Lock", () => {
        test.describe("instance", () => {
            test("should not be locked initially", async () => {
                const lock = new Lock();
                let hasBeenCalled = false;
                const hasBeenCalledBeforeTimeout0 = new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(hasBeenCalled);
                    }, 0);
                });
                await lock.withLock(() => {
                    hasBeenCalled = true;
                });
                expect(hasBeenCalled).toBe(true);
                expect(await hasBeenCalledBeforeTimeout0).toBe(true);
            });

            test("should call callbacks in the order withLock() was called", async () => {
                const lock = new Lock();
                let result = "";
                const promises: Array<Promise<void>> = [];
                for (let i = 0; i < 5; i++) {
                    promises.push(
                        // eslint-disable-next-line @typescript-eslint/no-loop-func
                        lock.withLock(() => {
                            result += i.toString();
                        }),
                    );
                }
                await Promise.all(promises);
                expect(result).toBe("01234");
            });

            test("should not allow concurrent access to the locked section", async () => {
                const lock = new Lock();
                const results: string[] = [];
                const promises: Array<Promise<void>> = [];
                for (let i = 0; i < 5; i++) {
                    results.push(`Scheduling ${i.toString()}`);
                    promises.push(
                        lock.withLock(async () => {
                            results.push(`Entering ${i.toString()}`);
                            await new Promise<void>((resolve) => {
                                setTimeout(() => {
                                    resolve();
                                }, 100);
                            });
                            results.push(`Exiting ${i.toString()}`);
                        }),
                    );
                    results.push(`Scheduled ${i.toString()}`);
                }
                await Promise.all(promises);
                expect(results).toStrictEqual([
                    "Scheduling 0",
                    "Scheduled 0",
                    "Scheduling 1",
                    "Scheduled 1",
                    "Scheduling 2",
                    "Scheduled 2",
                    "Scheduling 3",
                    "Scheduled 3",
                    "Scheduling 4",
                    "Scheduled 4",
                    "Entering 0",
                    "Exiting 0",
                    "Entering 1",
                    "Exiting 1",
                    "Entering 2",
                    "Exiting 2",
                    "Entering 3",
                    "Exiting 3",
                    "Entering 4",
                    "Exiting 4",
                ]);
            });

            test("should work after an error is thrown in the locked section", async () => {
                const lock = new Lock();
                let result = "";
                const promises: Array<Promise<void>> = [];
                for (let i = 0; i < 5; i++) {
                    promises.push(
                        // eslint-disable-next-line @typescript-eslint/no-loop-func
                        lock.withLock(() => {
                            if (i === 2) {
                                throw new Error("Test error");
                            }
                            result += i.toString();
                        }),
                    );
                }
                await Promise.allSettled(promises);
                expect(result).toBe("0134");
            });
        });
    });
});
