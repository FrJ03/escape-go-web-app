import { DeepReadonly } from "ts-essentials";

type GetEscapeRoomsByDistanceRequest = DeepReadonly<{
    coordinates: string
}>

const GetEscapeRoomsByDistanceRequest = {
    with: (properties: GetEscapeRoomsByDistanceRequest): GetEscapeRoomsByDistanceRequest => properties
}

export { GetEscapeRoomsByDistanceRequest }