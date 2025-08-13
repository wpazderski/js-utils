import nodePath from "path";
import { expect, test } from "@playwright/test";
import { ProcessUtils, type __Test_SimpleSpawnOptions, __test_overrideSpawn } from "../../src/node/ProcessUtils.ts";

test.describe("Node.js env", () => {
    test.describe("ProcessUtils", () => {
        test.describe("static", () => {
            test.describe(".runNpmScript()", () => {
                test.describe.configure({ mode: "serial" });

                test("should run given non-workspace script", async () => {
                    const { exitWithCode, callDataPromise } = waitForSpawnCall();
                    void ProcessUtils.runNpmScript("test-script", {
                        isWorkspaceScript: false,
                    });
                    exitWithCode(0);
                    const callData = await callDataPromise;
                    expect(callData.command).toBe("pnpm");
                    expect(callData.args).toStrictEqual(["run", "test-script"]);
                    expect(callData.options).toStrictEqual({
                        stdio: "ignore",
                    });
                });

                test("should run given workspace script", async () => {
                    const { exitWithCode, callDataPromise } = waitForSpawnCall();
                    void ProcessUtils.runNpmScript("test-script", {
                        isWorkspaceScript: true,
                    });
                    exitWithCode(0);
                    const callData = await callDataPromise;
                    expect(callData.command).toBe("pnpm");
                    expect(callData.args).toStrictEqual(["-w", "run", "test-script"]);
                    expect(callData.options).toStrictEqual({
                        stdio: "ignore",
                    });
                });

                test("should use given stdio option value", async () => {
                    const { exitWithCode, callDataPromise } = waitForSpawnCall();
                    void ProcessUtils.runNpmScript("test-script", {
                        isWorkspaceScript: false,
                        stdio: "inherit",
                    });
                    exitWithCode(0);
                    const callData = await callDataPromise;
                    expect(callData.command).toBe("pnpm");
                    expect(callData.args).toStrictEqual(["run", "test-script"]);
                    expect(callData.options).toStrictEqual({
                        stdio: "inherit",
                    });
                });

                test("should run the script in the specified cwd", async () => {
                    const { exitWithCode, callDataPromise } = waitForSpawnCall();
                    const cwd = nodePath.resolve(import.meta.dirname, "./_assets/");
                    void ProcessUtils.runNpmScript("test-script", {
                        isWorkspaceScript: false,
                        cwd: cwd,
                    });
                    expect(process.cwd()).toBe(cwd);
                    exitWithCode(0);
                    const callData = await callDataPromise;
                    expect(callData.command).toBe("pnpm");
                    expect(callData.args).toStrictEqual(["run", "test-script"]);
                    expect(callData.options).toStrictEqual({
                        stdio: "ignore",
                    });
                });

                test("should restore the original cwd after running the script", async () => {
                    const originalCwd = process.cwd();
                    const { exitWithCode, callDataPromise } = waitForSpawnCall();
                    const cwd = nodePath.resolve(import.meta.dirname, "./_assets/");
                    void ProcessUtils.runNpmScript("test-script", {
                        isWorkspaceScript: false,
                        cwd: cwd,
                    });
                    expect(process.cwd()).toBe(cwd);
                    exitWithCode(0);
                    const callData = await callDataPromise;
                    expect(process.cwd()).toBe(originalCwd);
                    expect(callData.command).toBe("pnpm");
                    expect(callData.args).toStrictEqual(["run", "test-script"]);
                    expect(callData.options).toStrictEqual({
                        stdio: "ignore",
                    });
                });

                test("should reject the promise if the script exits with a non-zero code and errorBehavior is not specified", async () => {
                    const { exitWithCode, callDataPromise } = waitForSpawnCall();
                    const promise = ProcessUtils.runNpmScript("test-script", {
                        isWorkspaceScript: false,
                    });
                    exitWithCode(1);
                    await expect(promise).rejects.toThrow("npm run test-script exited with code 1");
                    const callData = await callDataPromise;
                    expect(callData.command).toBe("pnpm");
                    expect(callData.args).toStrictEqual(["run", "test-script"]);
                    expect(callData.options).toStrictEqual({
                        stdio: "ignore",
                    });
                });

                test("should reject the promise if the script exits with a non-zero code and errorBehavior is 'reject'", async () => {
                    const { exitWithCode, callDataPromise } = waitForSpawnCall();
                    const promise = ProcessUtils.runNpmScript("test-script", {
                        isWorkspaceScript: false,
                        errorBehavior: "reject",
                    });
                    exitWithCode(1);
                    await expect(promise).rejects.toThrow("npm run test-script exited with code 1");
                    const callData = await callDataPromise;
                    expect(callData.command).toBe("pnpm");
                    expect(callData.args).toStrictEqual(["run", "test-script"]);
                    expect(callData.options).toStrictEqual({
                        stdio: "ignore",
                    });
                });

                test("should log an error message to the console if errorBehavior is 'consoleError'", async () => {
                    const { exitWithCode, callDataPromise } = waitForSpawnCall();
                    // eslint-disable-next-line no-console
                    const origConsoleError = console.error;
                    const consoleErrorCalls: unknown[][] = [];
                    // eslint-disable-next-line no-console
                    console.error = (...args: unknown[]) => {
                        consoleErrorCalls.push(args);
                    };
                    const promise = ProcessUtils.runNpmScript("test-script", {
                        isWorkspaceScript: false,
                        errorBehavior: "consoleError",
                    });
                    exitWithCode(1);
                    await promise;
                    expect(consoleErrorCalls).toStrictEqual([["npm run test-script exited with code 1"]]);
                    const callData = await callDataPromise;
                    expect(callData.command).toBe("pnpm");
                    expect(callData.args).toStrictEqual(["run", "test-script"]);
                    expect(callData.options).toStrictEqual({
                        stdio: "ignore",
                    });
                    // eslint-disable-next-line require-atomic-updates, no-console
                    console.error = origConsoleError;
                });

                test("should ignore the error if errorBehavior is 'ignore'", async () => {
                    const { exitWithCode, callDataPromise } = waitForSpawnCall();
                    const promise = ProcessUtils.runNpmScript("test-script", {
                        isWorkspaceScript: false,
                        errorBehavior: "ignore",
                    });
                    exitWithCode(1);
                    await expect(promise).resolves.toBeUndefined();
                    const callData = await callDataPromise;
                    expect(callData.command).toBe("pnpm");
                    expect(callData.args).toStrictEqual(["run", "test-script"]);
                    expect(callData.options).toStrictEqual({
                        stdio: "ignore",
                    });
                });
            });
        });
    });
});

interface SpawnCallData {
    command: string;
    args?: readonly string[] | undefined;
    options?: __Test_SimpleSpawnOptions | undefined;
}

interface WaitForSpawnCallResult {
    exitWithCode: (code: number) => void;
    callDataPromise: Promise<SpawnCallData>;
}

function waitForSpawnCall(): WaitForSpawnCallResult {
    let onExitCallback: ((code: number) => void) | null = null;
    const exitWithCode = (code: number): void => {
        onExitCallback?.(code);
    };
    const callDataPromise = new Promise<SpawnCallData>((resolve) => {
        __test_overrideSpawn((command, args, options) => {
            resolve({
                command: command,
                args: args,
                options: options,
            });
            return {
                on: (event, callback) => {
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (event === "exit") {
                        onExitCallback = callback;
                    }
                },
            };
        });
    });

    return {
        exitWithCode: exitWithCode,
        callDataPromise: callDataPromise,
    };
}
