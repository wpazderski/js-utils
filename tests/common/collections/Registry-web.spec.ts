import { expect, test } from "@playwright/test";
import { PageUtils } from "@wpazderski/playwright-utils/PageUtils.js";
import { setupWebEnvExtensions } from "@wpazderski/playwright-utils/webEnvExtensions/setupWebEnvExtensions.js";

test.describe("Web env", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        PageUtils.pipeWebConsoleToStdout(page);
        await setupWebEnvExtensions(page);
    });

    test.describe("Registry", () => {
        test.describe("instance", () => {
            test.describe(".isCaseSensitive()", () => {
                test("should return correct values depending on options passed to the constructor", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry1 = new window.jsUtils.common.collections.Registry();
                        const registry2 = new window.jsUtils.common.collections.Registry({ caseInsensitive: true });
                        const registry3 = new window.jsUtils.common.collections.Registry({ caseInsensitive: false });
                        window.playwrightUtils.expect(registry1.isCaseSensitive()).toBe(true);
                        window.playwrightUtils.expect(registry2.isCaseSensitive()).toBe(false);
                        window.playwrightUtils.expect(registry3.isCaseSensitive()).toBe(true);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".register()", () => {
                test("should register an entry that is not registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([]);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry.register(entryWithKey.entryKey.toLocaleUpperCase(), entryWithKey.entry);
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([
                            { entryKey: entryWithKey.entryKey, entry: entryWithKey.entry },
                            { entryKey: entryWithKey.entryKey.toLocaleUpperCase(), entry: entryWithKey.entry },
                        ]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should throw an error if the entry is already registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry1 = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry1.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils
                            .expect(() => {
                                registry1.register(entryWithKey.entryKey, 100);
                            })
                            .toThrowError(new window.jsUtils.common.collections.errors.RegistryEntryAlreadyRegisteredError(entryWithKey.entryKey));
                        window.playwrightUtils
                            .expect(() => {
                                registry1.register(entryWithKey.entryKey, 142);
                            })
                            .toThrowError(new window.jsUtils.common.collections.errors.RegistryEntryAlreadyRegisteredError(entryWithKey.entryKey));

                        const registry2 = new window.jsUtils.common.collections.Registry<string, number>({ caseInsensitive: true });
                        registry2.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils
                            .expect(() => {
                                registry2.register(entryWithKey.entryKey.toLocaleUpperCase(), 100);
                            })
                            .toThrowError(new window.jsUtils.common.collections.errors.RegistryEntryAlreadyRegisteredError(entryWithKey.entryKey.toLocaleLowerCase()));
                        window.playwrightUtils
                            .expect(() => {
                                registry2.register(entryWithKey.entryKey.toLocaleUpperCase(), 142);
                            })
                            .toThrowError(new window.jsUtils.common.collections.errors.RegistryEntryAlreadyRegisteredError(entryWithKey.entryKey.toLocaleLowerCase()));
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should register an entry in a derived registry even if it is registered in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        window.playwrightUtils
                            .expect(() => {
                                derivedRegistry.register("entry1", 102);
                            })
                            .not.toThrow();
                        window.playwrightUtils.expect(derivedRegistry.getEntriesWithKeys()).toStrictEqual([{ entryKey: "entry1", entry: 102 }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".registerOrOverride()", () => {
                test("should register an entry that is not registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([]);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry.register(entryWithKey.entryKey.toLocaleUpperCase(), entryWithKey.entry);
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([
                            { entryKey: entryWithKey.entryKey, entry: entryWithKey.entry },
                            { entryKey: entryWithKey.entryKey.toLocaleUpperCase(), entry: entryWithKey.entry },
                        ]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should override an entry that is already registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry1 = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry1.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(registry1.getEntriesWithKeys()).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: entryWithKey.entry }]);
                        const newEntry1 = 100;
                        registry1.registerOrOverride(entryWithKey.entryKey, newEntry1);
                        window.playwrightUtils.expect(registry1.getEntriesWithKeys()).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: newEntry1 }]);

                        const registry2 = new window.jsUtils.common.collections.Registry<string, number>({ caseInsensitive: true });
                        registry2.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils
                            .expect(registry2.getEntriesWithKeys())
                            .toStrictEqual([{ entryKey: entryWithKey.entryKey.toLocaleLowerCase(), entry: entryWithKey.entry }]);
                        const newEntry2 = 100;
                        registry2.registerOrOverride(entryWithKey.entryKey.toLocaleUpperCase(), newEntry2);
                        window.playwrightUtils.expect(registry2.getEntriesWithKeys()).toStrictEqual([{ entryKey: entryWithKey.entryKey.toLocaleLowerCase(), entry: newEntry2 }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".unregister()", () => {
                test("should unregister an entry that is registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry.register(entryWithKey.entryKey.toLocaleUpperCase(), entryWithKey.entry);
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([
                            { entryKey: entryWithKey.entryKey, entry: entryWithKey.entry },
                            { entryKey: entryWithKey.entryKey.toLocaleUpperCase(), entry: entryWithKey.entry },
                        ]);
                        registry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils
                            .expect(registry.getEntriesWithKeys())
                            .toStrictEqual([{ entryKey: entryWithKey.entryKey.toLocaleUpperCase(), entry: entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should throw an error if the entry is not registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry1 = new window.jsUtils.common.collections.Registry<string, number>();
                        window.playwrightUtils
                            .expect(() => {
                                registry1.unregister("nonExistentKey");
                            })
                            .toThrowError(new window.jsUtils.common.collections.errors.RegistryEntryNotRegisteredError("nonExistentKey"));
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry1.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils
                            .expect(() => {
                                registry1.unregister(entryWithKey.entryKey.toLocaleUpperCase());
                            })
                            .toThrowError(new window.jsUtils.common.collections.errors.RegistryEntryNotRegisteredError(entryWithKey.entryKey.toLocaleUpperCase()));
                        window.playwrightUtils.expect(registry1.getEntriesWithKeys()).toStrictEqual([entryWithKey]);

                        const registry2 = new window.jsUtils.common.collections.Registry<string, number>({ caseInsensitive: true });
                        window.playwrightUtils
                            .expect(() => {
                                registry2.unregister("nonExistentKey");
                            })
                            .toThrowError(new window.jsUtils.common.collections.errors.RegistryEntryNotRegisteredError("nonexistentkey"));
                        registry2.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils
                            .expect(() => {
                                registry2.unregister(entryWithKey.entryKey.toLocaleUpperCase());
                            })
                            .not.toThrow();
                        window.playwrightUtils.expect(registry2.getEntriesWithKeys()).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should throw an error if the entry is not registered in derived registry, but is registered in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        window.playwrightUtils
                            .expect(() => {
                                derivedRegistry.unregister("entry1");
                            })
                            .toThrowError(new window.jsUtils.common.collections.errors.RegistryEntryNotRegisteredError("entry1"));
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".unregisterIfRegistered()", () => {
                test("should unregister an entry that is registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry.register(entryWithKey.entryKey.toLocaleUpperCase(), entryWithKey.entry);
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([
                            { entryKey: entryWithKey.entryKey, entry: entryWithKey.entry },
                            { entryKey: entryWithKey.entryKey.toLocaleUpperCase(), entry: entryWithKey.entry },
                        ]);
                        registry.unregisterIfRegistered(entryWithKey.entryKey);
                        window.playwrightUtils
                            .expect(registry.getEntriesWithKeys())
                            .toStrictEqual([{ entryKey: entryWithKey.entryKey.toLocaleUpperCase(), entry: entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should do nothing if the entry is not registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry1 = new window.jsUtils.common.collections.Registry<string, number>();
                        window.playwrightUtils.expect(registry1.getEntriesWithKeys()).toStrictEqual([]);
                        window.playwrightUtils
                            .expect(() => {
                                registry1.unregisterIfRegistered("nonExistentKey");
                            })
                            .not.toThrow();
                        window.playwrightUtils.expect(registry1.getEntriesWithKeys()).toStrictEqual([]);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry1.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(registry1.getEntriesWithKeys()).toStrictEqual([entryWithKey]);
                        window.playwrightUtils
                            .expect(() => {
                                registry1.unregisterIfRegistered(entryWithKey.entryKey.toLocaleUpperCase());
                            })
                            .not.toThrow();
                        window.playwrightUtils.expect(registry1.getEntriesWithKeys()).toStrictEqual([entryWithKey]);

                        const registry2 = new window.jsUtils.common.collections.Registry<string, number>({ caseInsensitive: true });
                        window.playwrightUtils.expect(registry2.getEntriesWithKeys()).toStrictEqual([]);
                        window.playwrightUtils
                            .expect(() => {
                                registry2.unregisterIfRegistered("nonExistentKey");
                            })
                            .not.toThrow();
                        window.playwrightUtils.expect(registry2.getEntriesWithKeys()).toStrictEqual([]);
                        registry2.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils
                            .expect(registry2.getEntriesWithKeys())
                            .toStrictEqual([{ entryKey: entryWithKey.entryKey.toLocaleLowerCase(), entry: entryWithKey.entry }]);
                        window.playwrightUtils
                            .expect(() => {
                                registry2.unregisterIfRegistered(entryWithKey.entryKey.toLocaleUpperCase());
                            })
                            .not.toThrow();
                        window.playwrightUtils.expect(registry2.getEntriesWithKeys()).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should do nothing if the entry is not registered in derived registry, but is registered in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        window.playwrightUtils
                            .expect(() => {
                                derivedRegistry.unregisterIfRegistered("entry1");
                            })
                            .not.toThrow();
                        window.playwrightUtils.expect(baseRegistry.getEntriesWithKeys()).toStrictEqual([{ entryKey: "entry1", entry: 101 }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".getEntry()", () => {
                test("should return the entry for the given key if it exists", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry1 = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry1.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry1.register(entryWithKey.entryKey.toLocaleUpperCase(), entryWithKey.entry * 2);
                        window.playwrightUtils.expect(registry1.getEntry(entryWithKey.entryKey)).toBe(entryWithKey.entry);
                        window.playwrightUtils.expect(registry1.getEntry(entryWithKey.entryKey.toLocaleUpperCase())).toBe(entryWithKey.entry * 2);

                        const registry2 = new window.jsUtils.common.collections.Registry<string, number>({ caseInsensitive: true });
                        registry2.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(registry2.getEntry(entryWithKey.entryKey)).toBe(entryWithKey.entry);
                        window.playwrightUtils.expect(registry2.getEntry(entryWithKey.entryKey.toLocaleUpperCase())).toBe(entryWithKey.entry);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should return undefined if the entry for the given key does not exist", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        window.playwrightUtils.expect(registry.getEntry("nonExistentKey")).toBeUndefined();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(registry.getEntry(entryWithKey.entryKey.toLocaleUpperCase())).toBeUndefined();
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should merge entries from the base registry correctly", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        window.playwrightUtils.expect(derivedRegistry.getEntry("entry1")).toBe(101);
                        window.playwrightUtils.expect(derivedRegistry.getEntry("entry2")).toBe(202);
                        window.playwrightUtils.expect(derivedRegistry.getEntry("entry3")).toBe(103);
                        window.playwrightUtils.expect(derivedRegistry.getEntry("entry4")).toBe(204);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("registering, unregistering and overriding entries in the derived registry should not affect the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        derivedRegistry.register("entry5", 205);
                        derivedRegistry.registerOrOverride("entry2", 2020);
                        derivedRegistry.unregister("entry4");
                        window.playwrightUtils.expect(baseRegistry.getEntry("entry1")).toBe(101);
                        window.playwrightUtils.expect(baseRegistry.getEntry("entry2")).toBe(102);
                        window.playwrightUtils.expect(baseRegistry.getEntry("entry3")).toBe(103);
                        window.playwrightUtils.expect(baseRegistry.getEntry("entry4")).toBeUndefined();
                        window.playwrightUtils.expect(baseRegistry.getEntry("entry5")).toBeUndefined();
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".hasEntry()", () => {
                test("should return true if the entry for the given key exists", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry1 = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry1.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry1.register(entryWithKey.entryKey.toLocaleUpperCase(), entryWithKey.entry * 2);
                        window.playwrightUtils.expect(registry1.hasEntry(entryWithKey.entryKey)).toBe(true);
                        window.playwrightUtils.expect(registry1.hasEntry(entryWithKey.entryKey.toLocaleUpperCase())).toBe(true);

                        const registry2 = new window.jsUtils.common.collections.Registry<string, number>({ caseInsensitive: true });
                        registry2.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(registry2.hasEntry(entryWithKey.entryKey)).toBe(true);
                        window.playwrightUtils.expect(registry2.hasEntry(entryWithKey.entryKey.toLocaleUpperCase())).toBe(true);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should return false if the entry for the given key does not exist", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        window.playwrightUtils.expect(registry.hasEntry("nonExistentKey")).toBe(false);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should return true if the entry exists in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        window.playwrightUtils.expect(derivedRegistry.hasEntry("entry1")).toBe(true);
                        window.playwrightUtils.expect(derivedRegistry.hasEntry("entry2")).toBe(true);
                        window.playwrightUtils.expect(derivedRegistry.hasEntry("entry3")).toBe(true);
                        window.playwrightUtils.expect(derivedRegistry.hasEntry("entry4")).toBe(true);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("registering, unregistering and overriding entries in the derived registry should not affect the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        derivedRegistry.register("entry5", 205);
                        derivedRegistry.registerOrOverride("entry2", 2020);
                        derivedRegistry.unregister("entry4");
                        window.playwrightUtils.expect(baseRegistry.hasEntry("entry1")).toBe(true);
                        window.playwrightUtils.expect(baseRegistry.hasEntry("entry2")).toBe(true);
                        window.playwrightUtils.expect(baseRegistry.hasEntry("entry3")).toBe(true);
                        window.playwrightUtils.expect(baseRegistry.hasEntry("entry4")).toBe(false);
                        window.playwrightUtils.expect(baseRegistry.hasEntry("entry5")).toBe(false);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".getEntryKeys()", () => {
                test("should return the keys of all registered entries", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry.register(entryWithKey.entryKey.toLocaleUpperCase(), entryWithKey.entry * 2);
                        window.playwrightUtils.expect(registry.getEntryKeys()).toStrictEqual([entryWithKey.entryKey, entryWithKey.entryKey.toLocaleUpperCase()]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should merge entry keys from the base registry correctly", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        window.playwrightUtils.expect(derivedRegistry.getEntryKeys()).toStrictEqual(["entry1", "entry3", "entry2", "entry4"]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("registering, unregistering and overriding entries in the derived registry should not affect the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        derivedRegistry.register("entry5", 205);
                        derivedRegistry.registerOrOverride("entry2", 2020);
                        derivedRegistry.unregister("entry4");
                        window.playwrightUtils.expect(baseRegistry.getEntryKeys()).toStrictEqual(["entry1", "entry2", "entry3"]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".getEntries()", () => {
                test("should return values of all registered entries", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry.register(entryWithKey.entryKey.toLocaleUpperCase(), entryWithKey.entry * 2);
                        window.playwrightUtils.expect(registry.getEntries()).toStrictEqual([entryWithKey.entry, entryWithKey.entry * 2]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should merge entry values from the base registry correctly", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        window.playwrightUtils.expect(derivedRegistry.getEntries()).toStrictEqual([101, 103, 202, 204]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("registering, unregistering and overriding entries in the derived registry should not affect the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        derivedRegistry.register("entry5", 205);
                        derivedRegistry.registerOrOverride("entry2", 2020);
                        derivedRegistry.unregister("entry4");
                        window.playwrightUtils.expect(baseRegistry.getEntries()).toStrictEqual([101, 102, 103]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".getEntriesWithKeys()", () => {
                test("should return an array of objects with entry keys and entries", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry.register(entryWithKey.entryKey.toLocaleUpperCase(), entryWithKey.entry * 2);
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([
                            { entryKey: entryWithKey.entryKey, entry: entryWithKey.entry },
                            { entryKey: entryWithKey.entryKey.toLocaleUpperCase(), entry: entryWithKey.entry * 2 },
                        ]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should merge entries with keys from the base registry correctly", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        window.playwrightUtils.expect(derivedRegistry.getEntriesWithKeys()).toStrictEqual([
                            { entryKey: "entry1", entry: 101 },
                            { entryKey: "entry3", entry: 103 },
                            { entryKey: "entry2", entry: 202 },
                            { entryKey: "entry4", entry: 204 },
                        ]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("registering, unregistering and overriding entries in the derived registry should not affect the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        derivedRegistry.register("entry5", 205);
                        derivedRegistry.registerOrOverride("entry2", 2020);
                        derivedRegistry.unregister("entry4");
                        window.playwrightUtils.expect(baseRegistry.getEntriesWithKeys()).toStrictEqual([
                            { entryKey: "entry1", entry: 101 },
                            { entryKey: "entry2", entry: 102 },
                            { entryKey: "entry3", entry: 103 },
                        ]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".forEach()", () => {
                test("should call the callback for each registered entry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey1 = { entryKey: "testKey1", entry: 142 };
                        const entryWithKey2 = { entryKey: "testKey2", entry: 100 };
                        registry.register(entryWithKey1.entryKey, entryWithKey1.entry);
                        registry.register(entryWithKey2.entryKey, entryWithKey2.entry);
                        const results: Array<{ entry: number; entryKey: string }> = [];
                        registry.forEach((entry, entryKey) => {
                            results.push({ entry, entryKey });
                        });
                        window.playwrightUtils.expect(results).toStrictEqual([
                            { entry: entryWithKey1.entry, entryKey: entryWithKey1.entryKey },
                            { entry: entryWithKey2.entry, entryKey: entryWithKey2.entryKey },
                        ]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should not catch errors thrown by the callback", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey1 = { entryKey: "testKey1", entry: 142 };
                        const entryWithKey2 = { entryKey: "testKey2", entry: 100 };
                        registry.register(entryWithKey1.entryKey, entryWithKey1.entry);
                        registry.register(entryWithKey2.entryKey, entryWithKey2.entry);
                        window.playwrightUtils
                            .expect(() => {
                                registry.forEach(() => {
                                    throw new Error("Test error");
                                });
                            })
                            .toThrowError(new Error("Test error"));
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should call the callback for each entry in the base and derived registries in correct order", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        const results: Array<{ entry: number; entryKey: string }> = [];
                        derivedRegistry.forEach((entry, entryKey) => {
                            results.push({ entry, entryKey });
                        });
                        window.playwrightUtils.expect(results).toStrictEqual([
                            { entry: 101, entryKey: "entry1" },
                            { entry: 103, entryKey: "entry3" },
                            { entry: 202, entryKey: "entry2" },
                            { entry: 204, entryKey: "entry4" },
                        ]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("registering, unregistering and overriding entries in the derived registry should not affect the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        baseRegistry.register("entry1", 101);
                        baseRegistry.register("entry2", 102);
                        baseRegistry.register("entry3", 103);
                        derivedRegistry.register("entry2", 202);
                        derivedRegistry.register("entry4", 204);
                        derivedRegistry.register("entry5", 205);
                        derivedRegistry.registerOrOverride("entry2", 2020);
                        derivedRegistry.unregister("entry4");
                        const results: Array<{ entry: number; entryKey: string }> = [];
                        baseRegistry.forEach((entry, entryKey) => {
                            results.push({ entry, entryKey });
                        });
                        window.playwrightUtils.expect(results).toStrictEqual([
                            { entry: 101, entryKey: "entry1" },
                            { entry: 102, entryKey: "entry2" },
                            { entry: 103, entryKey: "entry3" },
                        ]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".registerCore()", () => {
                test("should register an entry that is not registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        class TestRegistry extends window.jsUtils.common.collections.Registry<string, number> {
                            registerCorePublic(entryKey: string, entry: number): void {
                                super.registerCore(entryKey, entry);
                            }
                        }
                        const registry = new TestRegistry();
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([]);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.registerCorePublic(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should not throw an error if the entry is already registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        class TestRegistry extends window.jsUtils.common.collections.Registry<string, number> {
                            registerCorePublic(entryKey: string, entry: number): void {
                                super.registerCore(entryKey, entry);
                            }
                        }
                        const registry = new TestRegistry();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.registerCorePublic(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils
                            .expect(() => {
                                registry.registerCorePublic(entryWithKey.entryKey, 100);
                            })
                            .not.toThrow();
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: 100 }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".unregisterCore()", () => {
                test("should unregister an entry that is registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        class TestRegistry extends window.jsUtils.common.collections.Registry<string, number> {
                            unregisterCorePublic(entryKey: string): void {
                                super.unregisterCore(entryKey);
                            }
                        }
                        const registry = new TestRegistry();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: entryWithKey.entry }]);
                        registry.unregisterCorePublic(entryWithKey.entryKey);
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("should not throw an error if the entry is not registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        class TestRegistry extends window.jsUtils.common.collections.Registry<string, number> {
                            unregisterCorePublic(entryKey: string): void {
                                super.unregisterCore(entryKey);
                            }
                        }
                        const registry = new TestRegistry();
                        window.playwrightUtils
                            .expect(() => {
                                registry.unregisterCorePublic("nonExistentKey");
                            })
                            .not.toThrow();
                        window.playwrightUtils.expect(registry.getEntriesWithKeys()).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".entryRegisteredCallbacks", () => {
                test("callbacks should be called when an entry is registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string; entry: number }> = [];
                        registry.entryRegisteredCallbacks.add((entryKey, entry) => {
                            callbackCalls.push({ entryKey, entry });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is overridden", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string; entry: number }> = [];
                        registry.entryRegisteredCallbacks.add((entryKey, entry) => {
                            callbackCalls.push({ entryKey, entry });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: entryWithKey.entry }]);
                        const newEntry = 100;
                        registry.registerOrOverride(entryWithKey.entryKey, newEntry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is unregistered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string; entry: number }> = [];
                        registry.entryRegisteredCallbacks.add((entryKey, entry) => {
                            callbackCalls.push({ entryKey, entry });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: entryWithKey.entry }]);
                        registry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry exists in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        const callbackCalls: Array<{ entryKey: string; entry: number }> = [];
                        derivedRegistry.entryRegisteredCallbacks.add((entryKey, entry) => {
                            callbackCalls.push({ entryKey, entry });
                        });
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        derivedRegistry.registerOrOverride(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should be called when an entry is registered in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string; entry: number }> = [];
                        derivedRegistry.entryRegisteredCallbacks.add((entryKey, entry) => {
                            callbackCalls.push({ entryKey, entry });
                        });
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([{ entryKey: entryWithKey.entryKey, entry: entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is registered in the base registry, but it exists in this registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const callbackCalls: Array<{ entryKey: string; entry: number }> = [];
                        derivedRegistry.entryRegisteredCallbacks.add((entryKey, entry) => {
                            callbackCalls.push({ entryKey, entry });
                        });
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".entryUnregisteredCallbacks", () => {
                test("callbacks should be called when an entry is unregistered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string }> = [];
                        registry.entryUnregisteredCallbacks.add((entryKey) => {
                            callbackCalls.push({ entryKey });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        registry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([{ entryKey: entryWithKey.entryKey }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string }> = [];
                        registry.entryUnregisteredCallbacks.add((entryKey) => {
                            callbackCalls.push({ entryKey });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is overridden", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string }> = [];
                        registry.entryUnregisteredCallbacks.add((entryKey) => {
                            callbackCalls.push({ entryKey });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        const newEntry = 100;
                        registry.registerOrOverride(entryWithKey.entryKey, newEntry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an identical entry exists in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const callbackCalls: Array<{ entryKey: string }> = [];
                        derivedRegistry.entryUnregisteredCallbacks.add((entryKey) => {
                            callbackCalls.push({ entryKey });
                        });
                        derivedRegistry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry with same key and different value exists in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, 2 * entryWithKey.entry);
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const callbackCalls: Array<{ entryKey: string }> = [];
                        derivedRegistry.entryUnregisteredCallbacks.add((entryKey) => {
                            callbackCalls.push({ entryKey });
                        });
                        derivedRegistry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should be called when an entry is unregistered in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const callbackCalls: Array<{ entryKey: string }> = [];
                        derivedRegistry.entryUnregisteredCallbacks.add((entryKey) => {
                            callbackCalls.push({ entryKey });
                        });
                        baseRegistry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([{ entryKey: entryWithKey.entryKey }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is registered in the base registry, but it exists in this registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const callbackCalls: Array<{ entryKey: string }> = [];
                        derivedRegistry.entryUnregisteredCallbacks.add((entryKey) => {
                            callbackCalls.push({ entryKey });
                        });
                        baseRegistry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });

            test.describe(".entryOverriddenCallbacks", () => {
                test("callbacks should be called when an entry is overridden", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        registry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        const newEntry = 100;
                        registry.registerOrOverride(entryWithKey.entryKey, newEntry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([{ entryKey: entryWithKey.entryKey, oldEntry: entryWithKey.entry, newEntry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is registered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        registry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is unregistered", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        registry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        registry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is overridden with same value", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const registry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        registry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        registry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        registry.registerOrOverride(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an identical entry exists in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        derivedRegistry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        derivedRegistry.registerOrOverride(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should be called when removing an entry in derived registry that exists with a different value in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, 2 * entryWithKey.entry);
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        derivedRegistry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        derivedRegistry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils
                            .expect(callbackCalls)
                            .toStrictEqual([{ entryKey: entryWithKey.entryKey, oldEntry: entryWithKey.entry, newEntry: 2 * entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when removing an entry in derived registry that exists with the same value in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        derivedRegistry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        derivedRegistry.unregister(entryWithKey.entryKey);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should be called when an entry is overridden in the base registry and does not exist in the derived registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        derivedRegistry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        baseRegistry.registerOrOverride(entryWithKey.entryKey, 2 * entryWithKey.entry);
                        window.playwrightUtils
                            .expect(callbackCalls)
                            .toStrictEqual([{ entryKey: entryWithKey.entryKey, oldEntry: entryWithKey.entry, newEntry: 2 * entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when an entry is overridden in the base registry but it also exists in the derived registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        derivedRegistry.register(entryWithKey.entryKey, 3 * entryWithKey.entry);
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        derivedRegistry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        baseRegistry.registerOrOverride(entryWithKey.entryKey, 2 * entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should be called when adding an entry in derived registry that exists with a different value in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, 2 * entryWithKey.entry);
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        derivedRegistry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils
                            .expect(callbackCalls)
                            .toStrictEqual([{ entryKey: entryWithKey.entryKey, oldEntry: 2 * entryWithKey.entry, newEntry: entryWithKey.entry }]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });

                test("callbacks should not be called when adding an entry in derived registry that exists with the same value in the base registry", async ({ page }) => {
                    const isOk = await page.evaluate(() => {
                        const baseRegistry = new window.jsUtils.common.collections.Registry<string, number>();
                        const entryWithKey = { entryKey: "testKey", entry: 142 };
                        baseRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        const derivedRegistry = new window.jsUtils.common.collections.Registry<string, number>(undefined, baseRegistry);
                        const callbackCalls: Array<{ entryKey: string; oldEntry: number | undefined; newEntry: number }> = [];
                        derivedRegistry.entryOverriddenCallbacks.add((entryKey, oldEntry, newEntry) => {
                            callbackCalls.push({ entryKey, oldEntry, newEntry });
                        });
                        derivedRegistry.register(entryWithKey.entryKey, entryWithKey.entry);
                        window.playwrightUtils.expect(callbackCalls).toStrictEqual([]);
                        return true;
                    });
                    expect(isOk).toBe(true);
                });
            });
        });
    });
});
