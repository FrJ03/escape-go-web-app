import { DeepReadonly } from "ts-essentials";

type DeleteEscapeRoomRequest = DeepReadonly<{
    id: number;
}>;

const DeleteEscapeRoomRequest = {
    with: (properties: DeleteEscapeRoomRequest): DeleteEscapeRoomRequest => properties
};

export { DeleteEscapeRoomRequest };
