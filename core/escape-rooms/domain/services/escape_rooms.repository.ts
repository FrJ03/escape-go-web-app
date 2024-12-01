import { Coordinate } from "../model/coordinate.entity";
import { EscapeRoom } from "../model/escapeRoom.entity";

export interface EscapeRooms{
    save(escape_room: EscapeRoom): Promise<boolean>
    getAllByDistance(coordinate: Coordinate): Promise<Array<EscapeRoom>>
}