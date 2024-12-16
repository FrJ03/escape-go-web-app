import { DeepReadonly } from "ts-essentials";

type ParticipationGetEscapeRoomInfoResponse = {
    id: number;
    start_date: string;
    end_date: string;
    points: number | undefined;
}

type GetEscapeRoomInfoResponse  = DeepReadonly <{

    code: number,
    escape_room:{
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
    }

    participations:Array<ParticipationGetEscapeRoomInfoResponse>

}>

const GetEscapeRoomInfoResponse = {

    with: (properties: GetEscapeRoomInfoResponse): GetEscapeRoomInfoResponse => properties

}   

export { GetEscapeRoomInfoResponse, ParticipationGetEscapeRoomInfoResponse }