export abstract class Publisher<T> {
  protected abstract create(instance: T): Promise<boolean>

  protected abstract update(instance: T, version: number): Promise<boolean>
}
