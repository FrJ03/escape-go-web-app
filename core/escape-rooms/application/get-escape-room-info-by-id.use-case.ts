import { EscapeRooms } from "../domain/services/escape_rooms.repository";
import { GetEscapeRoomInfoResponse } from "../dto/responses/get-escape-room-info.response";
import { GetEscapeRoomInfoRequest } from "../dto/resquests/get-escape-room-info.request";
import { ParticipationsSql } from "../infrastructure/services/participations_sql.repository";

export class GetEscapeRoomInfoByIdUseCase{

    constructor(private readonly escape_rooms: EscapeRooms, private readonly participations: ParticipationsSql){}

    async with(command: GetEscapeRoomInfoRequest): Promise <GetEscapeRoomInfoResponse> {

        const escape_room_id = command.id;

        if(escape_room_id != undefined){

            try{

                const found_escape_room = await this.escape_rooms.findById(escape_room_id);

                if(found_escape_room != undefined){ //devolvemos el escape_room la info se gestiona en frontend

                    try{

                        const participations_array = await this.participations.findAllByEscapeRoom(escape_room_id);

                        if(participations_array != undefined){

                            return{

                                code:200,
                                id: found_escape_room.id,
                                title: found_escape_room.title,
                                description: found_escape_room.description,
                                difficulty: found_escape_room.difficulty,
                                price: found_escape_room.price,
                                maxSessionDuration: found_escape_room.maxSessionDuration,
                                location:{
    
                                    country: found_escape_room.location.country,
                                    city: found_escape_room.location.city,
                                    street: found_escape_room.location.street,
                                    street_number: found_escape_room.location.number,
                                    coordinates: found_escape_room.location.coordinates.toString()
    
                                },
    
                                participations_array: participations_array
    
                            } as GetEscapeRoomInfoResponse

                        }else{

                            return{ //error al obtener participaciones

                                code: 404

                            } as GetEscapeRoomInfoResponse

                        }

                    }catch(error){

                        return{ //error en el try

                            code: 400

                        } as GetEscapeRoomInfoResponse

                    }

                    

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