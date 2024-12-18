import { SignUpUserUseCase } from "../signup-user.use-case";
import { SignUpRequest } from "../../dto/requests/signup.request";
import { SessionsSql } from "../../infrastructure/services/sessions-sql.repository"; 
import { UsersSql } from "../../infrastructure/services/users-sql.repository";
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client"
import { Client } from "pg";

describe('SignupUserUseCase', () => {

    beforeEach( async () => {
        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions');
        await postgres.query('DELETE FROM users')
        await postgres.end()
    })

    test('Recibir SignUpRequest correctamente y obtener SignUpResponse válida', async () => {

        const request: SignUpRequest = { //request válido

            email: 'test@test.es',
            username: 'test',
            password: 'testpassword'

        }

        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const signupusercase = new SignUpUserUseCase(users, sessions);

        const response = await signupusercase.with(request);

        expect(response.code).toBe(200);

    });

    describe('SignUpUserUseCase', () => {

        test('Recibir SignUpRequest inválida  y comprobar el SignUpResponse', async () => {

            const request: SignUpRequest = { //request válido
    
                email: 'test@test.es@test.com',
                username: 'test',
                password: 'testpassword'
    
            }
    
            const users = new UsersSql(PostgresSqlClient);
            const sessions = new SessionsSql(PostgresSqlClient);
            const signupusercase = new SignUpUserUseCase(users, sessions);
    
            const response = await signupusercase.with(request);
    
            expect(response.code).toBe(400);
    
        });

    });

    afterAll( async () => {

        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions');
        await postgres.query('DELETE FROM users')
        await postgres.end()
        
    })

})
