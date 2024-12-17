export abstract class Publisher<T> {
  protected abstract create(instance: T): Promise<boolean>

  protected abstract update(instance: T): Promise<boolean>
}
