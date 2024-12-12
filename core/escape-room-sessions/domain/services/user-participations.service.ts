import { UserParticipation } from "../model/user-participation.entity";

export interface UserParticipations{
    save(user_participation: UserParticipation): Promise<Boolean>
}