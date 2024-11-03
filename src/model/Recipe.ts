import { Attribute, Id, Many, ToMany } from '../jsonapi/JsonApiModel';
import { RecipeIngredient } from './RecipeIngredient';
import { Item } from './Item';
import { TypeItem, TypeRecipeIngredient } from '../base/Types';

export class Recipe {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly name?: string;

  @Attribute()
  public readonly flags?: string[];

  @Attribute()
  public readonly outputYield?: number;

  @ToMany(TypeRecipeIngredient)
  public readonly ingredients?: Many<RecipeIngredient>;

  @ToMany(TypeItem)
  public readonly outputItems?: Many<Item>;
}
