import { DeepReadonly } from "ts-essentials";
import { EscapeRoom } from "../../domain/model/escapeRoom.entity";

type GetEscapeRoomInfoResponse  = DeepReadonly <{

    code: number
    escape_room_found: EscapeRoom

}>

const GetEscapeRoomInfoResponse = {

    with: (properties: GetEscapeRoomInfoResponse): GetEscapeRoomInfoResponse => properties

}   

export { GetEscapeRoomInfoResponse }