import { Participation } from "../../domain/model/participation.entity";
import { Participations } from "../../domain/services/participation.repository";
import { Client, ClientConfig } from "pg";
import { ParticipationPublisher } from "../persistence/participation.publisher";
import { ParticipationType } from "../persistence/participation.type";
import { ParticipationDataMapper } from "../persistence/participation.data-mapper";
import { EscapeRoomType } from "../persistence/escape_room.type";
import { LocationType } from "../persistence/location.type";
import { SELECT_PARTICIPATION_BY_ESCAPE_ROOM, SELECT_PARTICIPATION_BY_ID } from "../queries/participations.query";
import { EscapeRoom } from "../../domain/model/escapeRoom.entity";
import { EscapeRoomsSql } from "./escape_rooms_sql.repository";

export class ParticipationsSql implements Participations{
    private readonly _publisher: ParticipationPublisher
    constructor(private readonly postgres_config: ClientConfig){
        this._publisher = new ParticipationPublisher(postgres_config)
    }
    async save(participation: Participation): Promise<boolean> {
        return await this._publisher.create(participation)
    }

    async findAllByEscapeRoom(escape_room_id: number): Promise<Array<Participation>>{
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query(SELECT_PARTICIPATION_BY_ESCAPE_ROOM, [escape_room_id])
        await postgres.end()

        const participations: Array<Participation> = []

        if(response.rowCount === 0){
            return participations
        }

        response.rows.forEach(participation => {
            const participation_data = {
                id: participation.id,
                escape_room: {
                    id: participation.escape_room,
                    title: participation.title,
                    description: participation.description,
                    solution: participation.solution,
                    difficulty: participation.difficulty,
                    price: participation.price,
                    location: {
                        id: participation.physical_location,
                        coordinates: participation.coordinates,
                        street: participation.street,
                        street_number: participation.street_number,
                        other_info: participation.other_info,
                        city: participation.city_name,
                        country: participation.country_name
                    } as LocationType
                } as EscapeRoomType,
                points: (participation.points) ? participation.points: undefined,
                start_date: new Date(participation.start_time),
                end_date: new Date(participation.end_time)
            } as ParticipationType

            participations.push(ParticipationDataMapper.toModel(participation_data))
        });
   
        return participations;
    }

    async findById(escape_room_id: number, participation_id: number): Promise<Participation | undefined> {
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(SELECT_PARTICIPATION_BY_ID, [participation_id, escape_room_id])
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
        } catch (error) {
            return undefined
        }
    }
}