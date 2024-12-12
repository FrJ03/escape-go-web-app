import { DeepReadonly } from "ts-essentials";

type CreateParticipationResponse = DeepReadonly<{
    code: number
}>

const CreateParticipationResponse = {
    with: (properties: CreateParticipationResponse): CreateParticipationResponse => properties
}

export { CreateParticipationResponse }