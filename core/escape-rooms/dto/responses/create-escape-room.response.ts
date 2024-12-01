import { DeepReadonly } from "ts-essentials";

type CreateEscapeRoomResponse = DeepReadonly<{

    code: number

}>

const CreateEscapeRoomResponse = {

    with: (properties: CreateEscapeRoomResponse): CreateEscapeRoomResponse => properties

}

export { CreateEscapeRoomResponse }