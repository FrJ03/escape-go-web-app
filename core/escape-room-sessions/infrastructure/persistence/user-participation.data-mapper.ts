import { ParticipationDataMapper } from "../../../escape-rooms/infrastructure/persistence/participation.data-mapper"
import UserDataMapper from "../../../users/infrastructure/persistence/user.data-mapper"
import { UserParticipation } from "../../domain/model/user-participation.entity"
import { UserParticipationType } from "./user-participation.type"

const UserParticipationDataMapper = {
    toModel: (user_participation: UserParticipationType): UserParticipation => {
        return new UserParticipation(
            UserDataMapper.toModel(user_participation.user),
            ParticipationDataMapper.toModel(user_participation.participation)
        )
    },
    toType: (user_participation: UserParticipation): UserParticipationType => ({
        user: UserDataMapper.toType(user_participation.user),
        participation: ParticipationDataMapper.toType(user_participation.participation)
    } as UserParticipationType)
}

export {UserParticipationDataMapper}