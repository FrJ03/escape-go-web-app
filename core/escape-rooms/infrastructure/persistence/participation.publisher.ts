import { Client, ClientConfig } from "pg";
import { Publisher } from "../../../commons/domain/publisher/publisher";
import { Participation } from "../../domain/model/participation.entity";
import { ParticipationDataMapper } from "./participation.data-mapper";
import { INSERT_PARTICIPATION, UPDATE_PARTICIPATION } from "../queries/participations.query";

export class ParticipationPublisher extends Publisher<Participation>{
    constructor(private readonly postgres_config: ClientConfig){
        super()
    }
    async create(participantion: Participation): Promise<boolean> {
        const data = ParticipationDataMapper.toType(participantion)
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(INSERT_PARTICIPATION, [data.escape_room.id, data.start_date.getTime(), data.end_date.getTime(), data.points])
            await postgres.end()

            return response.rowCount !== 0
        } catch (error) {
            return false
        }
    }
    async update(participation: Participation): Promise<boolean> {
        const data = ParticipationDataMapper.toType(participation)

        try{
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(UPDATE_PARTICIPATION, [data.id, data.start_date.getTime(), data.end_date.getTime(), data.points])
            await postgres.end()

            return response.rowCount !== 0
        } catch (error) {
            console.error(error)
            return false
        }
    }
}