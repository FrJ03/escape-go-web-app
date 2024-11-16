import { Publisher } from "../../../commons/domain/publisher/publisher";
import { User } from "../../domain/model/user.entity"
import { Client } from 'pg'
import UserDataMapper from "./user.data-mapper";
import { ApplicationError } from "../../../commons/domain/errors/application.error";

export class UserPublisher extends Publisher<User>{
    constructor(private readonly postgres: Client) {
        super()
    }
    async create(user: User): Promise<void>{
        const data = UserDataMapper.toType(user)

        try {
            await this.postgres.connect()
            await this.postgres.query('INSERT INTO users (email, username, password, user_role, points) VALUES ($1, $2, $3, $4, $5)', [data.email, data.username, data.password, data.role, data.points])
            await this.postgres.end()
        } catch (error) {
            throw new ApplicationError((error as Error).toString())
        }
        
    }
    async update(user: User): Promise<void>{
        
    }
}