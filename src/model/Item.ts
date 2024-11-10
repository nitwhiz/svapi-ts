import {
  Attribute,
  Id,
  Link,
  Many,
  One,
  ToMany,
  ToOne,
} from '../client/JsonApiModel';
import { ItemName } from './ItemName';
import {
  TypeCategory,
  TypeGiftTaste,
  TypeItemName,
  TypeRecipe,
  TypeRecipeIngredientGroup,
} from '../base/Types';
import { Category } from './Category';
import { GiftTaste } from './GiftTaste';
import { RecipeIngredientGroup } from './RecipeIngredientGroup';
import { Recipe } from './Recipe';

export class Item {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly internalId?: string;

  @Attribute()
  public readonly type?: string;

  @Attribute()
  public readonly flags?: string[];

  @ToMany(TypeItemName)
  public readonly names?: Many<ItemName>;

  @ToOne(TypeCategory)
  public readonly category?: One<Category>;

  @ToMany(TypeGiftTaste)
  public readonly giftTastes?: Many<GiftTaste>;

  @ToMany(TypeRecipeIngredientGroup)
  public readonly ingredientGroups?: Many<RecipeIngredientGroup>;

  @ToMany(TypeRecipe)
  public readonly sourceRecipes?: Many<Recipe>;

  @Link('texture')
  public readonly textureUrl?: string;
}
