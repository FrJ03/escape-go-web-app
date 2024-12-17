import { UserParticipation } from "../model/user-participation.entity";

export interface UserParticipations{
    save(user_participation: UserParticipation): Promise<Boolean>
    getAllByParticipation(participation_id: number, escape_room_id: number): Promise<Array<UserParticipation>>
}