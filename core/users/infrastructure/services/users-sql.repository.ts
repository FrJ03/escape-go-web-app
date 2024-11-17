import { NotFoundError } from "../../../commons/domain/errors/not-found.error";
import { Users } from "../../domain/services/users.repository";
import { UserPublisher } from "../persistence/user.publisher";
import { User } from "../../domain/model/user.entity"
import { ClientConfig, Client } from 'pg'
import { UserType } from "../persistence/user.type";
import UserDataMapper from "../persistence/user.data-mapper";
import { FIND_USER_BY_EMAIL, FIND_USER_BY_USERNAME } from "../queries/users.query";
import { Email } from "../../domain/model/value-objects/email";

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
}