import { DeepReadonly } from "ts-essentials";

type GetClueRequest = DeepReadonly<{
    clue_id: number
    escape_room_id: number
}>

const GetClueRequest = {
    with: (properties: GetClueRequest):GetClueRequest => properties
}

export {GetClueRequest}