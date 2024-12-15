import { EscapeRooms } from "../domain/services/escape_rooms.repository";
import { EscapeRoomData, GetEscapeRoomsByDistanceResponse } from "../dto/responses/get-escape-rooms-by-distance.response";
import { GetEscapeRoomsResponse } from "../dto/responses/get-escape-rooms.response";
import { GetEscapeRoomsRequest } from "../dto/resquests/get-escape-rooms.request";

export class GetEscapeRoomsUseCase{
    constructor(private readonly escape_rooms: EscapeRooms){}

    async with(command: GetEscapeRoomsRequest): Promise<GetEscapeRoomsResponse>{
        try {
            const escape_rooms = await this.escape_rooms.getAll()
            if(escape_rooms.length === 0){
                return {
                    escape_rooms: [],
                    code: 200
                } as GetEscapeRoomsResponse
            }
            else{
                const escape_rooms_list: Array<EscapeRoomData> = []

                escape_rooms.forEach(escape_room => {
                    escape_rooms_list.push({
                        id: escape_room.id,
                        title: escape_room.title,
                        location: {
                            country: escape_room.location.country,
                            city: escape_room.location.city,
                            street: escape_room.location.street,
                            street_number: escape_room.location.number,
                            coordinates: escape_room.location.coordinates.toString()
                        }
                    } as EscapeRoomData)
                })

                return {
                    escape_rooms: escape_rooms_list,
                    code: 200
                } as GetEscapeRoomsResponse
            }
        } catch (error) {
            return {
                escape_rooms: [],
                code: 500
            } as GetEscapeRoomsResponse
        }
    }
}