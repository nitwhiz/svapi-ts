import { Id, Many, ToMany } from '../client/JsonApiModel';
import { Item } from './Item';
import { RecipeIngredient } from './RecipeIngredient';

export class RecipeIngredientGroup {
  @Id()
  public readonly id?: string;

  @ToMany(__TYPE_ITEM)
  public readonly items?: Many<Item>;

  @ToMany(__TYPE_RECIPE_INGREDIENT)
  public readonly ingredients?: Many<RecipeIngredient>;
}
