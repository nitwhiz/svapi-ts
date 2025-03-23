import { Attribute, Id, Many, ToMany } from '../client/JsonApiModel';
import { CategoryName } from './CategoryName';
import { ItemName } from './ItemName';
import { NpcName } from './NpcName';

export class Language {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly code?: string;

  @ToMany(__TYPE_CATEGORY_NAME)
  public readonly categoryNames?: Many<CategoryName>;

  @ToMany(__TYPE_ITEM_NAME)
  public readonly itemNames?: Many<ItemName>;

  @ToMany(__TYPE_NPC_NAME)
  public readonly npcNames?: Many<NpcName>;
}
