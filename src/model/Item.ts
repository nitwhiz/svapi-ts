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

  @ToMany(__TYPE_ITEM_NAME)
  public readonly names?: Many<ItemName>;

  @ToOne(__TYPE_CATEGORY)
  public readonly category?: One<Category>;

  @ToMany(__TYPE_GIFT_TASTE)
  public readonly giftTastes?: Many<GiftTaste>;

  @ToMany(__TYPE_RECIPE_INGREDIENT_GROUP)
  public readonly ingredientGroups?: Many<RecipeIngredientGroup>;

  @ToMany(__TYPE_RECIPE)
  public readonly sourceRecipes?: Many<Recipe>;

  @Link('texture')
  public readonly textureUrl?: string;
}
