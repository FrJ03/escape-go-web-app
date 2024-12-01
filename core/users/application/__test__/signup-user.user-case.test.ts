import { SignUpUserUseCase } from "../signup-user.use-case";
import { SignUpRequest } from "../../dto/requests/signup.request";
import { SessionsSql } from "../../infrastructure/services/sessions-sql.repository"; 
import { UsersSql } from "../../infrastructure/services/users-sql.repository";
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client"

describe('SignupUserUseCase', () => {

    test('Recibir SignUpRequest correctamente y obtener SignUpResponse válida', () => {

        const request: SignUpRequest = { //request válido

            email: 'notrealmail@mail.com',
            username: 'notrealusername',
            password: 'notrealpassword'

        }

        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const signupusercase = new SignUpUserUseCase(users, sessions);

        signupusercase.with(request).then((response)=> {

            expect(response.code).toBe(200);

        });

    });

    test('Recibir SignUpRequest inválida  y comprobar el SignUpResponse', () => {

        const request: SignUpRequest = { //request válido

            email: 'notrealmail@mail.com@notrealmail',
            username: 'notrealusername',
            password: 'notrealpassword'

        }

        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const signupusercase = new SignUpUserUseCase(users, sessions);

        signupusercase.with(request).then((response)=> {

            expect(response.code).toBe(404);

        });

    });

})