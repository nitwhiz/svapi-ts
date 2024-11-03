import { SvapiClient } from '../jsonapi/JsonApiClient';
import { Category } from '../model/Category';
import { CategoryName } from '../model/CategoryName';
import { GiftTaste } from '../model/GiftTaste';
import { Item } from '../model/Item';
import { ItemName } from '../model/ItemName';
import { Language } from '../model/Language';
import { Npc } from '../model/Npc';
import { NpcName } from '../model/NpcName';
import { Recipe } from '../model/Recipe';
import { RecipeIngredient } from '../model/RecipeIngredient';
import { RecipeIngredientGroup } from '../model/RecipeIngredientGroup';

export const TypeCategory = 'categories';
export const TypeCategoryName = 'categoryNames';
export const TypeGiftTaste = 'giftTastes';
export const TypeItem = 'items';
export const TypeItemName = 'itemNames';
export const TypeLanguage = 'languages';
export const TypeNpc = 'npcs';
export const TypeNpcName = 'npcNames';
export const TypeRecipe = 'recipes';
export const TypeRecipeIngredient = 'recipeIngredients';
export const TypeRecipeIngredientGroup = 'recipeIngredientGroups';

const Types = {
  [TypeCategory]: Category,
  [TypeCategoryName]: CategoryName,
  [TypeGiftTaste]: GiftTaste,
  [TypeItem]: Item,
  [TypeItemName]: ItemName,
  [TypeLanguage]: Language,
  [TypeNpc]: Npc,
  [TypeNpcName]: NpcName,
  [TypeRecipe]: Recipe,
  [TypeRecipeIngredient]: RecipeIngredient,
  [TypeRecipeIngredientGroup]: RecipeIngredientGroup,
} as const;

export type Type = keyof typeof Types;
export type ModelType<T extends Type> =
  (typeof Types)[T] extends new () => infer U ? U : never;

export const registerTypes = () => {
  for (const e of Object.entries(Types)) {
    SvapiClient.registerModel(e[0], e[1]);
  }
};
