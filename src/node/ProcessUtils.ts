import { spawn as nodeSpawn } from "child_process";

/**
 * Options for running an npm script.
 */
export interface RunNpmScriptOptions {
    /**
     * Whether the script is a workspace script.
     */
    isWorkspaceScript: boolean;

    /**
     * Determines how the child process will handle standard input/output streams.
     */
    stdio?: "inherit" | "ignore" | undefined;

    /**
     * The current working directory from which the script will be run.
     * If not specified, the current working directory of the process will be used.
     */
    cwd?: string | undefined;

    /**
     * Behavior when the script exits with a non-zero code.
     * - "reject" (default): Rejects the promise with an error.
     * - "consoleError": Logs an error message to the console but resolves the promise.
     * - "ignore": Ignores the error and resolves the promise.
     */
    errorBehavior?: "reject" | "consoleError" | "ignore" | undefined;
}

/**
 * Utility class for processes.
 */
export class ProcessUtils {
    /**
     * Runs a specified npm script using `pnpm run`.
     *
     * @param scriptName - The name of the npm script to run.
     * @param options - Options for running the script.
     */
    static async runNpmScript(scriptName: string, options: RunNpmScriptOptions): Promise<void> {
        const originalCwd = process.cwd();
        if (options.cwd !== undefined) {
            process.chdir(options.cwd);
        }
        try {
            await new Promise<void>((resolve, reject) => {
                const childProcess = spawn("pnpm", [...(options.isWorkspaceScript ? ["-w"] : []), "run", scriptName], {
                    stdio: options.stdio ?? "ignore",
                });
                childProcess.on("exit", (code: number) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        const errorBehavior = options.errorBehavior ?? "reject";
                        if (errorBehavior === "consoleError") {
                            // eslint-disable-next-line no-console
                            console.error(`npm run ${scriptName} exited with code ${code.toString()}`);
                            resolve();
                        } else if (errorBehavior === "ignore") {
                            resolve();
                        } else {
                            reject(new Error(`npm run ${scriptName} exited with code ${code.toString()}`));
                        }
                    }
                });
            });
        } finally {
            process.chdir(originalCwd);
        }
    }
}

/**
 * DO NOT USE
 * Internal type for overriding spawn() in tests.
 * This is used for testing purposes only and should not be used in production code.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface __Test_SimpleSpawnOptions {
    stdio?: "inherit" | "ignore" | undefined;
}

/**
 * DO NOT USE
 * Internal type for overriding spawn() in tests.
 * This is used for testing purposes only and should not be used in production code.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export interface __Test_SimpleSpawnResult {
    on: (event: "exit", callback: (code: number) => void) => void;
}

/**
 * DO NOT USE
 * Internal type for overriding spawn() in tests.
 * This is used for testing purposes only and should not be used in production code.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export type __Test_SimpleSpawn = (command: string, args?: readonly string[], options?: __Test_SimpleSpawnOptions) => __Test_SimpleSpawnResult;

let spawn: __Test_SimpleSpawn = nodeSpawn as unknown as __Test_SimpleSpawn;

/**
 * DO NOT USE
 * Internal function to override spawn() in tests.
 * This is used for testing purposes only and should not be used in production code.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function __test_overrideSpawn(newSpawn: __Test_SimpleSpawn | null): void {
    spawn = newSpawn ?? (nodeSpawn as unknown as __Test_SimpleSpawn);
}
