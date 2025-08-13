import fs from "fs";
import nodePath from "path";
import type { CompilerOptions } from "typescript";

/**
 * Represents a partial TypeScript configuration file (tsconfig.json).
 */
export interface PartialTsConfig {
    /**
     * Represents the compiler options in a TypeScript configuration file (tsconfig.json).
     */
    compilerOptions?: CompilerOptions | undefined;

    /**
     * Represents the path to the tsconfig.json file that this configuration extends.
     */
    extends?: string | undefined;
}

/**
 * Utility class for working with TypeScript configuration files (tsconfig.json).
 */
export class TsConfigUtils {
    /**
     * Extracts import aliases from a TypeScript configuration file (tsconfig.json).
     * Trailing "/*" in the alias and path is removed.
     *
     * @param tsConfigFileDir The directory containing the tsconfig.json file.
     * @param tsConfigFileName The name of the tsconfig.json file. Defaults to "tsconfig.json".
     * @returns An object mapping import aliases to their resolved paths.
     */
    static getImportAliases(tsConfigFileDir: string, tsConfigFileName = "tsconfig.json"): Record<string, string> {
        const tsConfigFilePath = nodePath.resolve(tsConfigFileDir, tsConfigFileName);
        let tsConfigFileContent = fs.readFileSync(tsConfigFilePath, "utf8");

        // Remove comments: https://stackoverflow.com/a/62945875
        // eslint-disable-next-line prefer-named-capture-group, @typescript-eslint/strict-boolean-expressions
        tsConfigFileContent = tsConfigFileContent.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/gu, (m, g) => (g ? "" : m));

        // Remove trailing commas
        // eslint-disable-next-line prefer-named-capture-group
        tsConfigFileContent = tsConfigFileContent.replace(/,\s*([\]}])/gu, "$1");

        const partialTsConfig = JSON.parse(tsConfigFileContent) as PartialTsConfig;
        if (!partialTsConfig.compilerOptions?.paths) {
            if (typeof partialTsConfig.extends === "string" && partialTsConfig.extends.length > 0) {
                // If the tsconfig extends another one, try to load the extended config
                const extendedTsConfigPath = nodePath.resolve(tsConfigFileDir, partialTsConfig.extends);
                return this.getImportAliases(nodePath.dirname(extendedTsConfigPath), nodePath.basename(extendedTsConfigPath));
            }
            return {};
        }
        const paths = partialTsConfig.compilerOptions.paths;
        const aliases: Record<string, string> = {};
        for (let [fullAlias, [rawPath]] of Object.entries(paths)) {
            if (rawPath !== undefined) {
                fullAlias = fullAlias.replace(/\\/gu, "/");
                rawPath = rawPath.replace(/\\/gu, "/");
                const alias = fullAlias.endsWith("/*") ? fullAlias.slice(0, -2) : fullAlias;
                const path = rawPath.endsWith("/*") ? rawPath.slice(0, -2) : rawPath;
                aliases[alias] = nodePath.resolve(tsConfigFileDir, path);
            }
        }
        return aliases;
    }
}
