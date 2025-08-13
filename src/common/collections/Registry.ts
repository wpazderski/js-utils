import { Callbacks } from "./Callbacks.ts";
import { RegistryEntryAlreadyRegisteredError } from "./errors/RegistryEntryAlreadyRegisteredError.ts";
import { RegistryEntryNotRegisteredError } from "./errors/RegistryEntryNotRegisteredError.ts";

/**
 * Represents a key for a registry entry.
 */
export type RegistryEntryKey = string;

/**
 * Represents an entry in a registry with its key.
 *
 * @template TKey - The type of the entry key.
 * @template TValue - The type of the entry value.
 */
export interface RegistryEntryWithKey<TKey extends RegistryEntryKey, TValue> {
    /**
     * The key of the registry entry.
     */
    entryKey: TKey;

    /**
     * The value of the registry entry.
     */
    entry: TValue;
}

/**
 * Options for configuring a registry.
 */
export interface RegistryOptions {
    /**
     * Whether the registry should be case-insensitive.
     * Default is false (case-sensitive).
     */
    caseInsensitive: boolean;
}

/**
 * Callback called when an entry is registered.
 *
 * @template TKey - The type of the entry key, which should extend `RegistryEntryKey`.
 * @template TValue - The type of the entry value.
 */
export type EntryRegisteredCallback<TKey extends RegistryEntryKey, TValue> = (entryKey: TKey, entry: TValue) => void;

/**
 * Callback called when an entry is unregistered.
 *
 * @template TKey - The type of the entry key, which should extend `RegistryEntryKey`.
 */
export type EntryUnregisteredCallback<TKey extends RegistryEntryKey> = (entryKey: TKey) => void;

/**
 * Callback called when an entry is overridden.
 *
 * @template TKey - The type of the entry key, which should extend `RegistryEntryKey`.
 * @template TValue - The type of the entry value.
 */
export type EntryOverriddenCallback<TKey extends RegistryEntryKey, TValue> = (entryKey: TKey, previousEntry: TValue | undefined, newEntry: TValue) => void;

/**
 * A generic registry class that allows registering, unregistering, and retrieving entries by their keys.
 *
 * @template TKey - The type of the entry key, which should extend `RegistryEntryKey`.
 * @template TValue - The type of the entry value.
 */
export class Registry<TKey extends RegistryEntryKey, TValue> {
    /**
     * Callbacks for when an entry is registered.
     */
    readonly entryRegisteredCallbacks: Callbacks<EntryRegisteredCallback<TKey, TValue>> = new Callbacks<EntryRegisteredCallback<TKey, TValue>>();

    /**
     * Callbacks for when an entry is unregistered.
     */
    readonly entryUnregisteredCallbacks: Callbacks<EntryUnregisteredCallback<TKey>> = new Callbacks<EntryUnregisteredCallback<TKey>>();

    /**
     * Callbacks for when an entry is overridden.
     */
    readonly entryOverriddenCallbacks: Callbacks<EntryOverriddenCallback<TKey, TValue>> = new Callbacks<EntryOverriddenCallback<TKey, TValue>>();

    /**
     * Options for configuring the registry.
     */
    protected options: RegistryOptions;

    /**
     * The base registry from which this registry derives entries.
     * If provided, this registry will inherit entries from the base registry.
     * It will also register itself as a derived registry of the base registry.
     * This allows for hierarchical registries where derived registries can extend or override entries from the base registry.
     */
    protected baseRegistry: Registry<TKey, TValue> | undefined = undefined;

    /**
     * Holds entries of the registry.
     * The keys are the entry keys, and the values are the corresponding entries.
     * If the registry is case-insensitive, the keys will be stored in lowercase.
     */
    private entries: Record<string, TValue> = {};

