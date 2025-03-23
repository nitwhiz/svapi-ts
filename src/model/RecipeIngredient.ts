import { Attribute, Id, One, ToOne } from '../client/JsonApiModel';
import { Recipe } from './Recipe';
import { RecipeIngredientGroup } from './RecipeIngredientGroup';

export class RecipeIngredient {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly quantity?: number;

  @ToOne(__TYPE_RECIPE)
  public readonly recipe?: One<Recipe>;

  @ToOne(__TYPE_RECIPE_INGREDIENT_GROUP)
  public readonly ingredientGroup?: One<RecipeIngredientGroup>;
}
