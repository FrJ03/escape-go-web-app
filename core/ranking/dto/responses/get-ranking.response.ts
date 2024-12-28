import { DeepReadonly } from "ts-essentials";

type ParticipantResponse = DeepReadonly<{
    username: string,
    points: number
}>

type GetRankingResponse = DeepReadonly<{
    code: number,
    ranking: Array<ParticipantResponse>
}>

const GetRankingResponse = {
    with: (properties: GetRankingResponse): GetRankingResponse => properties
}

export { GetRankingResponse, ParticipantResponse }