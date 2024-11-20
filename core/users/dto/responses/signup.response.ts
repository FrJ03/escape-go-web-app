import { DeepReadonly } from "ts-essentials";

type SignUpResponse = DeepReadonly<{

    code: number

}>

const SignUpResponse = {

    with: (properties: SignUpResponse) => properties

}

export { SignUpResponse }