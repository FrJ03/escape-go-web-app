import { DeepReadonly } from "ts-essentials";

type LoginRequest = DeepReadonly<{

    email: string,
    username: string,
    password: string

}>

const LoginRequest = {

    with: (properties: LoginRequest): LoginRequest => properties

}

export { LoginRequest }