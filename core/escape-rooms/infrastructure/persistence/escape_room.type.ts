import { LocationType } from "./location.type"

export type EscapeRoomType = {
    id: number,
    title: string,
    description: string,
    solution: string,
    difficulty: number,
    price: number,
    location: LocationType
}