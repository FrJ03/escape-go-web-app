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

type GetEscapeRoomsByDistanceResponse = DeepReadonly<{
    escape_rooms: Array<EscapeRoomData>
    code: number
}>

const GetEscapeRoomsByDistanceResponse = {
    with: (properties: GetEscapeRoomsByDistanceResponse): GetEscapeRoomsByDistanceResponse => properties
}

export { GetEscapeRoomsByDistanceResponse, EscapeRoomData }