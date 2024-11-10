import { Model, ModelConstructor, RelationshipType } from './JsonApiModel';
import { Data, Document } from './JsonApi';
import { CacheStorage } from '../cache/CacheStorage';
import { ModelType, Type } from '../base/Types';
import { RequestPool } from '../pool/RequestPool';

interface ConstructorsByType {
  [typeName: string]: ModelConstructor;
}

interface RelationshipProperties {
  [className: string]: {
    [prop: string]: {
      type: string;
      name: string;
      relationship: RelationshipType;
    };
  };
}

interface PropertyMap {
  [className: string]: {
    [prop: string]: string;
  };
}

interface MetaProperties {
  [className: string]: {
    [prop: string]: {
      name: string;
      source: 'meta' | 'links';
    };
  };
}

export type RequestFn = (uri: string) => Promise<{
  status: number;
  json(): Promise<any>;
}>;

export interface Options {
  /**
   * cache for requests.
   * defaults to `null`.
   */
  cache: CacheStorage | null;
  /**
   * amount of parallel requests performed.
   * can be used to prevent dog-piling in cache and/or on the wire.
   * defaults to `5`.
   */
  pooling: number;
  /**
   * keep resolved relationships' values. if `false`,
   * relationships will be requested each time a relationship is resolved.
   * relationships are still queried from cache if this setting is `false`.
   * default to `true`
   */
  preserveRelationshipValues: boolean;
}

const defaultOptions: Options = {
  cache: null,
  pooling: 5,
  preserveRelationshipValues: true,
};

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

  private readonly options: Options;

  private readonly requestPool: RequestPool | null = null;

  constructor(
    baseUri: string,
    private readonly requestFn: RequestFn,
    options: Partial<Options> = defaultOptions,
  ) {
    this.baseUri = baseUri.replace(/\/+$/, '');
    this.options = { ...defaultOptions, ...options };

    if (this.options.pooling > 0) {
      this.requestPool = new RequestPool(this.options.pooling);
    }
  }

  public getById<T extends Type = Type, R = ModelType<T>>(
    type: T,
    id: string,
  ): Promise<R | null> {
    return this.fetchModels<R>(`/${API_VERSION}/${type}/${id}`);
  }

  public getAll<T extends Type = Type, R = ModelType<T>[]>(
    type: T,
  ): Promise<R> {
    return this.fetchModels<R>(`/${API_VERSION}/${type}`).then(
      (r) => r || ([] as R),
    );
  }

  private async runFetchModels<R>(path: string): Promise<R | null> {
    const uri = `${this.baseUri}${path}`;
    const cacheKey = `${CACHE_PREFIX}${uri}`;

    const cachedItem = this.options.cache?.getItem(cacheKey);

    let doc;

    if (cachedItem) {
      doc = JSON.parse(cachedItem);
    } else {
      const res = await this.requestFn(uri);

      if (res.status >= 400 || res.status < 200) {
        return null;
      }

      doc = await res.json();

      this.options.cache?.setItem(cacheKey, JSON.stringify(doc));
    }

    return this.createFromDocument<R>(doc);
  }

  private fetchModels<R>(path: string): Promise<R | null> {
    return (
      this.requestPool?.put(() => this.runFetchModels(path)) ??
      this.runFetchModels(path)
    );
  }

  private augmentAttributes(model: Model, data: Data): void {
    for (const [prop, attr] of Object.entries(
      SvapiClient.attributeProperties[model.constructor.name] || {},
    )) {
      Object.defineProperty(model, prop, {
        value:
          attr === 'id' ? data['id'] || null : data.attributes[attr] || null,
        writable: false,
        enumerable: true,
      });
    }
  }

  private augmentRelationships(model: Model, data: Data): void {
    for (const [prop, rel] of Object.entries(
      SvapiClient.relationshipProperties[model.constructor.name] || {},
    )) {
      const relValueKey = this.options.preserveRelationshipValues
        ? `__jsonApiResolvedRelationshipValue__${rel.name}`
        : null;

      Object.defineProperty(model, prop, {
        get: async (): Promise<Model[] | Model | null> => {
          if (relValueKey) {
            const modelObj = model as Record<string, any>;

            if (modelObj[relValueKey] !== undefined) {
              return modelObj[relValueKey];
            }
          }

          const relatedPath = data.relationships?.[rel.name].links?.related;

          let result: Model | Model[] | null;

          if (relatedPath) {
            result = await this.fetchModels(
              typeof relatedPath === 'string' ? relatedPath : relatedPath.href,
            );
          } else {
            result = rel.relationship === RelationshipType.TO_ONE ? null : [];
          }

          if (relValueKey) {
            Object.defineProperty(model, relValueKey, {
              value: result,
              writable: false,
              enumerable: false,
            });
          }

          return result;
        },
        enumerable: true,
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
        enumerable: true,
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
