import { Client, ClientConfig } from "pg";
import { UserParticipation } from "../../domain/model/user-participation.entity";
import { UserParticipations } from "../../domain/services/user-participations.repository";
import { UserParticipationPublisher } from "../persistence/user-participation.publisher";
import { SELECT_ALL, SELECT_ALL_BY_PARTICIPATION, SELECT_ALL_BY_USER, SELECT_BY_USER } from "../queries/user-participation.query";
import { UserParticipationDataMapper } from "../persistence/user-participation.data-mapper";
import { Email } from "../../../users/domain/model/value-objects/email";

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
    async getAllByUser(user_email: Email): Promise<UserParticipation[]> {
        const postgres = new Client(this.postgres_config)
        postgres.connect()
        const response = await postgres.query(SELECT_ALL_BY_USER, [user_email.value])
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
                    start_date: new Date(Number(response.rows[i].start_time)),
                    end_date: new Date(Number(response.rows[i].end_time))
                }
            }))
        }

        return users_participations
    }
    async getByUser(user_email: Email, escape_room_id: number, participation_id: number): Promise<UserParticipation | undefined> {
        const postgres = new Client(this.postgres_config)
        postgres.connect()
        const response = await postgres.query(SELECT_BY_USER, [user_email.value, escape_room_id, participation_id])
        postgres.end()


        if(response.rowCount !== 0){
            return UserParticipationDataMapper.toModel({
                user:{
                    id: response.rows[0].participant,
                    email: response.rows[0].email,
                    username: response.rows[0].username,
                    password: response.rows[0].passwd,
                    role: response.rows[0].role,
                    points: response.rows[0].user_points
                },
                participation:{
                    id: response.rows[0].participation,
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
                        }
                    },
                    points: (response.rows[0].points) ? response.rows[0].points: undefined,
                    start_date: new Date(Number(response.rows[0].start_time)),
                    end_date: new Date(Number(response.rows[0].end_time))
                }
            })
        }
        else {
            return undefined
        }
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