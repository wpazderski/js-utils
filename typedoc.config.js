const packageVersion = process.env["PACKAGE_VERSION"];
if (packageVersion === undefined) {
    throw new Error("PACKAGE_VERSION environment variable is not set. Please set it before running the script.");
}

/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
    plugin: ["typedoc-github-theme"],
    entryPoints: ["src/"],
    entryPointStrategy: "expand",
    exclude: [],
    headings: {
        readme: false,
    },
    outputs: [
        {
            name: "html",
            path: `./docs/v${packageVersion}/`,
        },
    ],
    navigation: {
        includeCategories: true,
        includeGroups: false,
        includeFolders: true,
        compactFolders: false,
        excludeReferences: true,
    },
    validation: {
        notExported: true,
        invalidLink: true,
        rewrittenLink: true,
        notDocumented: true,
        unusedMergeModuleWith: true,
    },
    excludeInternal: true,
    intentionallyNotExported: ["_CallbacksName", "_TimeoutHandle", "_AnimationFrameHandle", "_IdleCallbackHandle"],
    intentionallyNotDocumented: ["common/Deferred.Deferred.promise", "common/Deferred.Deferred.state"],
};

export default config;
