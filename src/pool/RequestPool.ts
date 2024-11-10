interface PoolItem<R> {
  id: number;
  promise: Promise<R>;
}

export class RequestPool {
  private currentId: number = 0;

  private readonly pool: Record<string, PoolItem<unknown>> = {};

  constructor(private maxSize: number = 5) {}

  private get nextId() {
    return ++this.currentId;
  }

  private get size(): number {
    return Object.keys(this.pool).length;
  }

  private static wrap<R>(
    id: number,
    promiseFactory: () => Promise<R>,
  ): PoolItem<R> {
    return {
      promise: promiseFactory(),
      id,
    };
  }

  public async put<R>(promiseFactory: () => Promise<R>): Promise<R> {
    while (this.size >= this.maxSize) {
      const { id } = await Promise.race(Object.values(this.pool));
      delete this.pool[id];
    }

    const poolItem = RequestPool.wrap(this.nextId, promiseFactory);

    this.pool[poolItem.id] = poolItem;

    return await poolItem.promise;
  }
}
