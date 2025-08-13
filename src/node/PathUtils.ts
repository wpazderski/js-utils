import * as nodePath from "path";

/**
 * Utility class for handling FS path operations.
 */
export class PathUtils {
    /**
     * Ensures that the given path is absolute. If it is not, it resolves it against the provided rootAbsolutePath or the current working directory.
     *
     * @param path The path to ensure is absolute.
     * @param rootAbsolutePath The root path to resolve against if the path is not absolute.
     * @returns The absolute path.
     */
    static ensurePathIsAbsolute(path: string, rootAbsolutePath?: string): string {
        return nodePath.isAbsolute(path) ? path : nodePath.resolve(rootAbsolutePath ?? process.cwd(), path);
    }

    /**
     * Sanitizes a directory path by replacing backslashes with forward slashes and optionally ensuring it has a trailing slash.
     *
     * @param path The directory path to sanitize.
     * @param withTrailingSlash Whether to ensure the path ends with a trailing slash. Defaults to true.
     * @returns The sanitized directory path.
     */
    static sanitizeDirPath(path: string, withTrailingSlash = true): string {
        let sanitizedPath = path.replace(/\\/gu, "/");

        const hasTrailingSlash = sanitizedPath.endsWith("/");
        if (withTrailingSlash && !hasTrailingSlash) {
            sanitizedPath += "/";
        } else if (!withTrailingSlash && hasTrailingSlash) {
            sanitizedPath = sanitizedPath.slice(0, -1);
        }

        return sanitizedPath;
    }

    /**
     * Sanitizes a file path by replacing backslashes with forward slashes.
     *
     * @param path The file path to sanitize.
     * @returns The sanitized file path.
     */
    static sanitizeFilePath(path: string): string {
        return path.replace(/\\/gu, "/");
    }
}
