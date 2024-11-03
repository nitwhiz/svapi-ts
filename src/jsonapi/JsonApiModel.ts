import { SvapiClient } from './JsonApiClient';

export const enum RelationshipType {
  TO_ONE,
  TO_MANY,
}

export type Model = object;

export interface ModelConstructor {
  new (): Model;
}

export const Id = () => Attribute('id');

export const Attribute = (attrName?: string) => {
  return (target: object, propertyKey: string) =>
    SvapiClient.registerAttributeProperty(
      target.constructor.name,
      propertyKey,
      attrName || propertyKey,
    );
};

export const Relationship = (
  type: string,
  relationship: RelationshipType,
  relName?: string,
) => {
  return (target: object, propertyKey: string) =>
    SvapiClient.registerRelationshipProperty(
      target.constructor.name,
      propertyKey,
      type,
      relName || propertyKey,
      relationship,
    );
};

export const ToOne = (type: string, relName?: string) =>
  Relationship(type, RelationshipType.TO_ONE, relName);

export const ToMany = (type: string, relName?: string) =>
  Relationship(type, RelationshipType.TO_MANY, relName);

export type One<M> = Promise<M>;

export type Many<M> = Promise<M[]>;

export const Meta = (name?: string, source: 'meta' | 'links' = 'meta') => {
  return (target: object, propertyKey: string) =>
    SvapiClient.registerMetaProperty(
      target.constructor.name,
      propertyKey,
      name || propertyKey,
      source,
    );
};

export const Link = (name?: string) => Meta(name, 'links');
