import { EscapeRooms } from "../domain/services/escape_rooms.repository";
import { GetEscapeRoomResponse } from "../dto/responses/get-escape-room.response";
import { GetEscapeRoomRequest } from "../dto/resquests/get-escape-room.request";

export class GetEscapeRoomUseCase{

    constructor(private readonly escape_rooms: EscapeRooms){}

    async with(command: GetEscapeRoomRequest): Promise <GetEscapeRoomResponse> {

        const escape_room_id = command.id;

        if(escape_room_id != undefined){

            try{

                const found_escape_room = await this.escape_rooms.findById(escape_room_id);

                if(found_escape_room != undefined){ //devolvemos el escape_room la info se gestiona en frontend

                    return{

                        escape_room: {
                            id: found_escape_room.id,
                            title: found_escape_room.title,
                            description: found_escape_room.description,
                            solution: found_escape_room.solution,
                            difficulty: found_escape_room.difficulty,
                            price: found_escape_room.price,
                            max_session_duaration: found_escape_room.maxSessionDuration,
                            location: {
                                country: found_escape_room.location.country,
                                city: found_escape_room.location.city,
                                street: found_escape_room.location.street,
                                street_number: found_escape_room.location.number,
                                coordinates: found_escape_room.location.coordinates.toString()
                            }
                        },
                        code: 200

                    } as GetEscapeRoomResponse

                }else{

                    return{ //escape_room no encontrado

                        code: 404,
                        escape_room: {}
                    } as GetEscapeRoomResponse

                }

            }catch(error){

                return{ //error en el try

                    code: 400,
                    escape_room: {}
                } as GetEscapeRoomResponse

            }

        }else{
            
            return{ //el id no se ha obtenido correctamente devolver response

                code: 400,
                escape_room: {}

            } as GetEscapeRoomResponse

        }

    }

}