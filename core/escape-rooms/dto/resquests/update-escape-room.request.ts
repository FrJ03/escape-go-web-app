import { DeepReadonly } from "ts-essentials";

type UpdateEscapeRoomRequest = DeepReadonly<{
    id: number,
    title: string,
    description: string,
    solution: string,
    difficulty: number,
    price: number,
    clues: Array<{
        title: string,
        info: string
    }>
}>;

const UpdateEscapeRoomRequest = {
    with: (properties: UpdateEscapeRoomRequest): UpdateEscapeRoomRequest => properties
};

export { UpdateEscapeRoomRequest };
