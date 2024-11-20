import { Email } from '../domain/model/value-objects/email';
import { Participant } from '../domain/model/participant.entity';
import { Users } from '../domain/services/users.repository';
import { SignUpRequest } from '../dto/requests/signup.request';
import { SignUpResponse } from '../dto/responses/signup.response';
import { User } from '../domain/model/user.entity';

export class SignUpUserUseCase{

    constructor(private readonly users: Users){}



    async with(command: SignUpRequest): Promise<SignUpResponse>{

        //comprobar que el usuario no existe previamente en la BBDD

        const email = Email.create(command.email);

        if(email != undefined){

            try{

                const Participant = await this.users.findUserByEmail(email) //buscamos al usuario por mail
                                
                if(Participant != null){ //si se cumple quiere decir que el usuario ya existe en la BD

                    return{

                        code: 400

                    } as SignUpResponse

                }
                else{ //no existe por lo tanto se registra

                    //lo creamos

                    const new_user = new User(0, email, command.username, command.password);

                    //lo registramos

                    if(await this.users.save(new_user)){ //introduce al usuario en la BD, la BD machaca el valor del ID generando uno automático

                        return{

                            code: 200

                        } as SignUpResponse

                    }
                    else{

                        return{

                            code: 404

                        } as SignUpResponse

                    }

                }

            }catch (error){

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