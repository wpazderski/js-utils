// eslint-disable-next-line import/no-extraneous-dependencies
import { type NodePackageToolsConfig, configs, mergeConfigs } from "@wpazderski/node-package-tools";

const config: NodePackageToolsConfig = mergeConfigs(configs.base.latest, {
    outdatedPackages: {
        allowedPackages: [
            {
                name: "@wpazderski/eslint-config",
                shouldWarn: true,
            },
            {
                name: "@wpazderski/node-package-tools",
                shouldWarn: true,
            },
            {
                name: "@wpazderski/playwright-config",
                shouldWarn: true,
            },
            {
                name: "@wpazderski/playwright-utils",
                shouldWarn: true,
            },
            {
                name: "@wpazderski/prettier-config",
                shouldWarn: true,
            },
            {
                name: "@wpazderski/typescript-config",
                shouldWarn: true,
            },
        ],
    },
});

// eslint-disable-next-line import/no-default-export
export default config;
