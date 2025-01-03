import { Email } from '../domain/model/value-objects/email';
import { Users } from '../domain/services/users.repository';
import { SignUpRequest } from '../dto/requests/signup.request';
import { SignUpResponse } from '../dto/responses/signup.response';
import { User } from '../domain/model/user.entity';
import bcrypt from 'bcrypt';
import { SessionsSql } from '../../users/infrastructure/services/sessions-sql.repository';
import { SALT } from '../../commons/utils/config';

export class SignUpUserUseCase{

    constructor(private readonly users: Users, private readonly sessions: SessionsSql){}



    async with(command: SignUpRequest): Promise<SignUpResponse>{

        //comprobar que el usuario no existe previamente en la BBDD

        const email = Email.create(command.email);

        if(email != undefined){

            try{

                const posible_user = await this.users.findUserByEmail(email) //buscamos al usuario por mail
                                
                if(posible_user != undefined){ //si se cumple quiere decir que el usuario ya existe en la BD
                    console.log("Usuario ya existe")

                    return{

                        code: 400

                    } as SignUpResponse

                }
                else{ //no existe por lo tanto se registra

                    //lo creamos

                    const hashedPassword = await bcrypt.hash(command.password, SALT); //encriptamos la contraseña antes de guardarla junto con los datos del usuario en la BD

                    const new_user = new User(0, email, command.username, hashedPassword);

                    //lo registramos

                    if(await this.users.save(new_user)){
                        console.log("Usuario registrado")
                        return{

                            code: 200

                        } as SignUpResponse

                    }
                    else{
                        console.log("Error al registrar usuario")

                        return{

                            code: 400

                        } as SignUpResponse

                    }
                }
            }catch (error){
                console.log("Error al registrar usuario 2")
                return{
                    code: 400
                } as SignUpResponse
            }
        }else{
            console.log("Error al registrar usuario 3")
            return{
                code: 400
            } as SignUpResponse

        }

    }

}