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
import { GetEscapeRoomsByDistanceUseCase } from "../../escape-rooms/application/get-escape-rooms-by-distance.use-case";
import { DeleteEscapeRoomUseCase } from "../../escape-rooms/application/delete-escape-room.use-case";
import { ParticipationsSql } from "../../escape-rooms/infrastructure/services/participations_sql.repository";
import { CreateParticipationUseCase } from "../../escape-rooms/application/create-participation.use-case";
import { GetEscapeRoomInfoByIdUseCase } from "../../escape-rooms/application/get-escape-room-info-by-id.use-case";
import { LoginAdminUseCase } from "../../users/application/login-admin.use-case";
import { GetEscapeRoomsUseCase } from "../../escape-rooms/application/get-escape-rooms.use-case";
import { GetEscapeRoomUseCase } from "../../escape-rooms/application/get-escape-room.use-case";
import { RegisterUserParticipationUseCase } from "../../escape-room-sessions/application/register-user-participation.use-case";
import { UserParticipationsSql } from "../../escape-room-sessions/infrastructure/services/user-participations-sql.repository";
import { GetClueUseCase } from "../../escape-room-sessions/application/get-clue.use-case";
import { GetNextClueUseCase } from "../../escape-room-sessions/application/get-next-clue.use-case";

const Container = {
    init: () => {
        const users = new UsersSql(PostgresSqlClient)
        const sessions = new SessionsSql(PostgresSqlClient);
        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
        const participations = new ParticipationsSql(PostgresSqlClient)
        const user_participations = new UserParticipationsSql(PostgresSqlClient)

        return {
            signUpUser: new SignUpUserUseCase(users, sessions),
            loginUser: new LoginUserUseCase(users, sessions),
            loginAdmin: new LoginAdminUseCase(users, sessions),
            checkUserRole: new CheckUserRoleUseCase(users),
            deleteUser: new DeleteUserUseCase(users),
            createEscapeRoom: new CreateEscapeRoomUseCase(escape_rooms),
            getEscapeRooms: new GetEscapeRoomsUseCase(escape_rooms),
            getEscapeRoomsByDistance: new GetEscapeRoomsByDistanceUseCase(escape_rooms),
            deleteEscapeRoom: new DeleteEscapeRoomUseCase(escape_rooms),
            createParticipation: new CreateParticipationUseCase(escape_rooms, participations),
            getEscapeRoom: new GetEscapeRoomUseCase(escape_rooms),
            getEscapeRoomInfoById: new GetEscapeRoomInfoByIdUseCase(escape_rooms, participations),
            registerParticipant: new RegisterUserParticipationUseCase(users, participations, user_participations),
            getClue: new GetClueUseCase(escape_rooms),
            getNextClue: new GetNextClueUseCase(escape_rooms)
        }
    }
}

export const container = Container.init()