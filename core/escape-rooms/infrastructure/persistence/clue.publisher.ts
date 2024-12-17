import { Client, ClientConfig, Query, QueryResult } from "pg";
import { Publisher } from "../../../commons/domain/publisher/publisher";
import { EscapeRoom } from "../../domain/model/escapeRoom.entity";
import { EscapeRoomDataMapper } from "./escape_room.data-mapper";
import { INSERT_CITY, INSERT_COUNTRY, INSERT_ESCAPE_ROOM, INSERT_LOCATION, SELECT_CITY_BY_NAME, SELECT_COUNTRY_BY_NAME, SELECT_LOCATION } from "../queries/escape_rooms.query";
import { CountryType } from "./country.type";
import { CityType } from "./city.type";
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client";
import { Clue } from "../../domain/model/clue.entity";
import { ClueDataMapper } from "./clue.data-mapper";
import { INSERT_CLUE } from "../queries/clues.query";

export class CluePublisher{
    constructor(private readonly postgres_config: ClientConfig){}
    
    async create(clue: Clue, escape_room_id: number): Promise<boolean>{
        const data = ClueDataMapper.toType(clue, escape_room_id)
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(INSERT_CLUE, [data.escape_room, data.title, data.info])
            await postgres.end()

            return (response.rowCount !== 0)
        } catch (error) {
            return false
        }
    }
    async update(clue: Clue, escape_room_id: number): Promise<boolean>{
        return false
    }
}