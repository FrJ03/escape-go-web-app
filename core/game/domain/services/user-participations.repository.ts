import { Email } from "../../../users/domain/model/value-objects/email";
import { UserParticipation } from "../model/user-participation.entity";

export interface UserParticipations{
    save(user_participation: UserParticipation): Promise<Boolean>
    getAllByParticipation(participation_id: number, escape_room_id: number): Promise<Array<UserParticipation>>
    getAllByUser(user_email: Email): Promise<Array<UserParticipation>>
    getByUser(user_email: Email, escape_room_id: number, participation_id: number): Promise<UserParticipation| undefined>
    getAll(): Promise<Array<UserParticipation>>
}