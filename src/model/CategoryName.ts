import { Category } from './Category';
import { Attribute, Id, One, ToOne } from '../client/JsonApiModel';
import { Language } from './Language';

export class CategoryName {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly name?: string;

  @ToOne(__TYPE_CATEGORY)
  public readonly category?: One<Category>;

  @ToOne(__TYPE_LANGUAGE)
  public readonly language?: One<Language>;
}
