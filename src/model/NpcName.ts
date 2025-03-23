import { Attribute, Id, One, ToOne } from '../client/JsonApiModel';
import { Language } from './Language';
import { Npc } from './Npc';

export class NpcName {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly name?: string;

  @ToOne(__TYPE_NPC)
  public readonly npc?: One<Npc>;

  @ToOne(__TYPE_LANGUAGE)
  public readonly language?: One<Language>;
}
