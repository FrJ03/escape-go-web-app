import { DeepReadonly } from "ts-essentials";

type CreateEscapeRoomResponse = DeepReadonly<{

    code: number,
    id?: number;

}>

const CreateEscapeRoomResponse = {

    with: (properties: CreateEscapeRoomResponse): CreateEscapeRoomResponse => properties

}

export { CreateEscapeRoomResponse }