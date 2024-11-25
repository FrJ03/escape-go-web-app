import { Email } from "../domain/model/value-objects/email";
import { Users } from "../domain/services/users.repository";
import { LoginRequest } from "../dto/requests/login.request";
import { LoginResponse } from "../dto/responses/login.response";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { SessionsSql } from "../infrastructure/services/sessions-sql.repository";
import { Session } from '../domain/model/session.entity';

export class LoginUserUseCase{

    constructor(private readonly users: Users, private readonly sessions: SessionsSql){}

    async with(command: LoginRequest): Promise<LoginResponse>{

        //comprobar que el usuario existe en la BD

        const email = Email.create(command.email);

        if(email != undefined){

            try{

                const posible_user = await this.users.findUserByEmail(email);

                if(posible_user != undefined){ //usuario encontrado, comprobar credenciales

                    const password_correct = await bcrypt.compare(command.password, posible_user.password);

                    if(command.username == posible_user.username && password_correct){

                        const userForToken = {

                            username: command.username,
                            email: command.email,
                            id: posible_user.id

                        }

                        const token = jwt.sign(userForToken, ''); //hay que modificar las opciones del sign

                        const fecha_actual: Date = new Date();

                        const sesion = new Session(0, fecha_actual, posible_user); //creamos objeto sesion para la funcion save

                        this.sessions.save(sesion); //guarda log de inicio de sesion en BD

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