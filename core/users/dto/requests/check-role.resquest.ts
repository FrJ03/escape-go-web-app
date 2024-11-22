import { DeepReadonly } from "ts-essentials";

type CheckRoleRequest = DeepReadonly<{
    email: string
    role: string
}>

const CheckRoleRequest = {
    with: (properties: CheckRoleRequest): CheckRoleRequest => properties
}

export { CheckRoleRequest }