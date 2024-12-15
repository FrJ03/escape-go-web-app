import { Coordinate } from "../model/coordinate.entity";
import { EscapeRoom } from "../model/escapeRoom.entity";

export interface EscapeRooms{
    save(escape_room: EscapeRoom): Promise<boolean>
    getAll(): Promise<Array<EscapeRoom>>
    getAllByDistance(coordinate: Coordinate): Promise<Array<EscapeRoom>>
    findById(id: number): Promise<EscapeRoom | undefined>;
    delete(id: number): Promise<boolean>;
}