import { DeepReadonly } from "ts-essentials";

type DeleteRequest = DeepReadonly<{
    
    email: string,
    password: string

}>

const DeleteRequest = {

    with: (properties: DeleteRequest): DeleteRequest => properties

}

export {DeleteRequest}