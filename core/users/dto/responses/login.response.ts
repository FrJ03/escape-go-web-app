import { DeepReadonly } from "ts-essentials";

type LoginResponse = DeepReadonly<{

    token: string | undefined,
    role: string,
    code: number

}>

const LoginResponse = {

    with: (properties: LoginResponse) => properties

}

export { LoginResponse }