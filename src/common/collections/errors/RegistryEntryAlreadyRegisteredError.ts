import type { RegistryEntryKey } from "../Registry.ts";

/**
 * Represents an error that occurs when trying to register an entry in the registry if an entry with the same key has already been registered.
 */
export class RegistryEntryAlreadyRegisteredError extends Error {
    /**
     * Creates a new RegistryEntryAlreadyRegisteredError instance.
     *
     * @param entryKey - The key of the entry that has already been registered.
     */
    constructor(entryKey: RegistryEntryKey) {
        super(`Registry: entry with key "${entryKey}" has already been registered in the registry.`);
    }
}
