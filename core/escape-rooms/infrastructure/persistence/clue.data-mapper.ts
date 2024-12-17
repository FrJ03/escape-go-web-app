import { Clue } from "../../domain/model/clue.entity";
import { ClueType } from "./clue.type"

const ClueDataMapper = {
    toModel: (clue: ClueType): Clue => (
        new Clue(
            clue.id,
            clue.title,
            clue.info
        )
    ),
    toType: (clue: Clue, escape_room_id: number): ClueType => ({
        id: clue.id,
        escape_room: escape_room_id,
        title: clue.title,
        info: clue.info
    })
}

export {ClueDataMapper}