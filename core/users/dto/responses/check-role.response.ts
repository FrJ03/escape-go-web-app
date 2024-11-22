import { DeepReadonly } from "ts-essentials";

type CheckRoleResponse = DeepReadonly<{
    value: boolean
}>

const CheckRoleRequest = {
    with: (properties: CheckRoleResponse): CheckRoleResponse => properties
}

export { CheckRoleResponse }