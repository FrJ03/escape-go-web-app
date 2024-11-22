import { UsersSql } from "../../users/infrastructure/services/users-sql.repository"
import PostgresSqlClient from "../infrastructure/database-client/postgresql-client"
import { SignUpUserUseCase } from '../../users/application/signup-user.use-case';
import { LoginUserUseCase } from '../../users/application/login-user.use-case';
import { CheckUserRoleUseCase } from "../../users/application/check-user-role.use-case";

const Container = {
    init: () => {
        const users = new UsersSql(PostgresSqlClient)

        return {
            
            signUpUser: new SignUpUserUseCase(users),
            loginUser: new LoginUserUseCase(users),
            checkUserRole: new CheckUserRoleUseCase(users)

        }
    }
}

export const container = Container.init()