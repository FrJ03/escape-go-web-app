import { UsersSql } from "../../users/infrastructure/services/users-sql.repository"
import PostgresSqlClient from "../infrastructure/database-client/postgresql-client"
import { SignUpUserUseCase } from '../../users/application/signup-user.use-case';

const Container = {
    init: () => {
        const users = new UsersSql(PostgresSqlClient)

        return {
            
            signUpUser: new SignUpUserUseCase(users),

        }
    }
}

export const container = Container.init()