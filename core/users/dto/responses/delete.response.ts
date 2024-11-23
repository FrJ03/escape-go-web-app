import { DeepReadonly } from "ts-essentials";

type DeleteResponse = DeepReadonly<{

    code: number

}>

const DeleteResponse = {

    with: (properties: DeleteResponse) => properties

}

export {DeleteResponse}