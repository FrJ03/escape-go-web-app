import { DeepReadonly } from 'ts-essentials'; //he instalado el ts-essentials hay que subir el package.json

type SignUpRequest = DeepReadonly<{

    email: string,
    username: string,
    password: string

}>

const SignUpRequest = {

    with: (properties: SignUpRequest): SignUpRequest => properties

}

export { SignUpRequest }