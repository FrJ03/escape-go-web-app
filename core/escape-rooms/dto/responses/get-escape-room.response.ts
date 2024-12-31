import { DeepReadonly } from "ts-essentials";

type GetEscapeRoomResponse  = DeepReadonly <{

    code: number
    escape_room: {
        id: number,
        title: string,
        description: string,
        solution: string,
        difficulty: number
        price: number,
        max_session_duaration: number
        location: {
            country: string,
            city: string,
            street: string,
            street_number: number,
            coordinates: string
        },
        clues: Array<{
            id: number,
            title: string,
            info: string
        }>
    }

}>

const GetEscapeRoomResponse = {

    with: (properties: GetEscapeRoomResponse): GetEscapeRoomResponse => properties

}   

export { GetEscapeRoomResponse }