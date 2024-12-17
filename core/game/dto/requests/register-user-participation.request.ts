import { DeepReadonly } from "ts-essentials";

type RegisterUserParticipationRequest = DeepReadonly<{
    user_email: string,
    participation_id: number,
    escape_room_id: number
}>

const RegisterUserParticipationRequest = {
    with: (properties: RegisterUserParticipationRequest):RegisterUserParticipationRequest => properties
}

export {RegisterUserParticipationRequest}