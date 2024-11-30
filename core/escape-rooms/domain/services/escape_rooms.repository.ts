import { EscapeRoom } from "../model/escapeRoom.entity";

export interface EscapeRooms{
    save(escape_room: EscapeRoom): Promise<boolean>
}