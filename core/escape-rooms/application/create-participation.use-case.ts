import { Participation } from "../domain/model/participation.entity";
import { EscapeRooms } from "../domain/services/escape_rooms.repository";
import { Participations } from "../domain/services/participation.repository";
import { CreateParticipationResponse } from "../dto/responses/create-participation.response";
import { CreateParticipationRequest } from "../dto/resquests/create-participation.request";

export class CreateParticipationUseCase{
    constructor(private readonly escape_rooms: EscapeRooms, private readonly participations: Participations){}

    async with(command: CreateParticipationRequest): Promise<CreateParticipationResponse>{
        const start_date_number = Date.parse(command.start_date)
        if (isNaN(start_date_number)){
            return {
                code: 400
            } as CreateParticipationResponse
        }
        const start_date = new Date(start_date_number)

        const end_date_number = Date.parse(command.end_date)
        if(isNaN(end_date_number)){
            return {
                code: 400
            } as CreateParticipationResponse
        }
        const end_date = new Date(end_date_number)

        const escape_room = await this.escape_rooms.findById(command.escape_room_id)

        if(escape_room === undefined){
            return {
                code:404
            } as CreateParticipationResponse
        }

        const participation = Participation.create(1, escape_room, start_date, end_date, undefined)

        if(participation === undefined){
            return {
                code: 400
            } as CreateParticipationResponse
        }

        const response = await this.participations.save(participation)

        if(response){
            return {
                code: 200
            } as CreateParticipationResponse
        }
        else{
            return {
                code: 400
            } as CreateParticipationResponse
        }
    }
}