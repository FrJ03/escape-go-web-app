import { Participation } from "../model/participation.entity";

export interface Participations{
    save(participation: Participation): Promise<boolean>
}