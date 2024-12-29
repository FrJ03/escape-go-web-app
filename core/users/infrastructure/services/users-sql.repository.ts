import { NotFoundError } from "../../../commons/domain/errors/not-found.error";
import { Users } from "../../domain/services/users.repository";
import { UserPublisher } from "../persistence/user.publisher";
import { User } from "../../domain/model/user.entity"
import { ClientConfig, Client } from 'pg'
import { UserType } from "../persistence/user.type";
import UserDataMapper from "../persistence/user.data-mapper";
import { DELETE_USER, FIND_USER_BY_EMAIL, FIND_USER_BY_ID, FIND_USER_BY_USERNAME, GET_ALL_PARTICIPANTS, GET_ALL_USERS, GET_RANKING, UPDATE_PROFILE } from "../queries/users.query";
import { Email } from "../../domain/model/value-objects/email";
import { Participant } from "../../domain/model/participant.entity";
import { DELETE_SESSIONS_BY_USER } from "../queries/sessions.query";

export class UsersSql implements Users {
    private publisher: UserPublisher

    constructor(private readonly postgres_config: ClientConfig){
        this.publisher = new UserPublisher(postgres_config)
    }

    async save(user: User): Promise<boolean>{
        if(await this.findUserByEmail(user.email) != undefined){
            return false
        }
        else{
            return await this.publisher.create(user)
        }   
    }
    async findUserByEmail(email: Email): Promise<User | undefined>{
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query(FIND_USER_BY_EMAIL, [email.value])
        await postgres.end()
        if(response.rowCount != 0){
            const data = {
                id: response.rows[0].id,
                email: response.rows[0].email,
                username: response.rows[0].username,
                password: response.rows[0].passwd,
                role: response.rows[0].user_role,
                points: response.rows[0].points
            } as UserType

            return UserDataMapper.toModel(data)
        }
        else{
            return undefined
        }
    }
    async findUserByUsername(username: string): Promise<User | undefined>{
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query(FIND_USER_BY_USERNAME, [username])
        await postgres.end()
        if(response.rowCount != 0){
            const data = {
                id: response.rows[0].id,
                email: response.rows[0].email,
                username: response.rows[0].username,
                password: response.rows[0].passwd,
                role: response.rows[0].user_role,
                points: response.rows[0].points
            } as UserType

            return UserDataMapper.toModel(data)
        }
        else{
            return undefined
        }
    }

    async delete(user_id: number): Promise<boolean> {
        try {
            const postgres = new Client(this.postgres_config)

            await postgres.connect()
            await postgres.query(DELETE_SESSIONS_BY_USER, [user_id])
            const response = await postgres.query(DELETE_USER, [user_id])
            await postgres.end()

            return (response.rowCount !== 0)
        } catch (error) {
            return false
        }
        
    }
    async getAll(): Promise<Array<User>>{
        const postgres = new Client(this.postgres_config)

        await postgres.connect()
        const response = await postgres.query(GET_ALL_USERS)
        await postgres.end()

        const users: Array<User> = []

        response.rows.forEach(user => 
            users.push(
                UserDataMapper.toModel({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    password: user.passwd,
                    role: user.user_role,
                    points: user.points
                } as UserType)
            )
        )

        return users
    }

    async getAllParticipants(): Promise<Array<User>>{
        const postgres = new Client(this.postgres_config)

        await postgres.connect()
        const response = await postgres.query(GET_ALL_PARTICIPANTS)
        await postgres.end()

        const users: Array<User> = []

        response.rows.forEach(user => 
            users.push(
                UserDataMapper.toModel({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    password: user.passwd,
                    role: user.user_role,
                    points: user.points
                } as UserType)
            )
        )

        return users
    }

    async addPoints(user_id: number, points: number): Promise<boolean> {
        const postgres = new Client(this.postgres_config)

        postgres.connect()
        const user_response = await postgres.query(FIND_USER_BY_ID, [user_id])
        postgres.end()

        if(user_response.rowCount === 0){
            return false
        }

        const updated_user = UserDataMapper.toModel({
            id: user_response.rows[0].id,
            username: user_response.rows[0].username,
            email: user_response.rows[0].email,
            role: user_response.rows[0].role,
            password: user_response.rows[0].passwd,
            points: user_response.rows[0].points + points
        })

        return await this.publisher.update(updated_user)
    }
    async getRanking(n_users: number): Promise<Array<Participant>> {
        const postgres = new Client(this.postgres_config)

        await postgres.connect()
        const response = await postgres.query(GET_RANKING, [n_users])
        await postgres.end()

        const users: Array<Participant> = []

        response.rows.forEach(user => {
            const u =  UserDataMapper.toModel({
                id: user.id,
                email: user.email,
                username: user.username,
                password: user.passwd,
                role: user.user_role,
                points: user.points
            } as UserType)
            if(u instanceof Participant){
                users.push(u)
            }
        })

        return users
    }

    async updateProfile(user: User): Promise<boolean> {
        const postgres = new Client(this.postgres_config);
        await postgres.connect();

        const emailValue = typeof user.email === 'object' && 'value' in user.email 
        ? user.email.value 
        : user.email;
        const response = await postgres.query(UPDATE_PROFILE, [user.id, emailValue, user.username, user.password]);
        await postgres.end();

        return response.rowCount ? true : false;
    }
}