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
import { SvapiClient } from '../client/SvapiClient';
import {
  TypeCategory,
  TypeCategoryName,
  TypeGiftTaste,
  TypeItem,
  TypeItemName,
  TypeLanguage,
  TypeNpc,
  TypeNpcName,
  TypeRecipe,
  TypeRecipeIngredient,
  TypeRecipeIngredientGroup,
} from './TypeNames';

const TypeClassByName = {
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

export type TypeIdentifier = keyof typeof TypeClassByName;

export type ModelType<T extends TypeIdentifier> =
  (typeof TypeClassByName)[T] extends new () => infer U ? U : never;

export const registerTypes = () => {
  for (const e of Object.entries(TypeClassByName)) {
    SvapiClient.registerModel(e[0], e[1]);
  }
};
