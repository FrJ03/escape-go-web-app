import { ClientConfig } from "pg";
import { UserParticipation } from "../../domain/model/user-participation.entity";
import { UserParticipations } from "../../domain/services/user-participations.repository";
import { UserParticipationPublisher } from "../persistence/user-participation.publisher";

export class UserParticipationsSql implements UserParticipations{
    private readonly _publisher: UserParticipationPublisher

    constructor(private readonly postgres_config: ClientConfig){
        this._publisher = new UserParticipationPublisher(postgres_config)
    }
    async save(user_participation: UserParticipation): Promise<Boolean> {
        return await this._publisher.create(user_participation)
    }
}