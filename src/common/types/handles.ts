import type { Opaque } from "./basic.ts";

/**
 * Represents a handle for a timeout created by `setTimeout`.
 * This type depends on current environment:
 * - In browsers, it is a number.
 * - In Node.js, it is a NodeJS.Timeout object.
 */
export type TimeoutHandle = Opaque<ReturnType<typeof setTimeout>, typeof _TimeoutHandle>;
declare const _TimeoutHandle: unique symbol;
