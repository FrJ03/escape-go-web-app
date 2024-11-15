export abstract class Publisher<T> {
  protected abstract create(instance: T): Promise<void>

  protected abstract update(instance: T, version: number): Promise<void>
}
