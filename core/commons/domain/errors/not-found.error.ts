import { ApplicationError } from './application.error'

export class NotFoundError extends ApplicationError {
  static withId(id: string): NotFoundError {
    return new NotFoundError(`Entity with ${id} not found.`)
  }
}