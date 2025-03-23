import { Attribute, Id, Many, ToMany } from '../client/JsonApiModel';
import { RecipeIngredient } from './RecipeIngredient';
import { Item } from './Item';

export class Recipe {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly name?: string;

  @Attribute()
  public readonly flags?: string[];

  @Attribute()
  public readonly outputYield?: number;

  @ToMany(__TYPE_RECIPE_INGREDIENT)
  public readonly ingredients?: Many<RecipeIngredient>;

  @ToMany(__TYPE_ITEM)
  public readonly outputItems?: Many<Item>;
}
