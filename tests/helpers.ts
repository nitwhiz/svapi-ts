import { SvapiClient } from '../src/jsonapi/JsonApiClient';

class MockCache implements Storage {
  private values: Record<string, string> = {};

  public get length() {
    return Object.keys(this.values).length;
  }

  clear(): void {
    this.values = {};
  }

  getItem(key: string): string | null {
    return this.values[key] || null;
  }

  key(_: number): string | null {
    return null;
  }

  removeItem(key: string): void {
    delete this.values[key];
  }

  setItem(key: string, value: string): void {
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
