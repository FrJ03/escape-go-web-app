import { DeepReadonly } from "ts-essentials";

type SolveEscapeRoomRequest = DeepReadonly<{
    escape_room_id: number,
    participation_id: number,
    solution: 'title'
}>

const SolveEscapeRoomRequest = {
    with: (properties: SolveEscapeRoomRequest): SolveEscapeRoomRequest => properties
}

export {SolveEscapeRoomRequest}