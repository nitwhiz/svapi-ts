import { Options, SvapiClient } from '../src/client/SvapiClient';
import { CacheStorage } from '../src/cache/CacheStorage';

export class MockCache implements CacheStorage {
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

export const svapiClient = (responses: object | object[], options: Options) => {
  let currentResponseIndex = 0;

  return new SvapiClient(
    'https://localhost/',
    (uri: string) => {
      console.debug(uri);

      let jsonObject;

      if (Array.isArray(responses)) {
        if (currentResponseIndex >= responses.length) {
          throw new Error('no more responses');
        }

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
    options,
  );
};
