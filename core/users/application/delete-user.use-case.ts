import { Email } from "../domain/model/value-objects/email";
import { Users } from "../domain/services/users.repository";
import { DeleteRequest } from "../dto/requests/delete.request";
import { DeleteResponse } from "../dto/responses/delete.response";
import bcrypt from 'bcrypt';

export class DeleteUserUseCase{

    constructor(private readonly users: Users){}

    async with(command: DeleteRequest): Promise<DeleteResponse>{

        //comprobar que el usuario a eliminar existe en la BD

        const email = Email.create(command.email);

        if(email != undefined){

            try{

                const usuario_objetivo = await this.users.findUserByEmail(email);

                if(usuario_objetivo != undefined){ //hemos encontrado al usuario que se quiere borrar

                    const password_correct = await bcrypt.compare(command.password, usuario_objetivo.password);

                    if(password_correct == true){ //se comprueba si la contraseña es correcta

                       const borrado = await this.users.delete(usuario_objetivo.id);

                       if(borrado == true){

                            return{

                                code: 200

                            }as DeleteResponse

                       }else{

                            return{

                                code: 400

                            } as DeleteResponse

                       }

                    }else{

                        return{

                            code: 400

                        } as DeleteResponse

                    }

                }else{

                    return{

                        code: 400

                    } as DeleteResponse

                }

            } catch (error){

                return{

                    code: 404

                } as DeleteResponse

            }

        }
        else{

            return{

                code: 404

            } as DeleteResponse

        }

    }

}