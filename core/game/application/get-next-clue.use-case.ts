import { EscapeRooms } from "../../escape-rooms/domain/services/escape_rooms.repository";
import { Participations } from "../../escape-rooms/domain/services/participation.repository";
import { Email } from "../../users/domain/model/value-objects/email";
import { UserParticipations } from "../domain/services/user-participations.repository";
import { GetNextClueRequest } from "../dto/requests/get-next-clue.request";
import { GetNextClueResponse } from "../dto/responses/get-next-clue.response";

export class GetNextClueUseCase{
    constructor(private readonly escape_rooms: EscapeRooms, private readonly participations: Participations, private readonly user_participations: UserParticipations){}

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

        const participation = await this.participations.findById(command.escape_room_id, command.participation_id)

        if(participation === undefined){
            return {
                code: 404
            } as GetNextClueResponse
        }
    
        const now = Date.now()

        if(participation.start_date.getTime() > now || participation.end_date.getTime() < now){
            return {
                code: 423,
            } as GetNextClueResponse
        }

        const user_email = Email.create(command.user_email)

        if(user_email === undefined){
            return {
                code: 400
            } as GetNextClueResponse
        }

        const user_participation = await this.user_participations.getByUser(user_email, command.escape_room_id, command.participation_id)

        if(user_participation === undefined){
            return {
                code: 423
            } as GetNextClueResponse
        }

        for (let i = 0 ; i < escape_room.clues.length ; i++){
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