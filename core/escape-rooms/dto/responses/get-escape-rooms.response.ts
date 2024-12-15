import { DeepReadonly } from "ts-essentials";

type EscapeRoomData = DeepReadonly<{
    id: number,
    title: string,
    location: {
        country: string,
        city: string,
        street: string,
        street_number: number,
        coordinates: string
    }
}>

type GetEscapeRoomsResponse = DeepReadonly<{
    escape_rooms: Array<EscapeRoomData>
    code: number
}>

const GetEscapeRoomsResponse = {
    with: (properties: GetEscapeRoomsResponse): GetEscapeRoomsResponse => properties
}

export { GetEscapeRoomsResponse, EscapeRoomData }