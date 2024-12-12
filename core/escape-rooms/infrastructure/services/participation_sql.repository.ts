import { Participation } from "../../domain/model/participation.entity";
import { Participations } from "../../domain/services/participation.repository";
import { Client, ClientConfig } from "pg";
import { ParticipationPublisher } from "../persistence/participation.publisher";
import { ParticipationType } from "../persistence/participation.type";
import { ParticipationDataMapper } from "../persistence/participation.data-mapper";
import { EscapeRoomType } from "../persistence/escape_room.type";
import { LocationType } from "../persistence/location.type";
import { SELECT_PARTICIPATION_BY_ID } from "../queries/participations.query";

export class ParticipationsSql implements Participations{
    private readonly _publisher: ParticipationPublisher
    constructor(private readonly postgres_config: ClientConfig){
        this._publisher = new ParticipationPublisher(postgres_config)
    }
    async save(participation: Participation): Promise<boolean> {
        return await this._publisher.create(participation)
    }

    async findById(escape_room_id: number, participation_id: number): Promise<Participation | undefined> {
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query(SELECT_PARTICIPATION_BY_ID, [escape_room_id, participation_id])
        await postgres.end()

        if (response.rowCount === 0) {
            return undefined;
        }

        const participation_data = {
            id: response.rows[0].id,
            escape_room: {
                id: response.rows[0].escape_room,
                title: response.rows[0].title,
                description: response.rows[0].description,
                solution: response.rows[0].solution,
                difficulty: response.rows[0].difficulty,
                price: response.rows[0].price,
                location: {
                    id: response.rows[0].physical_location,
                    coordinates: response.rows[0].coordinates,
                    street: response.rows[0].street,
                    street_number: response.rows[0].street_number,
                    other_info: response.rows[0].other_info,
                    city: response.rows[0].city_name,
                    country: response.rows[0].country_name
                } as LocationType
            } as EscapeRoomType,
            points: (response.rows[0].points) ? response.rows[0].points: undefined,
            start_date: new Date(response.rows[0].start_time),
            end_date: new Date(response.rows[0].end_time)
        } as ParticipationType

        const participation = ParticipationDataMapper.toModel(participation_data);
        
        return participation;
    }
}