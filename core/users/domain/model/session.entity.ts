import { User } from "./user.entity"

export class Session{
    constructor(private readonly _id: number, private readonly _date: Date, private readonly _user: User){

    }

    get id(): number{
        return this._id
    }
    get date(): Date{
        return this._date
    }
    get user(): User{
        return this._user
    }
}