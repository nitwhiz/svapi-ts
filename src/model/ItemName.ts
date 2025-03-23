import { Attribute, Id, One, ToOne } from '../client/JsonApiModel';
import { Item } from './Item';
import { Language } from './Language';

export class ItemName {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly name?: string;

  @ToOne(__TYPE_ITEM)
  public readonly item?: One<Item>;

  @ToOne(__TYPE_LANGUAGE)
  public readonly language?: One<Language>;
}
