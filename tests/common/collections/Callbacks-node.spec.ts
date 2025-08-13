import { expect, test } from "@playwright/test";
import { Callbacks } from "../../../src/common/collections/Callbacks.ts";

test.describe("Node.js env", () => {
    test.describe("Callbacks", () => {
        test.describe("instance", () => {
            test("should have name specified in the constructor", () => {
                const callbacks1 = new Callbacks("TestCallbacks1");
                expect(callbacks1.name).toBe("TestCallbacks1");
                const callbacks2 = new Callbacks();
                expect(callbacks2.name).toBeUndefined();
            });

            test("should call registered callbacks when call() is invoked", () => {
                const callbacks = new Callbacks();
                const results: string[] = [];
                callbacks.add(() => {
                    results.push(`Callback 1`);
                });
                callbacks.add(() => {
                    results.push(`Callback 2`);
                });
                callbacks.call("TestValue");
                expect(results).toStrictEqual(["Callback 1", "Callback 2"]);
            });

            test("should call registered callbacks with args passed to call()", () => {
                const callbacks = new Callbacks();
                const results: Array<{ callbackId: number; value: string; otherValue: number; anObject: { id: number; name: string } }> = [];
                const testObject = { id: 1, name: "TestObject" };
                callbacks.add((value: string, otherValue: number, anObject: typeof testObject) => {
                    results.push({ callbackId: 1, value, otherValue, anObject });
                });
                callbacks.add((value: string, otherValue: number, anObject: typeof testObject) => {
                    results.push({ callbackId: 2, value, otherValue, anObject });
                });
                callbacks.call("TestValue", 142, testObject);
                expect(results).toStrictEqual([
                    { callbackId: 1, value: "TestValue", otherValue: 142, anObject: { id: 1, name: "TestObject" } },
                    { callbackId: 2, value: "TestValue", otherValue: 142, anObject: { id: 1, name: "TestObject" } },
                ]);
                expect(results[0]?.anObject).toBe(testObject);
                expect(results[1]?.anObject).toBe(testObject);
            });

            test("should call callbacks in the order they were added", () => {
                const callbacks = new Callbacks();
                const results: string[] = [];
                callbacks.add((value: string) => {
                    results.push(`Callback 1: ${value}`);
                });
                callbacks.add((value: string) => {
                    results.push(`Callback 2: ${value}`);
                });
                callbacks.add((value: string) => {
                    results.push(`Callback 3: ${value}`);
                });
                callbacks.call("TestValue");
                expect(results).toStrictEqual(["Callback 1: TestValue", "Callback 2: TestValue", "Callback 3: TestValue"]);
            });

            test("should not call callbacks that were removed before call()", () => {
                const callbacks = new Callbacks();
                const results: string[] = [];
                const callback1 = (): void => {
                    results.push(`Callback 1`);
                };
                const callback2 = (): void => {
                    results.push(`Callback 2`);
                };
                const callback3 = (): void => {
                    results.push(`Callback 3`);
                };
                callbacks.add(callback1);
                callbacks.add(callback2);
                callbacks.add(callback3);
                callbacks.remove(callback2);
                callbacks.call();
                expect(results).toStrictEqual(["Callback 1", "Callback 3"]);
            });

            test("should not add the same callback multiple times", () => {
                const callbacks = new Callbacks();
                const results: string[] = [];
                const callback = (): void => {
                    results.push(`Callback`);
                };
                callbacks.add(callback);
                callbacks.add(callback);
                callbacks.call();
                expect(results).toStrictEqual(["Callback"]);
            });

            test("should do nothing when removing a callback that was not added", () => {
                const callbacks = new Callbacks();
                const results: string[] = [];
                const callback1 = (): void => {
                    results.push(`Callback 1`);
                };
                const callback2 = (): void => {
                    results.push(`Callback 2`);
                };
                callbacks.add(callback1);
                callbacks.remove(callback2);
                callbacks.call();
                expect(results).toStrictEqual(["Callback 1"]);
            });

            test("should do nothing when removing a callback that has already been removed", () => {
                const callbacks = new Callbacks();
                const results: string[] = [];
                const callback1 = (): void => {
                    results.push(`Callback1`);
                };
                const callback2 = (): void => {
                    results.push(`Callback2`);
                };
                callbacks.add(callback1);
                callbacks.add(callback2);
                callbacks.remove(callback1);
                callbacks.remove(callback1);
                callbacks.call();
                expect(results).toStrictEqual(["Callback2"]);
            });

            test("should not throw an error when calling call() with no callbacks registered", () => {
                const callbacks = new Callbacks();
                expect(() => {
                    callbacks.call();
                }).not.toThrow();
            });
        });
    });
});
