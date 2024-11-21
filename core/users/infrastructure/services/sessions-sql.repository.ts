import { Client, ClientConfig } from "pg";
import { Sessions } from "../../domain/services/sessions.repository";
import { Session } from "../../domain/model/session.entity";
import { UsersSql } from "./users-sql.repository";
import { GET_ALL_SESSIONS } from "../queries/sessions.query";
import { SessionDataMapper } from "../persistence/session.data-mapper";
import { SessionType } from "../persistence/session.type";
import { UserType } from "../persistence/user.type";

export class SessionsSql implements Sessions{
    constructor(private readonly postgres_config: ClientConfig){

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
}