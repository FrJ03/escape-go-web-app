import { EscapeRoom } from "./escapeRoom.entity";

export class Clue{
    constructor(
        private readonly _id: number,
        private readonly _title: string,
        private readonly _info: string
    ){}

    get id(): number{
        return this._id
    }
    get title(): string{
        return this._title
    }
    get info(): string{
        return this._info
    }
}