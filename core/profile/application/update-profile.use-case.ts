import { Email } from "../../users/domain/model/value-objects/email";
import { Users } from "../../users/domain/services/users.repository";
import { UpdateProfileRequest } from "../dto/requests/update-profile.request";
import { UpdateProfileResponse } from "../dto/response/update-profile.response";
import bcrypt from 'bcrypt';
import { PASS, SALT } from '../../commons/utils/config';
import jwt from 'jsonwebtoken';

export class UpdateProfileUseCase {
    constructor(
        private readonly users: Users
    ) {}

    async with(command: UpdateProfileRequest): Promise<UpdateProfileResponse> {

        if (!command.emailOriginal) {
            return {
                code: 400,
            } as UpdateProfileResponse;
        }
        const emailOriginal = Email.create(command.emailOriginal);

        if (!emailOriginal) {
            return {
            code: 400,
            } as UpdateProfileResponse;
        }

        const user = await this.users.findUserByEmail(emailOriginal);
        if (!user) {
            return {
                code: 404,
            } as UpdateProfileResponse;
        }

        if (command.emailNuevo) {
            const emailNuevo = Email.create(command.emailNuevo);

            if (!emailNuevo) {
                return {
                    code: 400,
                } as UpdateProfileResponse;
            }

            if(emailNuevo.value !== emailOriginal.value){
                const emailExistente = await this.users.findUserByEmail(emailNuevo);
                if (emailExistente !== undefined) {
                    return {
                        code: 400,
                    } as UpdateProfileResponse;
                }
            }

            user.email = emailNuevo;
        }

        if (command.username) {
            user.username = command.username;
        }

        if (command.password) {
            const hashedPassword = await bcrypt.hash(command.password, SALT);
            user.password = hashedPassword;
        }

        try {
            if (await this.users.updateProfile(user)) {
                const userForToken = {
                    username: command.username,
                    email: command.emailNuevo,
                    id: command.id
                }

                const token = jwt.sign(userForToken, PASS);
                return {
                    code: 200,
                    token: token
                } as UpdateProfileResponse;
            } else {
                return {
                    code: 400,
                } as UpdateProfileResponse;
            }
        } catch (error) {
            return {
                code: 500,
            } as UpdateProfileResponse;
        }
    }
}