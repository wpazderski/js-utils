/* eslint-disable import/no-default-export */
/* eslint-disable import/no-extraneous-dependencies */
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    root: import.meta.dirname,
    define: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        "import.meta.env.isTestEnv": process.env["IS_TEST_ENV"] === "true",
    },
});
