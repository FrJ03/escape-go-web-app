import { Participation } from "../model/participation.entity";

export interface Participations{
    save(participation: Participation): Promise<boolean>
    modify_points(participation_id: number, escape_room_id: number, new_points: number): Promise<boolean>
    findById(escape_room_id: number, participation_id: number): Promise<Participation | undefined>
}