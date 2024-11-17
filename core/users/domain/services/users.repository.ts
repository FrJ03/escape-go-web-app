import { User } from "../model/user.entity"
import { Email } from "../model/value-objects/email"

export interface Users{
    save(user: User): Promise<boolean>
    findUserByEmail(email: Email): Promise<User | undefined>
}