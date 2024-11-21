import { Session } from "../model/session.entity";
import { User } from "../model/user.entity";

export interface Sessions{
    getAll(): Promise<Array<Session>>
    getByUser(user: User): Promise<Array<Session>>
}