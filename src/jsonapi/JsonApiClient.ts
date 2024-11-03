import { Model, ModelConstructor, RelationshipType } from './JsonApiModel';
import { Data, Document } from './JsonApi';
import { CacheStorage } from '../base/CacheStorage';
import { ModelType, Type } from '../base/Types';

interface ConstructorsByType {
  [t: string]: ModelConstructor;
}

interface RelationshipProperties {
  [c: string]: {
    [p: string]: {
      type: string;
      name: string;
      relationship: RelationshipType;
    };
  };
}

interface PropertyMap {
  [c: string]: {
    [p: string]: string;
  };
}

interface MetaProperties {
  [c: string]: {
    [p: string]: {
      name: string;
      source: 'meta' | 'links';
    };
  };
}

type RequestFn = (uri: string) => Promise<{
  status: number;
  json(): Promise<any>;
}>;

const API_VERSION = 'v2';
const CACHE_PREFIX = `svapi.${API_VERSION}.cache.`;

export class SvapiClient {
  private static readonly modelConstructorByType: ConstructorsByType = {};

  private static readonly relationshipProperties: RelationshipProperties = {};

  private static readonly attributeProperties: PropertyMap = {};

  private static readonly metaProperties: MetaProperties = {};

  public static registerModel(type: string, model: ModelConstructor): void {
    SvapiClient.modelConstructorByType[type] = model;
  }

  public static registerAttributeProperty(
    className: string,
    propertyKey: string,
    attrName: string,
  ): void {
    if (!SvapiClient.attributeProperties[className]) {
      SvapiClient.attributeProperties[className] = {};
    }

    SvapiClient.attributeProperties[className][propertyKey] = attrName;
  }

  public static registerRelationshipProperty(
    className: string,
    propertyKey: string,
    type: string,
    relName: string,
    relationship: RelationshipType,
  ): void {
    if (!SvapiClient.relationshipProperties[className]) {
      SvapiClient.relationshipProperties[className] = {};
    }

    SvapiClient.relationshipProperties[className][propertyKey] = {
      type,
      name: relName,
      relationship,
    };
  }

  public static registerMetaProperty(
    className: string,
    propertyKey: string,
    name: string,
    source: 'meta' | 'links' = 'meta',
  ) {
    if (!SvapiClient.metaProperties[className]) {
      SvapiClient.metaProperties[className] = {};
    }

    SvapiClient.metaProperties[className][propertyKey] = {
      source,
      name,
    };
  }

  private readonly baseUri: string;

  constructor(
    baseUri: string,
    private readonly requestFn: RequestFn,
    private readonly cache: CacheStorage | null = null,
  ) {
    this.baseUri = baseUri.replace(/\/+$/, '');
  }

  public getById<T extends Type = Type, R = ModelType<T>>(
    type: T,
    id: string,
  ): Promise<R | null> {
    return this.fetchModels<R>(`/${API_VERSION}/${type}/${id}`);
  }

  public getAll<T extends Type = Type, R = ModelType<T>[]>(
    type: T,
  ): Promise<R | null> {
    return this.fetchModels<R>(`/${API_VERSION}/${type}`);
  }

  public async fetchModels<R>(path: string): Promise<R | null> {
    const uri = `${this.baseUri}${path}`;
    const cacheKey = `${CACHE_PREFIX}${uri}`;

    const cachedItem = this.cache?.getItem(cacheKey);

    let doc;

    if (cachedItem) {
      doc = JSON.parse(cachedItem);
    } else {
      const res = await this.requestFn(uri);

      if (res.status !== 200) {
        return null;
      }

      doc = await res.json();

      this.cache?.setItem(cacheKey, JSON.stringify(doc));
    }

    return this.createFromDocument<R>(doc);
  }

  private augmentAttributes(model: Model, data: Data): void {
    for (const [prop, attr] of Object.entries(
      SvapiClient.attributeProperties[model.constructor.name] || {},
    )) {
      Object.defineProperty(model, prop, {
        value:
          attr === 'id' ? data['id'] || null : data.attributes[attr] || null,
        writable: false,
      });
    }
  }

  private augmentRelationships(model: Model, data: Data): void {
    for (const [prop, rel] of Object.entries(
      SvapiClient.relationshipProperties[model.constructor.name] || {},
    )) {
      Object.defineProperty(model, prop, {
        get: (): Model[] | Model | null => {
          return new Promise((resolve) => {
            const relatedPath = data.relationships?.[rel.name].links?.related;

            if (relatedPath) {
              resolve(
                this.fetchModels(
                  typeof relatedPath === 'string'
                    ? relatedPath
                    : relatedPath.href,
                ),
              );
            } else {
              resolve(rel.relationship === RelationshipType.TO_ONE ? null : []);
            }
          });
        },
      });
    }
  }

  private augmentMeta(model: Model, data: Data): void {
    for (const [prop, meta] of Object.entries(
      SvapiClient.metaProperties[model.constructor.name] || {},
    )) {
      let value;

      if (meta.source === 'meta') {
        value = data.meta?.[meta.name] || null;
      } else {
        const link = data.links?.[meta.name];

        if (!link || typeof link === 'string') {
          value = link === undefined ? null : link;
        } else {
          value = link?.href || null;
        }
      }

      Object.defineProperty(model, prop, {
        value,
        writable: false,
      });
    }
  }

  private createModelFromData(data: Data): Model | null {
    const Ctor = SvapiClient.modelConstructorByType[data.type];

    if (!Ctor) {
      return null;
    }

    const model = new Ctor();

    this.augmentAttributes(model, data);
    this.augmentRelationships(model, data);
    this.augmentMeta(model, data);

    return model;
  }

  private createFromDocument<R>(doc: Document): R | null {
    if (Array.isArray(doc.data)) {
      return doc.data
        .map((d) => this.createModelFromData(d))
        .filter((m) => Boolean(m)) as R;
    }

    return this.createModelFromData(doc.data) as R;
  }
}
