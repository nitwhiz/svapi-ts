export class RequestPool {
  private currentId: number = 0;

  private readonly pool: Record<string, Promise<any>> = {};

  constructor(private maxSize: number = 5) {}

  private get nextId() {
    return ++this.currentId;
  }

  private get size(): number {
    return Object.keys(this.pool).length;
  }

  private static async wrap<R>(
    id: number,
    callback: () => Promise<R>,
  ): Promise<{
    id: number;
    result: Awaited<Promise<R>>;
  }> {
    return {
      result: await callback(),
      id,
    };
  }

  public async put<R>(callback: () => Promise<R>): Promise<R> {
    while (this.size >= this.maxSize) {
      const { id } = await Promise.race(Object.values(this.pool));
      delete this.pool[id];
    }

    const nextId = this.nextId;

    return (await (this.pool[nextId] = RequestPool.wrap(nextId, callback)))
      .result;
  }
}
