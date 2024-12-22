import { DeepReadonly } from "ts-essentials";

type GetGrowthRateResponse = DeepReadonly<{
    rate: number,
    code: number
}>

const GetGrowthRateResponse = {
    with: (properties: GetGrowthRateResponse): GetGrowthRateResponse => properties
}

export {GetGrowthRateResponse}