import { CardinalDirections } from "../../domain/model/cardinal_directions.entity";
import { Coordinate } from "../../domain/model/coordinate.entity";
import { DMSData } from "../../domain/model/dms_data.entity";
import { EscapeRoom } from "../../domain/model/escapeRoom.entity";
import { Location } from "../../domain/model/location.entity";
import { Degree } from "../../domain/model/value-objects/degree.entity";
import { Minute } from "../../domain/model/value-objects/minute.entity";
import { Second } from "../../domain/model/value-objects/second.entity";
import { EscapeRoomType } from "./escape_room.type";
import { LocationType } from "./location.type";

const EscapeRoomDataMapper = {
    toModel: (escape_room: EscapeRoomType): EscapeRoom => {
        const coordinate = Coordinate.create(escape_room.location.coordinates)
        if(coordinate !== undefined){
            const location: Location = new Location(
                escape_room.location.id,
                escape_room.location.country,
                escape_room.location.city,
                escape_room.location.street,
                escape_room.location.street_number,
                coordinate,
            )
            return new EscapeRoom(
                escape_room.id,
                escape_room.title,
                escape_room.description,
                escape_room.solution,
                escape_room.difficulty,
                escape_room.price,
                3,
                location
            )
        }
        else{
            const coordinate: Coordinate = new Coordinate(
                new DMSData(
                    new Degree(0),
                    new Minute(0),
                    new Second(0),
                    CardinalDirections.North
                ),
                new DMSData(
                    new Degree(0),
                    new Minute(0),
                    new Second(0),
                    CardinalDirections.North
                )
            )

            const location: Location = new Location(
                escape_room.location.id,
                escape_room.location.country,
                escape_room.location.city,
                escape_room.location.street,
                escape_room.location.street_number,
                coordinate,
            )
            return new EscapeRoom(
                escape_room.id,
                escape_room.title,
                escape_room.description,
                escape_room.solution,
                escape_room.difficulty,
                escape_room.price,
                3,
                location
            )
        }       
    },
    toType: (escape_room: EscapeRoom): EscapeRoomType => ({
        id: escape_room.id,
        title: escape_room.title,
        description: escape_room.description,
        solution: escape_room.solution,
        difficulty: escape_room.difficulty,
        price: escape_room.price,
        location: {
            id: escape_room.location.id,
            coordinates: escape_room.location.coordinates.toString(),
            street: escape_room.location.street,
            street_number: escape_room.location.number,
            other_info: '',
            city: escape_room.location.city,
            country: escape_room.location.country
        } as LocationType
    } as EscapeRoomType)
}

export {EscapeRoomDataMapper}