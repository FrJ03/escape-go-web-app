import { DeepReadonly } from "ts-essentials";

type GetProfileResponse = DeepReadonly<{
    user: {
        id: number
        email: string,
        username: string,
        role: string,
        points: number
    }
    code: number
}>

const GetProfileResponse = {
    with: (properties: GetProfileResponse): GetProfileResponse => properties
}

export { GetProfileResponse }