    /**
     * Creates a new instance of the Registry class.
     *
     * @param options - Optional configuration options for the registry.
     * @param baseRegistry - An optional base registry from which this registry will inherit entries.
     */
    constructor(options?: Partial<RegistryOptions>, baseRegistry?: Registry<TKey, TValue>) {
        this.options = {
            caseInsensitive: false,
            ...options,
        };
        if (baseRegistry) {
            this.baseRegistry = baseRegistry;
            this.baseRegistry.entryRegisteredCallbacks.add((entryKey, entry) => {
                if (!(entryKey in this.entries)) {
                    this.entryRegisteredCallbacks.call(entryKey, entry);
                }
            });
            this.baseRegistry.entryUnregisteredCallbacks.add((entryKey) => {
                if (!(entryKey in this.entries)) {
                    this.entryUnregisteredCallbacks.call(entryKey);
                }
            });
            this.baseRegistry.entryOverriddenCallbacks.add((entryKey, previousEntry, newEntry) => {
                if (!(entryKey in this.entries)) {
                    this.entryOverriddenCallbacks.call(entryKey, previousEntry, newEntry);
                }
            });
        }
    }

    /**
     * Checks if the registry is case-sensitive.
     */
    isCaseSensitive(): boolean {
        return !this.options.caseInsensitive;
    }

    /**
     * Registers a new entry in the registry.
     * If the entry key already exists, it throws a {@link RegistryEntryAlreadyRegisteredError}.
     *
     * @param entryKey - The key for the entry to register.
     * @param entry - The value of the entry to register.
     *
     * @throws {@link RegistryEntryAlreadyRegisteredError} If the entry key has already been registered.
     */
    register(entryKey: TKey, entry: TValue): void {
        let actualEntryKey = entryKey;
        if (this.options.caseInsensitive) {
            actualEntryKey = actualEntryKey.toLowerCase() as TKey;
        }
        if (actualEntryKey in this.entries) {
            throw new RegistryEntryAlreadyRegisteredError(actualEntryKey);
        }
        this.registerCore(actualEntryKey, entry);
    }

    /**
     * Registers or overrides an existing entry in the registry.
     * If the entry key does not exist, it will be registered.
     * If the entry key already exists, it will override the existing entry without throwing an error.
     *
     * @param entryKey - The key for the entry to register or override.
     * @param entry - The value of the entry to register or override.
     */
    registerOrOverride(entryKey: TKey, entry: TValue): void {
        let actualEntryKey = entryKey;
        if (this.options.caseInsensitive) {
            actualEntryKey = actualEntryKey.toLowerCase() as TKey;
        }
        this.registerCore(actualEntryKey, entry);
    }

    /**
     * Unregisters an entry from the registry.
     * If the entry key does not exist, it throws a {@link RegistryEntryNotRegisteredError}.
     *
     * @param entryKey - The key for the entry to unregister.
     *
     * @throws {@link RegistryEntryNotRegisteredError} If the entry key has not been registered.
     */
    unregister(entryKey: TKey): void {
        let actualEntryKey = entryKey;
        if (this.options.caseInsensitive) {
            actualEntryKey = actualEntryKey.toLowerCase() as TKey;
        }
        if (!(actualEntryKey in this.entries)) {
            throw new RegistryEntryNotRegisteredError(actualEntryKey);
        }
        this.unregisterCore(actualEntryKey);
    }

    /**
     * Unregisters an entry from the registry if it is registered.
     * If the entry key does not exist, it does nothing.
     *
     * @param entryKey - The key for the entry to unregister if registered.
     */
    unregisterIfRegistered(entryKey: TKey): void {
        let actualEntryKey = entryKey;
        if (this.options.caseInsensitive) {
            actualEntryKey = actualEntryKey.toLowerCase() as TKey;
        }
        this.unregisterCore(actualEntryKey);
    }

    /**
     * Retrieves an entry from the registry by its key.
     * If the entry key does not exist, it returns undefined.
     *
     * @param entryKey - The key for the entry to retrieve.
     * @returns The value of the entry if found, otherwise undefined.
     */
    getEntry(entryKey: TKey): TValue | undefined {
        let actualEntryKey = entryKey;
        if (this.options.caseInsensitive) {
            actualEntryKey = actualEntryKey.toLowerCase() as TKey;
        }
        if (!(actualEntryKey in this.entries) && this.baseRegistry) {
            return this.baseRegistry.getEntry(entryKey);
        }
        return this.entries[actualEntryKey];
    }

