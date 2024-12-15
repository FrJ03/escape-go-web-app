import { DeepReadonly } from "ts-essentials";

type GetEscapeRoomRequest = DeepReadonly<{

    id: number

}>

const GetEscapeRoomRequest = {

    with: (properties: GetEscapeRoomRequest): GetEscapeRoomRequest => properties

}

export { GetEscapeRoomRequest }