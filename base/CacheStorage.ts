export interface CacheStorage {
  getItem(key: string): string | null;

  removeItem(key: string): void;

  setItem(key: string, value: string): void;
}
