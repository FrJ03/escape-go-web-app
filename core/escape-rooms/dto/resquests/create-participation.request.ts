import { DeepReadonly } from "ts-essentials";

type CreateParticipationRequest = DeepReadonly<{
    start_date: string,
    end_date: string,
    escape_room_id: number
}>

const CreateParticipationRequest = {
    with: (properties: CreateParticipationRequest): CreateParticipationRequest => properties
}

export {CreateParticipationRequest} 