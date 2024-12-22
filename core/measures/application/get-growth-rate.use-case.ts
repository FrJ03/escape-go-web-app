import { Users } from "../../users/domain/services/users.repository";
import { GetGrowthRateResponse } from "../dto/responses/get-growth-rate.response";

export class GetGrowthRateUseCase {
    constructor(
        private readonly users: Users
    ){}

    async with(): GetGrowthRateResponse{
        const u_response = await this.users.getAllParticipants()

        if(u_response.length === 0){
            return {
                code: 200,
                rate: 0
            }
        }
    }
}