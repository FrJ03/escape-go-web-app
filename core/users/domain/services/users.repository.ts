import { User } from "../model/user.entity"
import { Email } from "../model/value-objects/email"

export interface Users{
    save(user: User): Promise<boolean>
    findUserByEmail(email: Email): Promise<User | undefined>
    findUserByUsername(username: string): Promise<User | undefined>
    delete(user_id: number): Promise<boolean>
    getAll(): Promise<Array<User>>
}