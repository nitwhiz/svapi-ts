import { Category } from './Category';
import { Attribute, Id, One, ToOne } from '../client/JsonApiModel';
import { TypeCategory, TypeLanguage } from '../base/Types';
import { Language } from './Language';

export class CategoryName {
  @Id()
  public readonly id?: string;

  @Attribute()
  public readonly name?: string;

  @ToOne(TypeCategory)
  public readonly category?: One<Category>;

  @ToOne(TypeLanguage)
  public readonly language?: One<Language>;
}
