import { DeepReadonly } from "ts-essentials";

type CreateEscapeRoomRequest = DeepReadonly<{
    title: string,
    description: string,
    solution: string,
    difficulty: number,
    price: number,
    maxSessionDuration: number,
    location:{
        country: string,
        city: string,
        street: string,
        street_number: number,
        coordinates: string,
        info: string
    }
}>

const CreateEscapeRoomRequest = {
    with: (properties: CreateEscapeRoomRequest): CreateEscapeRoomRequest => properties
}

export {CreateEscapeRoomRequest} 