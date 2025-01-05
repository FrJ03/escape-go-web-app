import { Coordinate } from "../domain/model/coordinate.entity";
import { EscapeRoom } from "../domain/model/escapeRoom.entity";
import { Location } from "../domain/model/location.entity";
import { EscapeRooms } from "../domain/services/escape_rooms.repository";
import { CreateEscapeRoomResponse } from "../dto/responses/create-escape-room.response";
import { EscapeRoomData, GetEscapeRoomsByDistanceResponse } from "../dto/responses/get-escape-rooms-by-distance.response";
import { CreateEscapeRoomRequest } from "../dto/resquests/create-escape-room.request";
import { GetEscapeRoomsByDistanceRequest } from "../dto/resquests/get-escape-rooms-by-distance.request";

export class GetEscapeRoomsByDistanceUseCase{
    constructor(private readonly escape_rooms: EscapeRooms){}

    async with(command: GetEscapeRoomsByDistanceRequest): Promise<GetEscapeRoomsByDistanceResponse>{
        console.error(command.coordinates)

        const coordinates = Coordinate.create(command.coordinates)

        console.error(coordinates)

        if(coordinates === undefined){
            return {
                escape_rooms: [],
                code: 400
            } as GetEscapeRoomsByDistanceResponse
        }

        try {
            const escape_rooms = await this.escape_rooms.getAllByDistance(coordinates)
            if(escape_rooms.length === 0){
                return {
                    escape_rooms: [],
                    code: 200
                } as GetEscapeRoomsByDistanceResponse
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
                } as GetEscapeRoomsByDistanceResponse
            }
        } catch (error) {
            return {
                escape_rooms: [],
                code: 500
            } as GetEscapeRoomsByDistanceResponse
        }
    }
}