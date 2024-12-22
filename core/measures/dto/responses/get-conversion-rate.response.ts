import { DeepReadonly } from "ts-essentials";

type GetConversionRateResponse = DeepReadonly<{
    rate: number,
    code: number
}>

const GetConversionRateResponse = {
    with: (properties: GetConversionRateResponse): GetConversionRateResponse => properties
}

export {GetConversionRateResponse}