import { UserParticipations } from "../../game/domain/services/user-participations.repository";
import { Sessions } from "../../users/domain/services/sessions.repository";
import { GetConversionRateResponse } from "../dto/responses/get-conversion-rate.response";

export class GetConversionRateUseCase {
    constructor(
        private readonly user_participations: UserParticipations,
        private readonly sessions: Sessions
    ){}

    async with(): Promise<GetConversionRateResponse>{
        const ups = await this.user_participations.getAll()
        const s = await this.sessions.getAll()

        console.error(ups.length)
        console.error(s.length)

        if(ups.length === 0 || s.length === 0){
            return {
                code: 200,
                rate: 0
            }
        }
        else{
            return {
                code: 200,
                rate: ups.length / s.length
            }
        }
    }
}