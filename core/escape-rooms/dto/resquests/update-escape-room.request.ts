import { DeepReadonly } from "ts-essentials";

type UpdateEscapeRoomRequest = DeepReadonly<{
    id: number,
    title: string,
    description: string,
    solution: string,
    difficulty: number,
    price: number,
}>;

const UpdateEscapeRoomRequest = {
    with: (properties: UpdateEscapeRoomRequest): UpdateEscapeRoomRequest => properties
};

export { UpdateEscapeRoomRequest };
