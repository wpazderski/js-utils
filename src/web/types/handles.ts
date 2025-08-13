import type { Opaque } from "../../common/types/basic.ts";

/**
 * Represents a handle for an animation frame.
 */
export type AnimationFrameHandle = Opaque<number, typeof _AnimationFrameHandle>;
declare const _AnimationFrameHandle: unique symbol;

/**
 * Represents a handle for an idle callback (value returned by requestIdleCallback()).
 */
export type IdleCallbackHandle = Opaque<number, typeof _IdleCallbackHandle>;
declare const _IdleCallbackHandle: unique symbol;
