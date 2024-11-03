import { SvapiClient } from '../src/jsonapi/JsonApiClient';
import { CacheStorage } from '../src/base/CacheStorage';

class MockCache implements CacheStorage {
  private values: Record<string, string> = {};

  public getItem(key: string): string | null {
    return this.values[key] || null;
  }

  public removeItem(key: string): void {
    delete this.values[key];
  }

  public setItem(key: string, value: string): void {
    this.values[key] = value;
  }
}

export const svapiClient = (responses: object | object[]) => {
  let currentResponseIndex = 0;

  return new SvapiClient(
    'https://localhost/',
    () => {
      let jsonObject;

      if (Array.isArray(responses)) {
        jsonObject = responses[currentResponseIndex];
      } else {
        jsonObject = responses;
      }

      currentResponseIndex++;

      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(jsonObject),
      });
    },
    new MockCache(),
  );
};
