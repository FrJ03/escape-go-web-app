import { Admin } from "../domain/model/admin.entity";
import { Participant } from "../domain/model/participant.entity";
import { Email } from "../domain/model/value-objects/email";
import { Users } from "../domain/services/users.repository";
import { CheckRoleRequest } from "../dto/requests/check-role.resquest";
import { CheckRoleResponse } from "../dto/responses/check-role.response";

export class CheckUserRoleUseCase{
    constructor(private readonly users: Users){}

    async with(command: CheckRoleRequest): Promise<CheckRoleResponse>{
        const email = Email.create(command.email)

        if(email === undefined){
            return {
                value: false
            } as CheckRoleResponse
        }
        else if (command.role !== 'admin' && command.role !== 'participant'){
            return {
                value: false
            } as CheckRoleResponse
        }
        else{
            const user = await this.users.findUserByEmail(email)

            if(user === undefined){
                return {
                    value: false
                } as CheckRoleResponse
            }
            else if (command.role === 'admin'){
                return {
                    value: (user instanceof Admin)
                } as CheckRoleResponse
            }
            else{
                return {
                    value: (user instanceof Participant)
                } as CheckRoleResponse
            }
        }
    }
}