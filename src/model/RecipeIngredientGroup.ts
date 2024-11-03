import { Id, Many, ToMany } from '../jsonapi/JsonApiModel';
import { Item } from './Item';
import { TypeItem, TypeRecipeIngredient } from '../base/Types';
import { RecipeIngredient } from './RecipeIngredient';

export class RecipeIngredientGroup {
  @Id()
  public readonly id?: string;

  @ToMany(TypeItem)
  public readonly items?: Many<Item>;

  @ToMany(TypeRecipeIngredient)
  public readonly ingredients?: Many<RecipeIngredient>;
}
