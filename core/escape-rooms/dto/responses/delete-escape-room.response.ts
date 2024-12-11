import { DeepReadonly } from "ts-essentials";

type DeleteEscapeRoomResponse = DeepReadonly<{
    code: number;
    id?: number;
}>;

const DeleteEscapeRoomResponse = {
    with: (properties: DeleteEscapeRoomResponse): DeleteEscapeRoomResponse => properties,
};

export { DeleteEscapeRoomResponse };
