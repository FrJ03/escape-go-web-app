import { UsersSql } from "../../users/infrastructure/services/users-sql.repository"
import PostgresSqlClient from "../infrastructure/database-client/postgresql-client"
import { SignUpUserUseCase } from '../../users/application/signup-user.use-case';
import { LoginUserUseCase } from '../../users/application/login-user.use-case';
import { CheckUserRoleUseCase } from "../../users/application/check-user-role.use-case";
import { DeleteUserUseCase } from '../../users/application/delete-user.use-case';
import { SessionsSql } from '../../users/infrastructure/services/sessions-sql.repository';
import { CreateEscapeRoomUseCase } from "../../escape-rooms/application/create-escape-room.use-case";
import { EscapeRoomsSql } from "../../escape-rooms/infrastructure/services/escape_rooms_sql.repository";
import PostgresSqlConfig from "../infrastructure/database-client/postgresql-client";

const Container = {
    init: () => {
        const users = new UsersSql(PostgresSqlClient)
        const sessions = new SessionsSql(PostgresSqlClient);
        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)

        return {
            signUpUser: new SignUpUserUseCase(users, sessions),
            loginUser: new LoginUserUseCase(users, sessions),
            checkUserRole: new CheckUserRoleUseCase(users),
            deleteUser: new DeleteUserUseCase(users),
            createEscapeRoom: new CreateEscapeRoomUseCase(escape_rooms)
        }
    }
}

export const container = Container.init()