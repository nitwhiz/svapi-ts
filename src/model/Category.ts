import { Attribute, Id, Many, ToMany } from '../jsonapi/JsonApiModel';
import { TypeCategoryName, TypeItem } from '../base/Types';
import { CategoryName } from './CategoryName';
import { Item } from './Item';

export class Category {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly internalId?: string;

  @ToMany(TypeCategoryName)
  public readonly names?: Many<CategoryName>;

  @ToMany(TypeItem)
  public readonly items?: Many<Item>;
}
