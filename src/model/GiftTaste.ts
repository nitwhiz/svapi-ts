import { Attribute, Id, One, ToOne } from '../client/JsonApiModel';
import { Npc } from './Npc';
import { Item } from './Item';

export class GiftTaste {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly taste?: string;

  @ToOne(__TYPE_NPC)
  public readonly npc?: One<Npc>;

  @ToOne(__TYPE_ITEM)
  public readonly item?: One<Item>;
}
