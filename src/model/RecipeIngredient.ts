import { Attribute, Id, One, ToOne } from '../client/JsonApiModel';
import { Recipe } from './Recipe';
import { RecipeIngredientGroup } from './RecipeIngredientGroup';
import { TypeRecipe, TypeRecipeIngredientGroup } from '../base/Types';

export class RecipeIngredient {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly quantity?: number;

  @ToOne(TypeRecipe)
  public readonly recipe?: One<Recipe>;

  @ToOne(TypeRecipeIngredientGroup)
  public readonly ingredientGroup?: One<RecipeIngredientGroup>;
}
