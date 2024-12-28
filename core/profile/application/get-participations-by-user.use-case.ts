import { UserParticipations } from "../../game/domain/services/user-participations.repository";
import { Email } from "../../users/domain/model/value-objects/email";
import { Users } from "../../users/domain/services/users.repository";
import { GetParticipationsByUserRequest } from "../dto/requests/get-participations-by-user.request";
import { GetParticipationsByUserResponse, ParticipationResponse } from "../dto/response/get-participations-by-user.response";

export class GetParticipationsByUserUseCase {
    constructor(
        private readonly users: Users,
        private readonly user_participations: UserParticipations
    ){}

    async with(command: GetParticipationsByUserRequest): Promise<GetParticipationsByUserResponse>{
        const email = Email.create(command.email)

        if(email === undefined){
            return {
                code: 400
            } as GetParticipationsByUserResponse
        }

        const user = await this.users.findUserByEmail(email)

        if(user === undefined){
            return {
                code: 404
            } as GetParticipationsByUserResponse
        }

        const user_participations = await this.user_participations.getAllByUser(email)

        let participation_response: Array<ParticipationResponse> = []

        user_participations.forEach(user_participations => {
            participation_response.push({
                id: user_participations.participation.id,
                start_date: user_participations.participation.start_date.toISOString(),
                end_date: user_participations.participation.end_date.toISOString(),
                points: (user_participations.participation.points !== undefined) ? user_participations.participation.points : 0
            })
        })

        return {
            code: 200,
            participatons: participation_response
        }
    }
}