import { Clue } from "../model/clue.entity";
import { Coordinate } from "../model/coordinate.entity";
import { EscapeRoom } from "../model/escapeRoom.entity";

export interface EscapeRooms{
    save(escape_room: EscapeRoom): Promise<boolean>
    saveClue(clue: Clue, escape_room_id: number): Promise<Boolean>
    getAll(): Promise<Array<EscapeRoom>>
    getClueById(clue_id: number, escape_room_id: number):  Promise<Clue | undefined>
    getAllByDistance(coordinate: Coordinate): Promise<Array<EscapeRoom>>
    findById(id: number): Promise<EscapeRoom | undefined>;
    delete(id: number): Promise<boolean>;
    update(escape_room: EscapeRoom): Promise<boolean>;
}