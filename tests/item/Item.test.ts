import { expect, test } from 'vitest';
import fixtureSingleItem from '../fixtures/single-item.json';
import fixtureSingleItemCategory from '../fixtures/single-item-category.json';
import fixtureSingleItemGiftTastes from '../fixtures/single-item-giftTastes.json';
import fixtureSingleItemIngredientGroups from '../fixtures/single-item-ingredientGroups.json';
import fixtureSingleItemNames from '../fixtures/single-item-names.json';
import fixtureSingleItemSourceRecipes from '../fixtures/single-item-sourceRecipes.json';
import { Item } from '../../src/model/Item';
import { svapiClient } from '../helpers';
import { Category } from '../../src/model/Category';
import { GiftTaste } from '../../src/model/GiftTaste';
import { ItemName } from '../../src/model/ItemName';

test('Fetch And Parse Item', async () => {
  const svapi = svapiClient(fixtureSingleItem);

  const item = await svapi.fetchModels<Item>('');

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
});

test('Fetch Item Relationships', async () => {
  const svapi = svapiClient([
    fixtureSingleItem,
    fixtureSingleItemNames,
    fixtureSingleItemCategory,
    fixtureSingleItemGiftTastes,
    fixtureSingleItemIngredientGroups,
    fixtureSingleItemSourceRecipes,
  ]);

  const item = await svapi.fetchModels<Item>('');

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
