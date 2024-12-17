import { EscapeRooms } from "../../escape-rooms/domain/services/escape_rooms.repository";
import { GetNextClueRequest } from "../dto/requests/get-next-clue.request";
import { GetNextClueResponse } from "../dto/responses/get-next-clue.response";

export class GetNextClueUseCase{
    constructor(private readonly escape_rooms: EscapeRooms){}

    async with(command: GetNextClueRequest): Promise<GetNextClueResponse>{
        const escape_room = await this.escape_rooms.findById(command.escape_room_id)

        if(escape_room === undefined){
            return {
                clue: {
                    id: -1,
                    title: '',
                    info: ''
                },
                code: 404
            }
        }

        console.error(escape_room.clues)

        for (let i = 0 ; i < escape_room.clues.length ; i++){
            console.error(command.clues_ids.indexOf(escape_room.clues[i].id))
            if(command.clues_ids.indexOf(escape_room.clues[i].id) === -1){
                return {
                    clue: {
                        id: escape_room.clues[i].id,
                        title: escape_room.clues[i].title,
                        info: escape_room.clues[i].info
                    },
                    code: 200
                }
            }
        }

        return {
            clue: {
                id: -1,
                title: '',
                info: ''
            },
            code: 204
        }
    }
}