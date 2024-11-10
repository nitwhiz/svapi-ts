import { Attribute, Id, One, ToOne } from '../client/JsonApiModel';
import { Npc } from './Npc';
import { TypeItem, TypeNpc } from '../base/Types';
import { Item } from './Item';

export class GiftTaste {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly taste?: string;

  @ToOne(TypeNpc)
  public readonly npc?: One<Npc>;

  @ToOne(TypeItem)
  public readonly item?: One<Item>;
}
