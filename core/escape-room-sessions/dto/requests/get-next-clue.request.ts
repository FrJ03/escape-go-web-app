import { DeepReadonly } from "ts-essentials";

type GetNextClueRequest = DeepReadonly<{
    clues_ids: Array<number>,
    escape_room_id: number
}>

const GetNextClueRequest = {
    with: (properties: GetNextClueRequest): GetNextClueRequest => properties
}

export {GetNextClueRequest}