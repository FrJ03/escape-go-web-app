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
import { UpdateEscapeRoomUseCase } from "../../escape-rooms/application/update-escape-room.use-case";
import { ParticipationsSql } from "../../escape-rooms/infrastructure/services/participations_sql.repository";
import { CreateParticipationUseCase } from "../../escape-rooms/application/create-participation.use-case";
import { GetEscapeRoomInfoByIdUseCase } from "../../escape-rooms/application/get-escape-room-info-by-id.use-case";
import { LoginAdminUseCase } from "../../users/application/login-admin.use-case";
import { GetEscapeRoomsUseCase } from "../../escape-rooms/application/get-escape-rooms.use-case";
import { GetEscapeRoomUseCase } from "../../escape-rooms/application/get-escape-room.use-case";
import { RegisterUserParticipationUseCase } from "../../game/application/register-user-participation.use-case";
import { UserParticipationsSql } from "../../game/infrastructure/services/user-participations-sql.repository";
import { GetClueUseCase } from "../../game/application/get-clue.use-case";
import { GetNextClueUseCase } from "../../game/application/get-next-clue.use-case";
import { SolveEscapeRoomUseCase } from "../../game/application/solve-escape-room.use-case";
import { GetConversionRateUseCase } from "../../measures/application/get-conversion-rate.use-case";
import { GetSessionsIntervalUseCase } from "../../measures/application/get-sessions-interval.use-case";
import { GetGrowthRateUseCase } from "../../measures/application/get-growth-rate.use-case";
import { GetProfileUseCase } from "../../profile/application/get-profile.use-case";
import { UpdateProfileUseCase } from "../../profile/application/update-profile.use-case";
import { GetParticipationsByUserUseCase } from "../../profile/application/get-participations-by-user.use-case";
import { GetRankingUseCase } from "../../ranking/application/get-ranking.use-case";

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
            updateEscapeRoom: new UpdateEscapeRoomUseCase(escape_rooms),
            createParticipation: new CreateParticipationUseCase(escape_rooms, participations),
            getEscapeRoom: new GetEscapeRoomUseCase(escape_rooms),
            getEscapeRoomInfoById: new GetEscapeRoomInfoByIdUseCase(escape_rooms, participations),
            registerParticipant: new RegisterUserParticipationUseCase(users, participations, user_participations),
            getClue: new GetClueUseCase(escape_rooms, participations, user_participations),
            getNextClue: new GetNextClueUseCase(escape_rooms, participations, user_participations),
            solveEscapeRoom: new SolveEscapeRoomUseCase(users, user_participations, participations),
            getConversionRate: new GetConversionRateUseCase(user_participations, sessions),
            getGrowthRate: new GetGrowthRateUseCase(users),
            getSessionsInterval: new GetSessionsIntervalUseCase(sessions),
            getProfile: new GetProfileUseCase(users),
            updateProfile: new UpdateProfileUseCase(users),
            getParticipationsByUser: new GetParticipationsByUserUseCase(users, user_participations),
            getRanking: new GetRankingUseCase(users)
        }
    }
}

export const container = Container.init()