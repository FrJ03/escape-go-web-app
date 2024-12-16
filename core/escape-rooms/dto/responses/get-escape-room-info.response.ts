import { DeepReadonly } from "ts-essentials";

type GetEscapeRoomInfoResponse  = DeepReadonly <{

    code: number,
    id: number,
    title: string,
    description: string,
    difficulty: number,
    price: number,
    maxSessionDuration: number,
    location: {
        country: string,
        city: string,
        street: string,
        street_number: number,
        coordinates: string
    }

    participations_array:{

        id: number;
        start_date: Date;
        end_date: Date;
        points: number | undefined;

    }[]

}>

const GetEscapeRoomInfoResponse = {

    with: (properties: GetEscapeRoomInfoResponse): GetEscapeRoomInfoResponse => properties

}   

export { GetEscapeRoomInfoResponse }