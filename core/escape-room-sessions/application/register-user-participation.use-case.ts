import { Participations } from "../../escape-rooms/domain/services/participation.repository";
import { Email } from "../../users/domain/model/value-objects/email";
import { Users } from "../../users/domain/services/users.repository";
import { UserParticipation } from "../domain/model/user-participation.entity";
import { UserParticipations } from "../domain/services/user-participations.repository";
import { RegisterUserParticipationRequest } from "../dto/requests/register-user-participation.request";
import { RegisterUserParticipationResponse } from "../dto/responses/register-user-participation.response";

export class RegisterUserParticipationUseCase{
    constructor(private readonly users: Users, private readonly participations: Participations, private readonly user_participations: UserParticipations){}

    async with(command: RegisterUserParticipationRequest): Promise<RegisterUserParticipationResponse>{
        const user_email = Email.create(command.user_email)
        if(user_email === undefined){
            return {
                code: 400
            } as RegisterUserParticipationResponse
        }

        const user = await this.users.findUserByEmail(user_email)
        if(user === undefined){
            return {
                code: 404
            } as RegisterUserParticipationResponse
        }

        const participation = await this.participations.findById(command.escape_room_id, command.participation_id)

        if(participation === undefined){
            return {
                code: 404
            } as RegisterUserParticipationResponse
        }

        const user_participation = new UserParticipation(user, participation)

        const response = await this.user_participations.save(user_participation)

        if(response){
            return {
                code: 200
            } as RegisterUserParticipationResponse
        }
        else{
            return {
                code: 404
            } as RegisterUserParticipationResponse
        }
    }
}