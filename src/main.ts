import { registerTypes } from './base/Types';

registerTypes();

export type {
  TypeIdentifier,
  ModelType,
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
} from './base/Types';

export { SvapiClient } from './client/SvapiClient';

export * from './model/Category';
export * from './model/CategoryName';
export * from './model/GiftTaste';
export * from './model/Item';
export * from './model/ItemName';
export * from './model/Language';
export * from './model/Npc';
export * from './model/NpcName';
export * from './model/Recipe';
export * from './model/RecipeIngredient';
export * from './model/RecipeIngredientGroup';
