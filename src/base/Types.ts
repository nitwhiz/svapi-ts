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

export const registerTypes = () => {
  SvapiClient.registerModel(TypeCategory, Category);
  SvapiClient.registerModel(TypeCategoryName, CategoryName);
  SvapiClient.registerModel(TypeGiftTaste, GiftTaste);
  SvapiClient.registerModel(TypeItem, Item);
  SvapiClient.registerModel(TypeItemName, ItemName);
  SvapiClient.registerModel(TypeLanguage, Language);
  SvapiClient.registerModel(TypeNpc, Npc);
  SvapiClient.registerModel(TypeNpcName, NpcName);
  SvapiClient.registerModel(TypeNpcName, NpcName);
  SvapiClient.registerModel(TypeRecipe, Recipe);
  SvapiClient.registerModel(TypeRecipeIngredient, RecipeIngredient);
  SvapiClient.registerModel(TypeRecipeIngredientGroup, RecipeIngredientGroup);
};
