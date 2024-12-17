import { DeepReadonly } from "ts-essentials";

type UpdateEscapeRoomResponse = DeepReadonly<{
    code: number,
    id?: number;
}>;

const UpdateEscapeRoomResponse = {
    with: (properties: UpdateEscapeRoomResponse): UpdateEscapeRoomResponse => properties
};

export { UpdateEscapeRoomResponse };
