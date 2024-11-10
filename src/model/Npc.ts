import { Attribute, Id, Many, ToMany } from '../client/JsonApiModel';
import { NpcName } from './NpcName';
import { TypeGiftTaste, TypeNpcName } from '../base/Types';
import { GiftTaste } from './GiftTaste';

export class Npc {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly internalId?: string;

  @Attribute()
  public readonly birthdaySeason?: string;

  @Attribute()
  public readonly birthdayDay?: number;

  @ToMany(TypeNpcName)
  public readonly names?: Many<NpcName>;

  @ToMany(TypeGiftTaste)
  public readonly giftTastes?: Many<GiftTaste>;
}
