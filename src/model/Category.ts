import { Attribute, Id, Many, ToMany } from '../client/JsonApiModel';
import { CategoryName } from './CategoryName';
import { Item } from './Item';

export class Category {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly internalId?: string;

  @ToMany(__TYPE_CATEGORY_NAME)
  public readonly names?: Many<CategoryName>;

  @ToMany(__TYPE_ITEM)
  public readonly items?: Many<Item>;
}
