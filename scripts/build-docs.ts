/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable prefer-template */
import { spawn } from "child_process";
import * as fs from "fs";
import packageJson from "../package.json" with { type: "json" };

// Config
const versionsFileName = "./docs/versions";
const indexHtmlFileName = "./docs/index.html";
const rootAssetsPath = "./docs/assets/";
const packageName = packageJson.name;
const packageVersion = packageJson.version;
const indexHtmlTemplate =
    `
<!DOCTYPE html>
<html class="default" lang="en" data-base="./">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="IE=edge" />
        <title>${packageName}</title>
        <meta name="description" content="Documentation for ${packageName}"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet" href="v{{LATEST_VERSION}}/assets/style.css"/>
        <link rel="stylesheet" href="v{{LATEST_VERSION}}/assets/highlight.css"/>
        <link rel="stylesheet" href="v{{LATEST_VERSION}}/assets/typedoc-github-style.css"/>
        <style type="text/css">
            .container-main {
                display: block;
            }
            .versions-list {
                font-family: var(--font-family-code);
            }
        </style>
    </head>
    <body>
        <header class="tsd-page-toolbar">
            <div class="tsd-toolbar-contents container">
                <a href="index.html" class="title">${packageName}</a>
            </div>
        </header>
        <div class="container container-main">
            <h3>Versions:</h3>
            <ul class="versions-list">
{{VERSIONS}}
            </ul>
        </div>
    </body>
</html>
`.trim() + "\n";
const versionHtmlTemplate = `                <li><a href="./v{{VERSION}}/index.html">v{{VERSION}}</a></li>`;

// Generate documentation using typedoc
process.env["PACKAGE_VERSION"] = packageVersion;
await new Promise<void>((resolve, reject) => {
    spawn("pnpm", ["exec", "typedoc"], {
        stdio: "inherit",
    }).on("exit", (code) => {
        if (code === 0) {
            resolve();
        } else {
            reject(new Error(`typedoc exited with code ${String(code ?? "<unknown>")}`));
        }
    });
});

// Fix misplaced assets in the generated docs
// See https://github.com/JulianWowra/typedoc-github-theme/pull/6
const assetsPath = `./docs/v${packageVersion}/assets/`;
const rootAssets = fs.readdirSync(rootAssetsPath);
for (const asset of rootAssets) {
    const sourcePath = `${rootAssetsPath}${asset}`;
    const targetPath = `${assetsPath}${asset}`;
    if (!fs.existsSync(targetPath)) {
        fs.renameSync(sourcePath, targetPath);
    }
}
fs.rmdirSync(rootAssetsPath);

// Append the current package version to the versions file
const versions = fs.existsSync(versionsFileName)
    ? fs
          .readFileSync(versionsFileName, "utf-8")
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line !== "")
    : [];
if (!versions.includes(packageVersion)) {
    versions.push(packageVersion);
}
fs.writeFileSync(versionsFileName, versions.join("\n"), "utf-8");

// Generate the index.html file with the list of versions
const latestVersion = versions[versions.length - 1]!;
const versionsHtml = versions
    .toReversed()
    .map((version) => versionHtmlTemplate.replace(/\{\{VERSION\}\}/gu, version))
    .join("\n");
const indexHtmlContent = indexHtmlTemplate.replace(/\{\{VERSIONS\}\}/gu, versionsHtml).replace(/\{\{LATEST_VERSION\}\}/gu, latestVersion);
fs.writeFileSync(indexHtmlFileName, indexHtmlContent, "utf-8");
