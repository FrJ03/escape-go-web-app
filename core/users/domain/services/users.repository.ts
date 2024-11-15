import { User } from "../model/user.entity"

export interface Users{
    save(user: User): Promise<void>
}