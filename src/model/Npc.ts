import { Attribute, Id, Many, ToMany } from '../client/JsonApiModel';
import { NpcName } from './NpcName';
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

  @ToMany(__TYPE_NPC_NAME)
  public readonly names?: Many<NpcName>;

  @ToMany(__TYPE_GIFT_TASTE)
  public readonly giftTastes?: Many<GiftTaste>;
}
