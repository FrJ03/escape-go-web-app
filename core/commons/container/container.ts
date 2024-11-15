import { UsersSql } from "../../users/infrastructure/services/users-sql.repository"
import PostgresSqlClient from "../infrastructure/database-client/postgresql-client"

const Container = {
    init: () => {
        const users = new UsersSql(PostgresSqlClient)

        return {
            
        }
    }
}

export const container = Container.init()