import type { RegistryEntryKey } from "../Registry.ts";

/**
 * Represents an error that occurs when trying to access an entry in the registry that has not been registered.
 */
export class RegistryEntryNotRegisteredError extends Error {
    /**
     * Creates a new RegistryEntryNotRegisteredError instance.
     */
    constructor(entryKey: RegistryEntryKey) {
        super(`Registry: entry with key "${entryKey}" has not been registered in the registry.`);
    }
}
