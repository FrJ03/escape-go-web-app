import { ClientConfig } from "pg";
import { EscapeRooms } from "../../domain/services/escape_rooms.repository";
import { EscapeRoomPublisher } from "../persistence/escape_room.publisher";
import { EscapeRoom } from "../../domain/model/escapeRoom.entity";
import { LocationType } from "../persistence/location.type";
import { EscapeRoomType } from "../persistence/escape_room.type";
import { EscapeRoomDataMapper } from "../persistence/escape_room.data-mapper";
import PostgresSqlClient from '../../../commons/infrastructure/database-client/postgresql-client'

export class EscapeRoomsSql implements EscapeRooms{

    private readonly _publisher: EscapeRoomPublisher

    constructor(private readonly postgres_config: ClientConfig){
        this._publisher = new EscapeRoomPublisher(postgres_config)
    }

    async save(escape_room: EscapeRoom): Promise<boolean> {
        return await this._publisher.create(escape_room)
    }
}