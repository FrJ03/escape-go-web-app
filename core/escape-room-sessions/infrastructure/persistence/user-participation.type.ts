import { ParticipationType } from "../../../escape-rooms/infrastructure/persistence/participation.type"
import { UserType } from "../../../users/infrastructure/persistence/user.type"

export type UserParticipationType = {
    user: UserType,
    participation: ParticipationType
}