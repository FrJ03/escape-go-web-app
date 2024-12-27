import { Admin } from "../../users/domain/model/admin.entity";
import { Participant } from "../../users/domain/model/participant.entity";
import { Email } from "../../users/domain/model/value-objects/email";
import { Users } from "../../users/domain/services/users.repository";
import { GetProfileRequest } from "../dto/requests/get-profile.request";
import { GetProfileResponse } from "../dto/response/get-profile.response";

export class GetProfileUseCase {
    constructor(
        private readonly users: Users
    ){}

    async with(command: GetProfileRequest): Promise<GetProfileResponse>{
        const email = Email.create(command.email)
        if (!email){
            return {
                code: 400
            } as GetProfileResponse
        }
        const user = await this.users.findUserByEmail(email)
        if (!user){
            return {
                code: 404
            } as GetProfileResponse
        }
        return {
            user: {
                id: user.id,
                email: user.email.value,
                username: user.username,
                role: user instanceof Admin ? 'admin' : 'participant',
                points: user instanceof Participant ? user.points : -1
            },
            code: 200
        }
    }
}