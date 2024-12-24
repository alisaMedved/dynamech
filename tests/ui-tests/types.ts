import { BrowserContextOptions } from '@playwright/test';
type StorageStateWithoutUndefined = Exclude<BrowserContextOptions['storageState'], undefined>;
export type StorageState = Exclude<StorageStateWithoutUndefined, string>;
