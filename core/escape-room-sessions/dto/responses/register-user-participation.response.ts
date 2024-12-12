import { DeepReadonly } from "ts-essentials";

type RegisterUserParticipationResponse = DeepReadonly<{
    code: number
}>

const RegisterUserParticipationResponse = {
    with: (properties: RegisterUserParticipationResponse): RegisterUserParticipationResponse => properties
}

export { RegisterUserParticipationResponse }