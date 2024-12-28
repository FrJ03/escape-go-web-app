import { DeepReadonly } from "ts-essentials";

type GetParticipationsByUserRequest = DeepReadonly<{
    email: string
}>

const GetParticipationsByUserRequest = {
    with: (properties: GetParticipationsByUserRequest): GetParticipationsByUserRequest => properties
}

export { GetParticipationsByUserRequest }