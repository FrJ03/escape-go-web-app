import { DeepReadonly } from "ts-essentials";

type SolveEscapeRoomResponse = DeepReadonly<{
    code: number,
    points: number
}>

const SolveEscapeRoomResponse = {
    with: (properties: SolveEscapeRoomResponse): SolveEscapeRoomResponse => properties
}

export {SolveEscapeRoomResponse}