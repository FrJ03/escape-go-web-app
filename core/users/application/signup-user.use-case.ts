import { Email } from '../domain/model/value-objects/email';
import { Users } from '../domain/services/users.repository';
import { SignUpRequest } from '../dto/requests/signup.request';
import { SignUpResponse } from '../dto/responses/signup.response';
import { User } from '../domain/model/user.entity';
import bcrypt from 'bcrypt';
import { SessionsSql } from '../../users/infrastructure/services/sessions-sql.repository';
import { Session } from '../domain/model/session.entity';

export class SignUpUserUseCase{

    constructor(private readonly users: Users, private readonly sessions: SessionsSql){}



    async with(command: SignUpRequest): Promise<SignUpResponse>{

        //comprobar que el usuario no existe previamente en la BBDD

        const email = Email.create(command.email);

        if(email != undefined){

            try{

                const posible_user = await this.users.findUserByEmail(email) //buscamos al usuario por mail
                                
                if(posible_user != undefined){ //si se cumple quiere decir que el usuario ya existe en la BD

                    return{

                        code: 400

                    } as SignUpResponse

                }
                else{ //no existe por lo tanto se registra

                    //lo creamos

                    const saltRounds = 10;

                    const hashedPassword = await bcrypt.hash(command.password, saltRounds); //encriptamos la contraseña antes de guardarla junto con los datos del usuario en la BD

                    const new_user = new User(0, email, command.username, hashedPassword);

                    //lo registramos

                    if(await this.users.save(new_user)){ //introduce al usuario en la BD, la BD machaca el valor del ID generando uno automático

                        const fecha_actual: Date = new Date();

                        const sesion = new Session(0, fecha_actual, new_user); //creamos el objeto sesion necesario para la funcion save

                        this.sessions.save(sesion); //guarda log de registro en BD

                        return{

                            code: 200

                        } as SignUpResponse

                    }
                    else{

                        return{

                            code: 4043

                        } as SignUpResponse

                    }

                }

            }catch (error){

                console.error(error);

                return{

                    code: 404

                } as SignUpResponse

            }

        }else{

            return{

                code: 404

            } as SignUpResponse

        }

    }

}