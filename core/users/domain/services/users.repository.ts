import { User } from "../model/user.entity"

export interface Users{
    save(user: User): Promise<boolean>
    findUser(email: string): Promise<User | undefined>
}