    /**
     * Checks if an entry with the specified key exists in the registry.
     *
     * @param entryKey - The key for the entry to check.
     * @returns True if the entry exists, otherwise false.
     */
    hasEntry(entryKey: TKey): boolean {
        let actualEntryKey = entryKey;
        if (this.options.caseInsensitive) {
            actualEntryKey = actualEntryKey.toLowerCase() as TKey;
        }
        if (!(actualEntryKey in this.entries) && this.baseRegistry) {
            return this.baseRegistry.hasEntry(entryKey);
        }
        return actualEntryKey in this.entries;
    }

    /**
     * Retrieves all entry keys from the registry.
     *
     * @returns An array of keys for all entries in the registry.
     */
    getEntryKeys(): TKey[] {
        return [...(this.baseRegistry ? this.baseRegistry.getEntryKeys().filter((key) => !(key in this.entries)) : []), ...Object.keys(this.entries)] as TKey[];
    }

    /**
     * Retrieves all entries from the registry.
     *
     * @returns An array of all entry values in the registry.
     */
    getEntries(): TValue[] {
        return [
            ...(this.baseRegistry
                ? this.baseRegistry
                      .getEntriesWithKeys()
                      .filter((entryWithKey) => !(entryWithKey.entryKey in this.entries))
                      .map((entryWithKey) => entryWithKey.entry)
                : []),
            ...Object.values(this.entries),
        ];
    }

    /**
     * Retrieves all entries with their keys from the registry.
     *
     * @returns An array of objects containing both the entry key and the entry value.
     */
    getEntriesWithKeys(): Array<RegistryEntryWithKey<TKey, TValue>> {
        return [
            ...(this.baseRegistry ? this.baseRegistry.getEntriesWithKeys().filter((entryWithKey) => !(entryWithKey.entryKey in this.entries)) : []),
            ...Object.entries(this.entries).map(([entryKey, entry]) => ({
                entryKey: entryKey as TKey,
                entry: entry,
            })),
        ];
    }

    /**
     * Iterates over all entries in the registry and calls the provided callback function for each entry.
     *
     * @param callback - A function that will be called for each entry in the registry. The callback receives two parameters: value and key of current entry.
     */
    forEach(callback: (entry: TValue, entryKey: TKey) => void): void {
        if (this.baseRegistry) {
            this.baseRegistry.forEach((entry, entryKey) => {
                if (!(entryKey in this.entries)) {
                    callback(entry, entryKey);
                }
            });
        }
        for (const [entryKey, entry] of Object.entries(this.entries)) {
            callback(entry, entryKey as TKey);
        }
    }

    /**
     * Core method for registering an entry in the registry.
     * This method is called by the public `register` and `registerOrOverride` methods.
     * It does not check if the entry key already exist.
     *
     * @param entryKey - The key for the entry to register.
     * @param entry - The value of the entry to register.
     */
    protected registerCore(entryKey: TKey, entry: TValue): void {
        const hasPreviousOwnEntry = entryKey in this.entries;
        const previousOwnEntry = this.entries[entryKey];
        if (hasPreviousOwnEntry && entry === previousOwnEntry) {
            return;
        }
        this.entries[entryKey] = entry;
        if (hasPreviousOwnEntry) {
            this.entryOverriddenCallbacks.call(entryKey, previousOwnEntry, entry);
        } else if (this.baseRegistry?.hasEntry(entryKey) === true) {
            const baseEntry = this.baseRegistry.getEntry(entryKey)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
            if (baseEntry !== entry) {
                this.entryOverriddenCallbacks.call(entryKey, baseEntry, entry);
            }
        } else {
            this.entryRegisteredCallbacks.call(entryKey, entry);
        }
    }

    /**
     * Core method for unregistering an entry from the registry.
     * This method is called by the public `unregister` and `unregisterIfRegistered` methods.
     *
     * @param entryKey - The key for the entry to unregister.
     */
    protected unregisterCore(entryKey: TKey): void {
        if (!(entryKey in this.entries)) {
            return;
        }
        const ownEntry = this.entries[entryKey]!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
        delete this.entries[entryKey]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
        if (this.baseRegistry?.hasEntry(entryKey) === true) {
            const baseEntry = this.baseRegistry.getEntry(entryKey)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
            if (baseEntry !== ownEntry) {
                this.entryOverriddenCallbacks.call(entryKey, ownEntry, baseEntry);
            }
        } else {
            this.entryUnregisteredCallbacks.call(entryKey);
        }
    }
}
