# svapi-ts

A JavaScript API client for [svapi](https://github.com/nitwhiz/svapi).

## Installing

```shell
pnpm add @nitwhiz/svapi-ts
```

## Usage

Initialize your SvapiClient as follows:

```ts
import { SvapiClient } from '@nitwhiz/svapi-ts';

export const svapiClient = new SvapiClient(
  'https://api.stardew-valley.guide/',
  (uri: string) => fetch(uri),
);
```

You can use [api.stardew-valley.guide](https://api.stardew-valley.guide/v2/npcs), it's public and free! :smile:

The following arguments can be passed to `SvapiClient`:

| Argument                             | Type                                                                  | Default Value | Notes                                                                                                                                                                                             |
|--------------------------------------|-----------------------------------------------------------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `baseUri`                            | `string`                                                              |               | Required. The API URI to use, without the version specifier.                                                                                                                                      |
| `requestFn`                          | `(uri: string) => Promise<{ status: number; json(): Promise<any>; }>` |               | Required. A function to run requests, should return a `fetch`-ish result.                                                                                                                         |
| `options`                            | `object`                                                              |               | Optional. See below.                                                                                                                                                                              |
| `options.cache`                      | `CacheStorage`                                                        | `null`        | Should be a `window.sessionStorage` compatible cache for requests.                                                                                                                                |
| `options.preserveRelationshipValues` | `boolean`                                                             | `true`        | Keep resolved relationships' values. if `false`, relationships will be requested each time a relationship is resolved.<br/>Relationships are still queried from cache if this setting is `false`. |

### Requesting Resources

To request resources, use the `getAll` or `getById` methods:

```ts
import { TypeItem } from '@nitwhiz/svapi-ts';

const items = await svapiClient.getAll(TypeItem);
```

Relationships of models are requested as soon as you access them:

```ts
// get the first item
const item = (await svapiClient.getAll(TypeItem))[0];

// get all the item names. the request for that runs now.
const firstItemNames = await item?.names;
```
