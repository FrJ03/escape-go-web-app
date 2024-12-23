import { LAUNCH_DATE } from "../../commons/utils/config";
import { Users } from "../../users/domain/services/users.repository";
import { GetGrowthRateResponse } from "../dto/responses/get-growth-rate.response";

export class GetGrowthRateUseCase {
    constructor(
        private readonly users: Users
    ){}

    async with(): Promise<GetGrowthRateResponse>{
        const u_response = await this.users.getAllParticipants()

        if(u_response.length === 0){
            return {
                code: 200,
                rate: 0
            }
        }

        const launch_date = new Date(LAUNCH_DATE)
        const now = new Date()

        const diff = this.get_difference_in_days(launch_date, now)

        if(diff === 0){
            return {
                code: 200,
                rate: u_response.length
            }
        }
        else{
            return {
                code: 200,
                rate: u_response.length / diff
            }
        }
    }
    private get_difference_in_days(a: Date, b: Date){
        const differenceInMs = b.getTime() - a.getTime();

        const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

        return Math.trunc(differenceInDays);
    }
}