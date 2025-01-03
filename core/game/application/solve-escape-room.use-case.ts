import { Participations } from "../../escape-rooms/domain/services/participation.repository";
import { Email } from "../../users/domain/model/value-objects/email";
import { Users } from "../../users/domain/services/users.repository";
import { UserParticipations } from "../domain/services/user-participations.repository";
import { SolveEscapeRoomRequest } from "../dto/requests/solve-escape-room.request";
import { SolveEscapeRoomResponse } from "../dto/responses/solve-escape-room.response";

export class SolveEscapeRoomUseCase{
    constructor(private readonly users: Users, private readonly userparticipations: UserParticipations, private readonly participations: Participations){}

    async with(command: SolveEscapeRoomRequest): Promise<SolveEscapeRoomResponse>{
        const participation = await this.participations.findById(command.escape_room_id, command.participation_id)

        if(participation === undefined){
            return {
                points: -1,
                code: 404
            }
        }
    
        const now = Date.now()

        if(participation.start_date.getTime() > now || participation.end_date.getTime() < now){
            return {
                code: 423,
                points: -1
            }
        }

        const user_email = Email.create(command.user_email)

        if(user_email === undefined){
            return {
                code: 400
            } as SolveEscapeRoomResponse
        }

        const user_participation = await this.userparticipations.getByUser(user_email, command.escape_room_id, command.participation_id)

        if(user_participation === undefined){
            return {
                code: 423
            } as SolveEscapeRoomResponse
        }

        if(participation.escape_room.solution.toLowerCase() === command.solution.toLowerCase()){
            const points = this._calc_points(
                now,
                participation.start_date.getTime(),
                participation.end_date.getTime(),
                participation.escape_room.difficulty
            )

            this.participations.modify_points(participation.id, participation.escape_room.id, points)

            const users_participations = await this.userparticipations.getAllByParticipation(participation.id, participation.escape_room.id)

            for(let i = 0 ; i < users_participations.length ; i++){
                await this.users.addPoints(users_participations[i].user.id, points)
            }

            return {
                code: 200,
                points: points
            }
        }
        else{
            return {
                code: 400,
                points: -1
            }
        }
    }

    _calc_points(now: number, start: number, end: number, difficulty: number): number{
        const duration = end - start
        return Math.trunc((now - start) / duration * 50 * difficulty)
    }
}