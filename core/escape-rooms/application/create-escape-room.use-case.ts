import { Clue } from "../domain/model/clue.entity";
import { Coordinate } from "../domain/model/coordinate.entity";
import { EscapeRoom } from "../domain/model/escapeRoom.entity";
import { Location } from "../domain/model/location.entity";
import { EscapeRooms } from "../domain/services/escape_rooms.repository";
import { CreateEscapeRoomResponse } from "../dto/responses/create-escape-room.response";
import { CreateEscapeRoomRequest } from "../dto/resquests/create-escape-room.request";

export class CreateEscapeRoomUseCase{
    constructor(private readonly escape_rooms: EscapeRooms){}

    async with(command: CreateEscapeRoomRequest): Promise<CreateEscapeRoomResponse>{
        const coordinates = Coordinate.create(command.location.coordinates)
        if(coordinates === undefined){
            return {
                code: 400
            } as CreateEscapeRoomResponse
        }

        const location: Location = new Location(
            1,
            command.location.country,
            command.location.city,
            command.location.street,
            command.location.street_number,
            coordinates,
            command.location.info
        )
        let clues: Array<Clue> = []

        for (let i = 0 ; i < command.clues.length; i++){
            clues.push(new Clue(
                1,
                command.clues[i].title,
                command.clues[i].info
            ))
        }

        const escape_room = new EscapeRoom(
            1,
            command.title,
            command.description,
            command.solution,
            command.difficulty,
            command.price,
            command.maxSessionDuration,
            location,
            clues
        )

        try {
            if(await this.escape_rooms.save(escape_room)){
                return {
                    code: 200,
                    id: escape_room.id
                } as CreateEscapeRoomResponse
            }
            else{
                return {
                    code: 400
                } as CreateEscapeRoomResponse
            }
        } catch (error) {
            return {
                code: 500
            } as CreateEscapeRoomResponse
        }
    }
}