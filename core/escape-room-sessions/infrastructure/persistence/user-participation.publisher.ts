import { Client, ClientConfig } from "pg";
import { Publisher } from "../../../commons/domain/publisher/publisher";
import { UserParticipation } from "../../domain/model/user-participation.entity";
import { UserParticipationDataMapper } from "./user-participation.data-mapper";
import { INSERT_USER_PARTICIPATION } from "../queries/user-participation.query";

export class UserParticipationPublisher extends Publisher<UserParticipation>{
    constructor(private readonly postgres: ClientConfig){
        super()
    }

    async create(user_participation: UserParticipation): Promise<boolean> {
        const data = UserParticipationDataMapper.toType(user_participation)

        try {
            const postgres = new Client(this.postgres)
            await postgres.connect()
            const response = await postgres.query(INSERT_USER_PARTICIPATION, [data.user.id, data.participation.id, data.participation.escape_room.id])
            await postgres.end()

            return response.rowCount !== 0
        } catch (error) {
            return false
        }
    }

    async update(user_participation: UserParticipation, version: number): Promise<boolean> {
        return false
    }
}