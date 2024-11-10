import { Attribute, Id, Many, ToMany } from '../client/JsonApiModel';
import { CategoryName } from './CategoryName';
import { TypeCategoryName, TypeItemName, TypeNpcName } from '../base/Types';
import { ItemName } from './ItemName';
import { NpcName } from './NpcName';

export class Language {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly code?: string;

  @ToMany(TypeCategoryName)
  public readonly categoryNames?: Many<CategoryName>;

  @ToMany(TypeItemName)
  public readonly itemNames?: Many<ItemName>;

  @ToMany(TypeNpcName)
  public readonly npcNames?: Many<NpcName>;
}
