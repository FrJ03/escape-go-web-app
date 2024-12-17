import { EscapeRooms } from "../../escape-rooms/domain/services/escape_rooms.repository";
import { GetClueRequest } from "../dto/requests/get-clue.request";
import { GetClueResponse } from "../dto/responses/get-clue.response";

export class GetClueUseCase{
    constructor(private readonly escape_rooms: EscapeRooms){}

    async with(command: GetClueRequest): Promise<GetClueResponse>{
        const response = await this.escape_rooms.getClueById(command.clue_id, command.escape_room_id)

        if(response !== undefined){
            return {
                clue: {
                    id: response.id,
                    title: response.title,
                    info: response.info
                },
                code: 200
            }
        }
        else{
            return {
                clue: {
                    id: -1,
                    title: '',
                    info: ''
                },
                code: 404
            }
        }
    }
}