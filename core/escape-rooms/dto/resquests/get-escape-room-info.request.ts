import { DeepReadonly } from "ts-essentials";

type GetEscapeRoomInfoRequest = DeepReadonly<{

    id: number

}>

const GetEscapeRoomInfoRequest = {

    with: (properties: GetEscapeRoomInfoRequest): GetEscapeRoomInfoRequest => properties

}

export { GetEscapeRoomInfoRequest }