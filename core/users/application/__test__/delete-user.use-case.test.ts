import { DeleteUserUseCase } from "../delete-user.use-case";
import { DeleteRequest } from "../../dto/requests/delete.request";
import { SessionsSql } from "../../infrastructure/services/sessions-sql.repository"; 
import { UsersSql } from "../../infrastructure/services/users-sql.repository";
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client"
import { User } from "../../domain/model/user.entity";
import UserDataMapper from "../../infrastructure/persistence/user.data-mapper";
import { UserType } from "../../infrastructure/persistence/user.type";
import { Admin } from "../../domain/model/admin.entity";
import { Email } from "../../domain/model/value-objects/email";
import { Client } from "pg";
import * as bcrypt from 'bcrypt'

describe('Delete users use case tests', () => {
    test('Delete without an user inserted', async () => {
        const users = new UsersSql(PostgresSqlClient)
        const delete_uc = new DeleteUserUseCase(users)
        const request = {
            email: 'test@test.es',
            password: 'test'
        } as DeleteRequest

        const response = await delete_uc.with(request)

        expect(response.code).toBe(400)
    })
    describe('With an user inserted',() => {
        const password_plain = 'test'
        beforeEach( async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM users')
            await postgres.end()
        })
        beforeEach(async () => {
            const password_cipher = await bcrypt.hash(password_plain, 10);
            const new_user = new Admin(1, new Email('test@test.es'), 'test', password_cipher)

            const users = new UsersSql(PostgresSqlClient)
            await users.save(new_user)
        })

        test('Delete an existing user', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const delete_uc = new DeleteUserUseCase(users)
            const request = {
                email: 'test@test.es',
                password: 'test'
            } as DeleteRequest

            const response = await delete_uc.with(request)

            expect(response.code).toBe(200)
        })
        test('Delete an existing user with a wrong password', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const delete_uc = new DeleteUserUseCase(users)
            const request = {
                email: 'test@test.es',
                password: password_plain + '1'
            } as DeleteRequest

            const response = await delete_uc.with(request)

            expect(response.code).toBe(401)
        })
        test('Delete a non-existing user', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const delete_uc = new DeleteUserUseCase(users)
            const request = {
                email: 'test@test.e',
                password: password_plain + '1'
            } as DeleteRequest

            const response = await delete_uc.with(request)

            expect(response.code).toBe(404)
        })
        afterEach( async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM users')
            await postgres.end()
            
        })
    })
    
    afterAll( async () => {
        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM users')
        await postgres.end()
        
    })
})