import { Attribute, Id, One, ToOne } from '../jsonapi/JsonApiModel';
import { TypeItem, TypeLanguage } from '../base/Types';
import { Item } from './Item';
import { Language } from './Language';

export class ItemName {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly name?: string;

  @ToOne(TypeItem)
  public readonly item?: One<Item>;

  @ToOne(TypeLanguage)
  public readonly language?: One<Language>;
}
