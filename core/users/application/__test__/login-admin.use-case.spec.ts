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
import { Participant } from "../../domain/model/participant.entity";
import { LoginAdminUseCase } from "../login-admin.use-case";


describe('login admin use case tests', () => {

    beforeAll( async () => {
        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions');
        await postgres.query('DELETE FROM users')
        await postgres.end()
    })

    const password_plain = 'test'
    beforeAll(async () => {
        const password_cipher = await bcrypt.hash(password_plain, SALT);
        const new_admin = new Admin(1, new Email('test@test.es'), 'test', password_cipher)
        const new_participant = new Participant(1, new Email('participant@test.es'), 'test', password_cipher, 0)

        const users = new UsersSql(PostgresSqlClient)
        await users.save(new_admin)
        await users.save(new_participant)
    })

    test('log valid admin', async () => {
        const request: LoginRequest = {
            email: 'test@test.es',
            password: 'test'
        }

        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const loginusecase = new LoginAdminUseCase(users, sessions);

        const response = await loginusecase.with(request);

        expect(response.code).toBe(200);
        expect(response.email).toBe('test@test.es');
    })
    test('log invalid admin', async () => {
        const request: LoginRequest = {
            email: 'stest@test.es',
            password: 'test'
        }

        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const loginusecase = new LoginAdminUseCase(users, sessions);

        const response = await loginusecase.with(request);

        expect(response.code).toBe(400);
    })
    test('log admin with an invalid password', async () => {
        const request: LoginRequest = {
            email: 'test@test.es',
            password: 'tests'
        }

        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const loginusecase = new LoginAdminUseCase(users, sessions);

        const response = await loginusecase.with(request);

        expect(response.code).toBe(400);
    })
    test('log a valid participant', async () => {
        const request: LoginRequest = {
            email: 'participant@test.es',
            password: 'test'
        }

        const users = new UsersSql(PostgresSqlClient);
        const sessions = new SessionsSql(PostgresSqlClient);
        const loginusecase = new LoginAdminUseCase(users, sessions);

        const response = await loginusecase.with(request);

        expect(response.code).toBe(400);
    })

    afterAll( async () => {

        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions');
        await postgres.query('DELETE FROM users')
        await postgres.end()
        
    })

});