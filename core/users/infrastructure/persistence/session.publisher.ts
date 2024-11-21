import { Publisher } from "../../../commons/domain/publisher/publisher";
import { ClientConfig, Client } from 'pg'
import { Session } from "../../domain/model/session.entity";
import { SessionDataMapper } from "./session.data-mapper";
import { INSERT_SESSION } from "../queries/sessions.query";

export class SessionPublisher extends Publisher<Session>{
    constructor(private readonly postgres_config: ClientConfig) {
        super()
    }
    async create(session: Session): Promise<boolean>{
        const data = SessionDataMapper.toType(session)
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(INSERT_SESSION, [session.date, session.user.id])
            
            return (response.rowCount !== 0)
        } catch (error) {
            return false
        }
        
    }
    async update(session: Session): Promise<boolean>{
        return false   
    }
}