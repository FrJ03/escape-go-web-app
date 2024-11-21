import { Session } from "../model/session.entity";

export interface Sessions{
    getAll(): Promise<Array<Session>>
}