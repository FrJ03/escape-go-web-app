import { DeepReadonly } from "ts-essentials";

type GetNextClueRequest = DeepReadonly<{
    clues_ids: Array<number>,
    escape_room_id: number,
    participation_id: number,
    user_email: string
}>

const GetNextClueRequest = {
    with: (properties: GetNextClueRequest): GetNextClueRequest => properties
}

export {GetNextClueRequest}