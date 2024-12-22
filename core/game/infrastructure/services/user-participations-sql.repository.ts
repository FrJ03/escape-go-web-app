import { Client, ClientConfig } from "pg";
import { UserParticipation } from "../../domain/model/user-participation.entity";
import { UserParticipations } from "../../domain/services/user-participations.repository";
import { UserParticipationPublisher } from "../persistence/user-participation.publisher";
import { SELECT_ALL, SELECT_ALL_BY_PARTICIPATION } from "../queries/user-participation.query";
import { UserParticipationDataMapper } from "../persistence/user-participation.data-mapper";

export class UserParticipationsSql implements UserParticipations{
    private readonly _publisher: UserParticipationPublisher

    constructor(private readonly postgres_config: ClientConfig){
        this._publisher = new UserParticipationPublisher(postgres_config)
    }
    async save(user_participation: UserParticipation): Promise<Boolean> {
        return await this._publisher.create(user_participation)
    }
    async getAllByParticipation(participation_id: number, escape_room_id: number): Promise<Array<UserParticipation>>{
        const postgres = new Client(this.postgres_config)
        postgres.connect()
        const response = await postgres.query(SELECT_ALL_BY_PARTICIPATION, [participation_id, escape_room_id])
        postgres.end()

        const users_participations:Array<UserParticipation> = []

        if(response.rowCount === 0){
            return users_participations
        }

        for (let i = 0 ; i < response.rows.length ; i++){
            users_participations.push(UserParticipationDataMapper.toModel({
                user:{
                    id: response.rows[i].participant,
                    email: response.rows[i].email,
                    username: response.rows[i].username,
                    password: response.rows[i].passwd,
                    role: response.rows[i].role,
                    points: response.rows[i].user_points
                },
                participation:{
                    id: response.rows[i].participation,
                    escape_room: {
                        id: response.rows[i].escape_room,
                        title: response.rows[i].title,
                        description: response.rows[i].description,
                        solution: response.rows[i].solution,
                        difficulty: response.rows[i].difficulty,
                        price: response.rows[i].price,
                        location: {
                            id: response.rows[i].physical_location,
                            coordinates: response.rows[i].coordinates,
                            street: response.rows[i].street,
                            street_number: response.rows[i].street_number,
                            other_info: response.rows[i].other_info,
                            city: response.rows[i].city_name,
                            country: response.rows[i].country_name
                        }
                    },
                    points: (response.rows[i].points) ? response.rows[i].points: undefined,
                    start_date: new Date(response.rows[i].start_time),
                    end_date: new Date(response.rows[i].end_time)
                }
            }))
        }

        return users_participations
    }
    async getAll(): Promise<Array<UserParticipation>>{
        const postgres = new Client(this.postgres_config)
        postgres.connect()
        const response = await postgres.query(SELECT_ALL)
        postgres.end()

        const users_participations:Array<UserParticipation> = []

        if(response.rowCount === 0){
            return users_participations
        }

        for (let i = 0 ; i < response.rows.length ; i++){
            users_participations.push(UserParticipationDataMapper.toModel({
                user:{
                    id: response.rows[i].participant,
                    email: response.rows[i].email,
                    username: response.rows[i].username,
                    password: response.rows[i].passwd,
                    role: response.rows[i].role,
                    points: response.rows[i].user_points
                },
                participation:{
                    id: response.rows[i].participation,
                    escape_room: {
                        id: response.rows[i].escape_room,
                        title: response.rows[i].title,
                        description: response.rows[i].description,
                        solution: response.rows[i].solution,
                        difficulty: response.rows[i].difficulty,
                        price: response.rows[i].price,
                        location: {
                            id: response.rows[i].physical_location,
                            coordinates: response.rows[i].coordinates,
                            street: response.rows[i].street,
                            street_number: response.rows[i].street_number,
                            other_info: response.rows[i].other_info,
                            city: response.rows[i].city_name,
                            country: response.rows[i].country_name
                        }
                    },
                    points: (response.rows[i].points) ? response.rows[i].points: undefined,
                    start_date: new Date(response.rows[i].start_time),
                    end_date: new Date(response.rows[i].end_time)
                }
            }))
        }

        return users_participations
    }
}