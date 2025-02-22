import { Publisher } from "../../../commons/domain/publisher/publisher";
import { User } from "../../domain/model/user.entity"
import { ClientConfig, Client } from 'pg'
import UserDataMapper from "./user.data-mapper";
import { INSERT_USER, UPDATE_USER } from '../queries/users.query'

export class UserPublisher extends Publisher<User>{
    constructor(private readonly postgres_config: ClientConfig) {
        super()
    }
    async create(user: User): Promise<boolean>{
        const data = UserDataMapper.toType(user)
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(INSERT_USER, [data.email, data.username, data.password, data.role, data.points])
            await postgres.end()
            
            return (response.rowCount !== 0)
        } catch (error) {
            return false
        }
        
    }
    async update(user: User): Promise<boolean>{
        const data = UserDataMapper.toType(user)
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(UPDATE_USER, [data.id, data.email, data.username, data.password, data.points])
            await postgres.end()
            
            return (response.rowCount !== 0)
        } catch (error) {
            return false
        }
    }
}