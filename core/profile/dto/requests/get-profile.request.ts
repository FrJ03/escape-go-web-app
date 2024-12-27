import { DeepReadonly } from "ts-essentials";

type GetProfileRequest = DeepReadonly<{
    email: string
}>

const GetProfileRequest = {
    with: (properties: GetProfileRequest): GetProfileRequest => properties
}

export { GetProfileRequest }