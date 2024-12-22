import { Sessions } from "../../users/domain/services/sessions.repository";
import { GetSessionsIntervalResponse } from "../dto/responses/get-sessions-interval.response";

export class GetSessionsIntervalUseCase{
    constructor(
        private readonly sessions: Sessions
    ){}

    async with(): Promise<GetSessionsIntervalResponse>{
        const s_response = await this.sessions.getAll()

        if(s_response.length === 0){
            return {
                code: 200,
                years: 0,
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            }
        }

        let sum = 0

        for (let i = 0 ; i < s_response.length - 1 ; i++){
            sum += s_response[i + 1].date.getTime() - s_response[i].date.getTime()
        }

        const value =  Math.trunc(sum / (s_response.length - 1))

        const mean = new Date(value)

        return {
            code: 200,
            years: mean.getFullYear() - 1970,
            months: mean.getMonth(),
            days: mean.getDate() - 1,
            hours: mean.getUTCHours(),
            minutes: mean.getMinutes(),
            seconds: mean.getSeconds()
        }
    }
}