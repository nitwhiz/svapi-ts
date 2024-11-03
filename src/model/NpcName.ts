import { Attribute, Id, One, ToOne } from '../jsonapi/JsonApiModel';
import { TypeLanguage, TypeNpc } from '../base/Types';
import { Language } from './Language';
import { Npc } from './Npc';

export class NpcName {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly name?: string;

  @ToOne(TypeNpc)
  public readonly npc?: One<Npc>;

  @ToOne(TypeLanguage)
  public readonly language?: One<Language>;
}
