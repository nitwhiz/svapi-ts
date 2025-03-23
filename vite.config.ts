import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';
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
} from './src/base/TypeNames';

export default defineConfig({
  define: {
    __TYPE_CATEGORY: JSON.stringify(TypeCategory),
    __TYPE_CATEGORY_NAME: JSON.stringify(TypeCategoryName),
    __TYPE_GIFT_TASTE: JSON.stringify(TypeGiftTaste),
    __TYPE_ITEM: JSON.stringify(TypeItem),
    __TYPE_ITEM_NAME: JSON.stringify(TypeItemName),
    __TYPE_LANGUAGE: JSON.stringify(TypeLanguage),
    __TYPE_NPC: JSON.stringify(TypeNpc),
    __TYPE_NPC_NAME: JSON.stringify(TypeNpcName),
    __TYPE_RECIPE: JSON.stringify(TypeRecipe),
    __TYPE_RECIPE_INGREDIENT: JSON.stringify(TypeRecipeIngredient),
    __TYPE_RECIPE_INGREDIENT_GROUP: JSON.stringify(TypeRecipeIngredientGroup),
  },
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      fileName: 'svapi',
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: resolve(__dirname, 'tsconfig.json'),
    }),
  ],
});
