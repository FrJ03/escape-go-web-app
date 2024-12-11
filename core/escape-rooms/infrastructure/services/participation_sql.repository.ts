import { Participation } from "../../domain/model/participation.entity";
import { Participations } from "../../domain/services/participation.repository";
import { ClientConfig } from "pg";
import { ParticipationPublisher } from "../persistence/participation.publisher";

export class ParticipationsSql implements Participations{
    private readonly _publisher: ParticipationPublisher
    constructor(private readonly postgres_config: ClientConfig){
        this._publisher = new ParticipationPublisher(postgres_config)
    }
    async save(participation: Participation): Promise<boolean> {
        return await this._publisher.create(participation)
    }
}