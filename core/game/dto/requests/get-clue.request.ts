import { DeepReadonly } from "ts-essentials";

type GetClueRequest = DeepReadonly<{
    clue_id: number,
    escape_room_id: number,
    participation_id: number,
    user_email: string,
}>

const GetClueRequest = {
    with: (properties: GetClueRequest):GetClueRequest => properties
}

export {GetClueRequest}