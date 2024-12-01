import { LoginUserUseCase } from "../login-user.use-case";
import { LoginRequest } from "../../dto/requests/login.request"
import { SessionsSql } from "../../infrastructure/services/sessions-sql.repository"; 
import { UsersSql } from "../../infrastructure/services/users-sql.repository";
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client"

describe('LoginUserUseCase', () => {

    test('Recibir LoginRequest correctamente y obtener LoginResponse válida', () => {

        const request: LoginRequest = {

            email: 'notrealmail@mail.com',
            password: 'notrealpassword'

        }

        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const loginusecase = new LoginUserUseCase(users, sessions);

        loginusecase.with(request).then((response) => { //una vez obtenido el response comprobamos los valores obtenidos

            expect(response.code).toBe(200);
            expect(response.email).toBe('notrealmail@mail.com');
            expect(response.token).toBeInstanceOf(String);
            expect(response.username).toBeInstanceOf(String);

        })


    });

    test('Recibir un Request no valido y controlar la Response', () => {

        const request: LoginRequest = {

            email: 'email@novalido.com@noesvalido',
            password: 'notrealpassword'

        }

        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const loginusecase = new LoginUserUseCase(users, sessions);

        loginusecase.with(request).then((response) => { //una vez obtenido el response comprobamos los valores obtenidos

            expect(response.code).toBe(404);

        })

    });

});