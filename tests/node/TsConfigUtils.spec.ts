import nodePath from "path";
import { expect, test } from "@playwright/test";
import { TsConfigUtils } from "../../src/node/TsConfigUtils.ts";

test.describe("Node.js env", () => {
    test.describe("TsConfigUtils", () => {
        test.describe("static", () => {
            test.describe(".getImportAliases()", () => {
                test("should return an empty object when no paths are defined in the tsconfig", () => {
                    const dirPath = nodePath.resolve(import.meta.dirname, "./_assets/");
                    const importAliases = TsConfigUtils.getImportAliases(dirPath, "example-tsconfig-without-aliases.jsonc");
                    expect(importAliases).toStrictEqual({});
                });

                test("should return import aliases from the tsconfig", () => {
                    const dirPath = nodePath.resolve(import.meta.dirname, "./_assets/");
                    const importAliases = TsConfigUtils.getImportAliases(dirPath, "example-tsconfig-with-aliases.jsonc");
                    expect(importAliases).toStrictEqual({
                        "@": nodePath.resolve(dirPath, "src"),
                        "@components": nodePath.resolve(dirPath, "src/components"),
                    });
                });

                test("should return own import aliases from the tsconfig that extends another tsconfig with aliases", () => {
                    const dirPath = nodePath.resolve(import.meta.dirname, "./_assets/");
                    const importAliases = TsConfigUtils.getImportAliases(dirPath, "example-tsconfig-with-extends-with-aliases.jsonc");
                    expect(importAliases).toStrictEqual({
                        "@utils": nodePath.resolve(dirPath, "src/utils"),
                    });
                });

                test("should return import aliases from the extended tsconfig if the analyzed tsconfig has no own aliases", () => {
                    const dirPath = nodePath.resolve(import.meta.dirname, "./_assets/");
                    const importAliases = TsConfigUtils.getImportAliases(dirPath, "example-tsconfig-with-extends-without-aliases.jsonc");
                    expect(importAliases).toStrictEqual({
                        "@": nodePath.resolve(dirPath, "src"),
                        "@components": nodePath.resolve(dirPath, "src/components"),
                    });
                });
            });
        });
    });
});
