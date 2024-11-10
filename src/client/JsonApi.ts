type Meta = Record<string, any>;

type Link =
  | {
      href: string;
      meta?: Meta;
    }
  | string;

interface Links {
  related?: Link;
  self?: Link;
  [key: string]: Link | undefined;
}

interface RelationshipData {
  type: string;
  id: string;
}

interface Relationship {
  links?: Links;
  data?: RelationshipData[] | RelationshipData;
  meta?: Meta;
}

export interface Data {
  type: string;
  id: string;
  attributes: Record<string, any>;
  relationships?: Record<string, Relationship>;
  links?: Links;
  meta?: Meta;
}

export interface Document {
  links?: Links;
  data: Data[] | Data;
  meta?: Meta;
}
