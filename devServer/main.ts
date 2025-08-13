import * as common from "../src/common/index.ts";
import * as web from "../src/web/index.ts";
import { setupCounter } from "./counter.ts";
import typescriptLogo from "./typescript.svg";
import viteLogo from "./vite.svg";
import "./style.css";

if (import.meta.env["isTestEnv"] === true) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    void import("@wpazderski/playwright-utils/webEnvExtensions/web.js");
}

window.jsUtils = {
    common: common,
    web: web,
};

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) {
    throw new Error("App element not found");
}

appElement.innerHTML = `
    <div>
        <a href="https://vite.dev" target="_blank">
             <img src="${viteLogo}" class="logo" alt="Vite logo" />
        </a>
        <a href="https://www.typescriptlang.org/" target="_blank">
            <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
        </a>
        <h1>Vite + TypeScript</h1>
        <div class="card">
            <button id="counter" type="button"></button>
        </div>
        <p class="read-the-docs">
            Click on the Vite and TypeScript logos to learn more
        </p>
    </div>
`;

const counterElement = document.querySelector<HTMLButtonElement>("#counter");
if (!counterElement) {
    throw new Error("Counter element not found");
}
setupCounter(counterElement);
