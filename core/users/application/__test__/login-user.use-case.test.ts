import { LoginUserUseCase } from "../login-user.use-case";
import { LoginRequest } from "../../dto/requests/login.request"
import { SessionsSql } from "../../infrastructure/services/sessions-sql.repository"; 
import { UsersSql } from "../../infrastructure/services/users-sql.repository";
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client"
import { Client } from "pg";
import * as bcrypt from 'bcrypt'
import { SALT } from "../../../commons/utils/config";
import { Admin } from "../../domain/model/admin.entity";
import { Email } from "../../domain/model/value-objects/email";


describe('LoginUserUseCase', () => {

    beforeEach( async () => {
        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions');
        await postgres.query('DELETE FROM users')
        await postgres.end()
    })

    const password_plain = 'test'
    beforeEach(async () => {
        const password_cipher = await bcrypt.hash(password_plain, SALT);
        const new_user = new Admin(1, new Email('test@test.es'), 'test', password_cipher)

        const users = new UsersSql(PostgresSqlClient)
        await users.save(new_user)
    })

    test('Recibir LoginRequest correctamente y obtener LoginResponse válida', async () => {
        const request: LoginRequest = {
            email: 'test@test.es',
            password: 'test'
        }
        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const loginusecase = new LoginUserUseCase(users, sessions);

        const response = await loginusecase.with(request);

        expect(response.code).toBe(200);
        expect(response.role).toBe('admin');
    });

    describe('LoginUserUseCase', () => {

        test('Recibir un Request no valido y controlar la Response', async () => {

            const request: LoginRequest = {
    
                email: 'test@test.es@test.com',
                password: 'testpassword'
    
            }
    
            const users = new UsersSql(PostgresSqlClient);
            const sessions = new SessionsSql(PostgresSqlClient);
            const loginusecase = new LoginUserUseCase(users, sessions);
    
            const response = await loginusecase.with(request);

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

});