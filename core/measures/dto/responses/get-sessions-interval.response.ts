import { DeepReadonly } from "ts-essentials";

type GetSessionsIntervalResponse = DeepReadonly<{
    years: number,
    months: number,
    days: number,
    hours: number
    minutes: number,
    seconds: number,
    code: number
}>

const GetSessionsIntervalResponse = {
    with: (properties: GetSessionsIntervalResponse): GetSessionsIntervalResponse => properties
}

export {GetSessionsIntervalResponse}