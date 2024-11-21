import { DeepReadonly } from "ts-essentials";

type LoginResponse = DeepReadonly<{

    token: string | undefined,
    username: string | undefined,
    email: string | undefined,
    code: number

}>

const LoginResponse = {

    with: (properties: LoginResponse) => properties

}

export { LoginResponse }