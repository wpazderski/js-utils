import { expect, test } from "@playwright/test";
import { PathUtils } from "../../src/node/PathUtils.ts";

test.describe("Node.js env", () => {
    test.describe("PathUtils", () => {
        test.describe("static", () => {
            test.describe(".ensurePathIsAbsolute()", () => {
                test("should return the same path if it is already absolute", () => {
                    const absolutePath1 = "/absolute/path/to/file.txt";
                    const absolutePath2 = "/absolute/path/to/dir";
                    const absolutePath3 = "/absolute/path/to/dir/";
                    const result1 = PathUtils.ensurePathIsAbsolute(absolutePath1);
                    const result2 = PathUtils.ensurePathIsAbsolute(absolutePath2);
                    const result3 = PathUtils.ensurePathIsAbsolute(absolutePath3);
                    expect(result1).toBe(absolutePath1);
                    expect(result2).toBe(absolutePath2);
                    expect(result3).toBe(absolutePath3);
                });

                test("should convert relative paths to absolute paths when no rootAbsolutePath is provided", () => {
                    const relativePath1 = "relative/path/to/file.txt";
                    const relativePath2 = "relative/path/to/dir";
                    const relativePath3 = "relative/path/to/dir/";
                    const cwd = process.cwd();
                    const absolutePath1 = PathUtils.ensurePathIsAbsolute(relativePath1);
                    const absolutePath2 = PathUtils.ensurePathIsAbsolute(relativePath2);
                    const absolutePath3 = PathUtils.ensurePathIsAbsolute(relativePath3);
                    expect(absolutePath1).toBe(`${cwd}/relative/path/to/file.txt`);
                    expect(absolutePath2).toBe(`${cwd}/relative/path/to/dir`);
                    expect(absolutePath3).toBe(`${cwd}/relative/path/to/dir`);
                });

                test("should convert relative paths to absolute paths when a rootAbsolutePath is provided", () => {
                    const relativePath1 = "relative/path/to/file.txt";
                    const relativePath2 = "relative/path/to/dir";
                    const relativePath3 = "relative/path/to/dir/";
                    const rootAbsolutePath1 = "/root/absolute/path";
                    const rootAbsolutePath2 = "/root/absolute/path/";
                    const absolutePath1_1 = PathUtils.ensurePathIsAbsolute(relativePath1, rootAbsolutePath1);
                    const absolutePath1_2 = PathUtils.ensurePathIsAbsolute(relativePath1, rootAbsolutePath2);
                    const absolutePath2_1 = PathUtils.ensurePathIsAbsolute(relativePath2, rootAbsolutePath1);
                    const absolutePath2_2 = PathUtils.ensurePathIsAbsolute(relativePath2, rootAbsolutePath2);
                    const absolutePath3_1 = PathUtils.ensurePathIsAbsolute(relativePath3, rootAbsolutePath1);
                    const absolutePath3_2 = PathUtils.ensurePathIsAbsolute(relativePath3, rootAbsolutePath2);
                    expect(absolutePath1_1).toBe("/root/absolute/path/relative/path/to/file.txt");
                    expect(absolutePath1_2).toBe("/root/absolute/path/relative/path/to/file.txt");
                    expect(absolutePath2_1).toBe("/root/absolute/path/relative/path/to/dir");
                    expect(absolutePath2_2).toBe("/root/absolute/path/relative/path/to/dir");
                    expect(absolutePath3_1).toBe("/root/absolute/path/relative/path/to/dir");
                    expect(absolutePath3_2).toBe("/root/absolute/path/relative/path/to/dir");
                });
            });

            test.describe(".sanitizeDirPath()", () => {
                test("should replace backslashes with forward slashes", () => {
                    const path1 = "/path\\to/dir";
                    const path2 = "C:\\path\\to\\dir";
                    const sanitizedPath1 = PathUtils.sanitizeDirPath(path1);
                    const sanitizedPath2 = PathUtils.sanitizeDirPath(path2);
                    expect(sanitizedPath1).toBe("/path/to/dir/");
                    expect(sanitizedPath2).toBe("C:/path/to/dir/");
                });

                test("should ensure the path ends with a trailing slash by default", () => {
                    const path1 = "/path/to/dir";
                    const path2 = "/path/to/dir/";
                    const sanitizedPath1 = PathUtils.sanitizeDirPath(path1);
                    const sanitizedPath2 = PathUtils.sanitizeDirPath(path2);
                    expect(sanitizedPath1).toBe("/path/to/dir/");
                    expect(sanitizedPath2).toBe("/path/to/dir/");
                });

                test("should not add a trailing slash if withTrailingSlash is false", () => {
                    const path1 = "/path/to/dir";
                    const path2 = "/path/to/dir/";
                    const sanitizedPath1 = PathUtils.sanitizeDirPath(path1, false);
                    const sanitizedPath2 = PathUtils.sanitizeDirPath(path2, false);
                    expect(sanitizedPath1).toBe("/path/to/dir");
                    expect(sanitizedPath2).toBe("/path/to/dir");
                });

                test("should remove the trailing slash if withTrailingSlash is false", () => {
                    const path1 = "/path/to/dir/";
                    const path2 = "/path/to/dir";
                    const sanitizedPath1 = PathUtils.sanitizeDirPath(path1, false);
                    const sanitizedPath2 = PathUtils.sanitizeDirPath(path2, false);
                    expect(sanitizedPath1).toBe("/path/to/dir");
                    expect(sanitizedPath2).toBe("/path/to/dir");
                });
            });

            test.describe(".sanitizeFilePath()", () => {
                test("should replace backslashes with forward slashes", () => {
                    const path1 = "C:\\path\\to\\file.txt";
                    const path2 = "/path\\to/file.txt";
                    const sanitizedPath1 = PathUtils.sanitizeFilePath(path1);
                    const sanitizedPath2 = PathUtils.sanitizeFilePath(path2);
                    expect(sanitizedPath1).toBe("C:/path/to/file.txt");
                    expect(sanitizedPath2).toBe("/path/to/file.txt");
                });

                test("should not modify paths that already use forward slashes", () => {
                    const path = "/path/to/file.txt";
                    const sanitizedPath = PathUtils.sanitizeFilePath(path);
                    expect(sanitizedPath).toBe("/path/to/file.txt");
                });
            });
        });
    });
});
