import { EscapeRoomType } from "./escape_room.type"

export type ParticipationType = {
    id: number
    points: number | undefined,
    start_date: Date,
    end_date: Date,
    escape_room: EscapeRoomType,
}