import { EscapeRooms } from "../../escape-rooms/domain/services/escape_rooms.repository";
import { Participations } from "../../escape-rooms/domain/services/participation.repository";
import { Email } from "../../users/domain/model/value-objects/email";
import { UserParticipations } from "../domain/services/user-participations.repository";
import { GetClueRequest } from "../dto/requests/get-clue.request";
import { GetClueResponse } from "../dto/responses/get-clue.response";

export class GetClueUseCase{
    constructor(private readonly escape_rooms: EscapeRooms, private readonly participations: Participations, private readonly user_participations: UserParticipations){}

    async with(command: GetClueRequest): Promise<GetClueResponse>{
        const participation = await this.participations.findById(command.escape_room_id, command.participation_id)

        if(participation === undefined){
            return {
                code: 404
            } as GetClueResponse
        }
    
        const now = Date.now()

        if(participation.start_date.getTime() > now || participation.end_date.getTime() < now){
            return {
                code: 423,
            } as GetClueResponse
        }

        const user_email = Email.create(command.user_email)

        if(user_email === undefined){
            return {
                code: 400
            } as GetClueResponse
        }

        const user_participation = await this.user_participations.getByUser(user_email, command.escape_room_id, command.participation_id)

        if(user_participation === undefined){
            return {
                code: 423
            } as GetClueResponse
        }

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