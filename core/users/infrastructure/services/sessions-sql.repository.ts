import { Client, ClientConfig } from "pg";
import { Sessions } from "../../domain/services/sessions.repository";
import { Session } from "../../domain/model/session.entity";
import { UsersSql } from "./users-sql.repository";
import { GET_ALL_SESSIONS, GET_SESSIONS_BY_USER } from "../queries/sessions.query";
import { SessionDataMapper } from "../persistence/session.data-mapper";
import { SessionType } from "../persistence/session.type";
import { UserType } from "../persistence/user.type";
import { User } from "../../domain/model/user.entity";
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client";
import { SessionPublisher } from "../persistence/session.publisher";

export class SessionsSql implements Sessions{
    private publisher: SessionPublisher

    constructor(private readonly postgres_config: ClientConfig){
        this.publisher = new SessionPublisher(postgres_config)
    }
    async getAll(): Promise<Array<Session>> {
        const postgres = new Client(this.postgres_config)

        await postgres.connect()
        const response = await postgres.query(GET_ALL_SESSIONS)
        await postgres.end()

        const sessions: Array<Session> = []

        console.error(response.rows[0])

        response.rows.forEach(session => 
            sessions.push(
                SessionDataMapper.toModel({
                    id: session.id,
                    date: new Date(session.session_date),
                    user: {
                        id: session.user_logued,
                        email: session.email,
                        username: session.username,
                        password: session.passwd,
                        role: session.user_role,
                        points: session.points
                    } as UserType
                } as SessionType) 
            )   
        )

        return sessions
    }

    async getByUser(user: User): Promise<Session[]> {
        const postgres = new Client(this.postgres_config)

        await postgres.connect()
        const response = await postgres.query(GET_SESSIONS_BY_USER, [user.id])
        await postgres.end()

        const sessions: Array<Session> = []

        console.error(response.rows[0])

        response.rows.forEach(session => 
            sessions.push(
                SessionDataMapper.toModel({
                    id: session.id,
                    date: new Date(session.session_date),
                    user: {
                        id: session.user_logued,
                        email: session.email,
                        username: session.username,
                        password: session.passwd,
                        role: session.user_role,
                        points: session.points
                    } as UserType
                } as SessionType) 
            )   
        )

        return sessions
    }

    async save(session: Session): Promise<boolean> {
        const users = new UsersSql(PostgresSqlConfig)

        const user = await users.findUserByEmail(session.user.email)

        if(user === undefined){
            return false
        }
        else{
            session.user.id = user.id
            
            return await this.publisher.create(session)
        }  
    }
}