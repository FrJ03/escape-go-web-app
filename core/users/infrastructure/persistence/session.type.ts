import { UserType } from "./user.type"

export type SessionType = {
    id: number,
    date: Date,
    user: UserType
}