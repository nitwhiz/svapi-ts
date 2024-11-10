import { describe, expect, test } from 'vitest';
import fixtureSingleItem from '../fixtures/single-item.json';
import fixtureSingleItemCategory from '../fixtures/single-item-category.json';
import fixtureSingleItemGiftTastes from '../fixtures/single-item-giftTastes.json';
import fixtureSingleItemIngredientGroups from '../fixtures/single-item-ingredientGroups.json';
import fixtureSingleItemNames from '../fixtures/single-item-names.json';
import fixtureSingleItemSourceRecipes from '../fixtures/single-item-sourceRecipes.json';
import { MockCache, svapiClient } from '../helpers';
import { Category } from '../../src/model/Category';
import { GiftTaste } from '../../src/model/GiftTaste';
import { ItemName } from '../../src/model/ItemName';
import { TypeItem } from '../../src/base/Types';

const getClientsWithPreserveRelValues = (responses: object | object[]) => [
  {
    config: 'No Cache, No Pooling',
    svapi: svapiClient(responses, {
      cache: null,
      pooling: 0,
      preserveRelationshipValues: true,
    }),
  },
  {
    config: 'Cache, No Pooling',
    svapi: svapiClient(responses, {
      cache: new MockCache(),
      pooling: 0,
      preserveRelationshipValues: true,
    }),
  },
  {
    config: 'No Cache, Pooling',
    svapi: svapiClient(responses, {
      cache: null,
      pooling: 3,
      preserveRelationshipValues: true,
    }),
  },
  {
    config: 'Cache, Pooling',
    svapi: svapiClient(responses, {
      cache: new MockCache(),
      pooling: 3,
      preserveRelationshipValues: true,
    }),
  },
];

const getClientsWithoutPreserveRelValuesAndWithoutCache = (
  responses: object | object[],
) => [
  {
    config: 'No Pooling',
    svapi: svapiClient(responses, {
      cache: null,
      pooling: 0,
      preserveRelationshipValues: false,
    }),
  },
  {
    config: 'Pooling',
    svapi: svapiClient(responses, {
      cache: null,
      pooling: 3,
      preserveRelationshipValues: false,
    }),
  },
];

const getClientsWithoutPreserveRelValuesAndWithCache = (
  responses: object | object[],
) => [
  {
    config: 'No Pooling',
    svapi: svapiClient(responses, {
      cache: new MockCache(),
      pooling: 0,
      preserveRelationshipValues: false,
    }),
  },
  {
    config: 'Pooling',
    svapi: svapiClient(responses, {
      cache: new MockCache(),
      pooling: 3,
      preserveRelationshipValues: false,
    }),
  },
];

const relationshipTestClients = [
  {
    name: 'Fetch Item Relationships, Preserve Resolved Values',
    clients: getClientsWithPreserveRelValues([
      fixtureSingleItem,
      fixtureSingleItemNames,
      fixtureSingleItemCategory,
      fixtureSingleItemGiftTastes,
      fixtureSingleItemIngredientGroups,
      fixtureSingleItemSourceRecipes,
    ]),
  },
  {
    name: "Fetch Item Relationships, Don't Preserve Resolved Values, No Cache",
    clients: getClientsWithoutPreserveRelValuesAndWithoutCache([
      fixtureSingleItem,
      fixtureSingleItemNames,
      fixtureSingleItemNames,
      fixtureSingleItemNames,
      fixtureSingleItemCategory,
      fixtureSingleItemGiftTastes,
      fixtureSingleItemGiftTastes,
      fixtureSingleItemGiftTastes,
      fixtureSingleItemIngredientGroups,
      fixtureSingleItemIngredientGroups,
      fixtureSingleItemSourceRecipes,
      fixtureSingleItemSourceRecipes,
    ]),
  },
  {
    name: "Fetch Item Relationships, Don't Preserve Resolved Values, Cache",
    clients: getClientsWithoutPreserveRelValuesAndWithCache([
      fixtureSingleItem,
      fixtureSingleItemNames,
      fixtureSingleItemCategory,
      fixtureSingleItemGiftTastes,
      fixtureSingleItemIngredientGroups,
      fixtureSingleItemSourceRecipes,
    ]),
  },
];

describe('Item Integration', () => {
  describe('Fetch And Parse Item', () => {
    test.concurrent.for(getClientsWithPreserveRelValues(fixtureSingleItem))(
      'Config: $config',
      async ({ svapi }) => {
        const item = await svapi.getById(
          TypeItem,
          '8562d2c0-a721-58a5-ac15-114b384f5062',
        );

        expect(item?.id).toBe('8562d2c0-a721-58a5-ac15-114b384f5062');

        expect(item?.internalId).toBe('(O)591');
        expect(item?.type).toBe('basic');

        const flags = item?.flags;

        expect(flags).toBeInstanceOf(Array);
        expect(flags).toHaveLength(1);
        expect(flags?.[0]).toBe('giftable');

        expect(item?.names).toBeInstanceOf(Promise);
        expect(item?.ingredientGroups).toBeInstanceOf(Promise);
        expect(item?.sourceRecipes).toBeInstanceOf(Promise);

        expect(item?.textureUrl).toBe(
          '/v2/textures/items/5/54dfa6e60581afa93ff302671a6cdc6b5818c3d1d14fb1e8a34b4a85e8d36447.png',
        );
      },
    );
  });

  for (const { name, clients } of relationshipTestClients) {
    describe(name, () => {
      test.concurrent.for(clients)('Config: $config', async ({ svapi }) => {
        const item = await svapi.getById(
          TypeItem,
          '8562d2c0-a721-58a5-ac15-114b384f5062',
        );

        expect(await item?.names).toBeInstanceOf(Array);
        expect(await item?.names).toHaveLength(10);
        expect((await item?.names)?.[0]).toBeInstanceOf(ItemName);

        expect(await item?.category).toBeInstanceOf(Category);

        expect(await item?.giftTastes).toBeInstanceOf(Array);
        expect(await item?.giftTastes).toHaveLength(34);
        expect((await item?.giftTastes)?.[0]).toBeInstanceOf(GiftTaste);

        expect(await item?.ingredientGroups).toBeInstanceOf(Array);
        expect(await item?.ingredientGroups).toHaveLength(0);

        expect(await item?.sourceRecipes).toBeInstanceOf(Array);
        expect(await item?.sourceRecipes).toHaveLength(0);
      });
    });
  }
});
