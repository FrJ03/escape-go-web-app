import { Client, ClientConfig, Query, QueryResult } from "pg";
import { Clue } from "../../domain/model/clue.entity";
import { ClueDataMapper } from "./clue.data-mapper";
import { INSERT_CLUE } from "../queries/clues.query";

export class CluePublisher{
    constructor(private readonly postgres_config: ClientConfig){}
    
    async create(clue: Clue, escape_room_id: number): Promise<boolean>{
        const data = ClueDataMapper.toType(clue, escape_room_id)
        console.log(data)
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(INSERT_CLUE, [data.escape_room, data.title, data.info])
            await postgres.end()

            console.log(response.rowCount)

            return (response.rowCount !== 0)
        } catch (error) {
            console.log(error)
            return false
        }
    }
    async update(clue: Clue, escape_room_id: number): Promise<boolean>{
        return false
    }
}