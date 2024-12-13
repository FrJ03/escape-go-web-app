import { EscapeRooms } from "../domain/services/escape_rooms.repository";
import { GetEscapeRoomInfoResponse } from "../dto/responses/get-escape-room-info.response";
import { GetEscapeRoomInfoRequest } from "../dto/resquests/get-escape-room-info.request";

export class GetEscapeRoomInfoByIdUseCase{

    constructor(private readonly escape_rooms: EscapeRooms){}

    async with(command: GetEscapeRoomInfoRequest): Promise <GetEscapeRoomInfoResponse> {

        const escape_room_id = command.id;

        if(escape_room_id != undefined){

            try{

                const found_escape_room = await this.escape_rooms.findById(escape_room_id);

                if(found_escape_room != undefined){ //devolvemos el escape_room la info se gestiona en frontend

                    return{

                        escape_room_found: found_escape_room,
                        code: 200

                    } as GetEscapeRoomInfoResponse

                }else{

                    return{ //escape_room no encontrado

                        code: 404

                    } as GetEscapeRoomInfoResponse

                }

            }catch(error){

                return{ //error en el try

                    code: 400

                } as GetEscapeRoomInfoResponse

            }

        }else{
            
            return{ //el id no se ha obtenido correctamente devolver response

                code: 400

            } as GetEscapeRoomInfoResponse

        }

    }

}