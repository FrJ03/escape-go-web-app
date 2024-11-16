import { Publisher } from "../../../commons/domain/publisher/publisher";
import { User } from "../../domain/model/user.entity"
import { ClientConfig, Client } from 'pg'
import UserDataMapper from "./user.data-mapper";
import { ApplicationError } from "../../../commons/domain/errors/application.error";

export class UserPublisher extends Publisher<User>{
    constructor(private readonly postgres_config: ClientConfig) {
        super()
    }
    async create(user: User): Promise<boolean>{
        const data = UserDataMapper.toType(user)
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query('INSERT INTO users (email, username, passwd, user_role, points) VALUES ($1, $2, $3, $4, $5)', [data.email, data.username, data.password, data.role, data.points])
            
            return true
        } catch (error) {
            return false
        }
        
    }
    async update(user: User): Promise<boolean>{
        return false   
    }
}