import { Participation } from "../../../escape-rooms/domain/model/participation.entity";
import { User } from "../../../users/domain/model/user.entity";

export class UserParticipation{
    constructor(
        private readonly _user: User,
        private readonly _participation: Participation
    ){}

    get user(): User{
        return this._user
    }

    get participation(): Participation{
        return this._participation
    }
}