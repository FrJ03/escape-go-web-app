import { DeepReadonly } from "ts-essentials";

type ParticipationResponse = {
    id: number,
    start_date: string,
    end_date: string,
    points: number
}

type GetParticipationsByUserResponse = DeepReadonly<{
    code: number,
    participatons: Array<ParticipationResponse>
}>

const GetParticipationsByUserResponse = {
    with: (properties: GetParticipationsByUserResponse): GetParticipationsByUserResponse => properties
}

export { GetParticipationsByUserResponse, ParticipationResponse }