import type * as common from "../src/common/index.ts";
import type * as web from "../src/web/index.ts";

interface JsUtils {
    common: typeof common;
    web: typeof web;
}

declare global {
    interface Window {
        jsUtils: JsUtils;
    }
}
