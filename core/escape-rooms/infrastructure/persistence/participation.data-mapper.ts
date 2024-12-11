import { Participation } from "../../domain/model/participation.entity";
import { EscapeRoomDataMapper } from "./escape_room.data-mapper";
import { ParticipationType } from "./participation.type";

const ParticipationDataMapper = {
    toModel: (participation: ParticipationType): Participation => {
        return new Participation(
            participation.id,
            EscapeRoomDataMapper.toModel(participation.escape_room),
            participation.start_date,
            participation.end_date,
            participation.points
        )
    },
    toType: (participation: Participation): ParticipationType => ({
        id: participation.id,
        escape_room: EscapeRoomDataMapper.toType(participation.escape_room),
        start_date: participation.start_date,
        end_date: participation.end_date,
        points: participation.points
    } as ParticipationType)
}

export {ParticipationDataMapper}