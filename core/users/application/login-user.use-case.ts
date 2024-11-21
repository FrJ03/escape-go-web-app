import { Email } from "../domain/model/value-objects/email";
import { User } from "../domain/model/user.entity";
import { Users } from "../domain/services/users.repository";
import { LoginRequest } from "../dto/requests/login.request";
import { LoginResponse } from "../dto/responses/login.response";
import jwt from 'jsonwebtoken';

export class LoginUserUseCase{

    constructor(private readonly users: Users){}

    async with(command: LoginRequest): Promise<LoginResponse>{

        //comprobar que el usuario existe en la BD

        const email = Email.create(command.email);

        if(email != undefined){

            try{

                const posible_user = await this.users.findUserByEmail(email);

                if(posible_user != undefined){ //usuario encontrado, comprobar credenciales

                    if(command.username == posible_user.username && command.password == posible_user.password){

                        const userForToken = {

                            username: command.username,
                            email: command.email,
                            id: posible_user.id

                        }

                        const token = jwt.sign(userForToken, ''); //hay que modificar las opciones del sign

                        return{

                            username: command.username,
                            email: command.email,
                            code: 200,
                            token: token

                        } as LoginResponse

                    }else{

                        return{

                            code: 400

                        } as LoginResponse

                    }

                }else{

                    return{

                        code: 400

                    } as LoginResponse

                }

            }catch (error){

                return{

                    code: 404

                } as LoginResponse

            }

        }else{

            return{

                code: 404

            } as LoginResponse

        }

    }

}