import { UsersSql } from "../users-sql.repository";
import PostgresSqlClient from '../../../../commons/infrastructure/database-client/postgresql-client'
import { describe, beforeEach, test, afterAll } from '@jest/globals'
import UserDataMapper from '../../persistence/user.data-mapper'
import { UserType } from "../../persistence/user.type";
import { ApplicationError } from "../../../../commons/domain/errors/application.error";
import { Client } from "pg";
import { Email } from "../../../domain/model/value-objects/email";
import { User } from "../../../domain/model/user.entity";
import { Admin } from "../../../domain/model/admin.entity";

describe('Find by email tests', () => {
    test('Find without any users inserted', async () => {
        const user_email = new Email('test@test.com')
        const users = new UsersSql(PostgresSqlClient)

        const user: User | undefined = await users.findUserByEmail(user_email)

        expect(user).toBeUndefined()
    })
    describe('With an user inserted', () => {
        const new_user_email = new Email('test@test.com')
        const new_user = UserDataMapper.toModel({
            id: 1,
            email: new_user_email.value,
            username: 'test',
            password: 'test',
            role: 'admin',
            points: -1
        } as UserType)

        beforeAll(async () => {
            const users = new UsersSql(PostgresSqlClient)
            await users.save(new_user)
        })
        test('Existing user', async () => {
            const users = new UsersSql(PostgresSqlClient)

            const user: User | undefined = await users.findUserByEmail(new_user_email)

            expect(user).toBeDefined()
            expect(user instanceof Admin).toBeTruthy()
        })
        test('Non-existing user', async () => {
            const users = new UsersSql(PostgresSqlClient)

            const user: User | undefined = await users.findUserByEmail(new Email('notest@test.com'))

            expect(user).toBeUndefined()
        })
        afterAll( async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM users')
            await postgres.end()
            
        })
    })
})

describe('Find by username tests', () => {
    test('Find without any users inserted', async () => {
        const user_username = 'test'
        const users = new UsersSql(PostgresSqlClient)

        const user: User | undefined = await users.findUserByUsername(user_username)

        expect(user).toBeUndefined()
    })
    describe('With an user inserted', () => {
        const user_username = 'test'
        const new_user = UserDataMapper.toModel({
            id: 1,
            email: 'test@test.com',
            username: user_username,
            password: 'test',
            role: 'admin',
            points: -1
        } as UserType)

        beforeAll(async () => {
            const users = new UsersSql(PostgresSqlClient)
            await users.save(new_user)
        })
        test('Existing user', async () => {
            const users = new UsersSql(PostgresSqlClient)

            const user: User | undefined = await users.findUserByUsername(user_username)

            expect(user).toBeDefined()
            expect(user instanceof Admin).toBeTruthy()
        })
        test('Non-existing user', async () => {
            const users = new UsersSql(PostgresSqlClient)

            const user: User | undefined = await users.findUserByUsername('notest')

            expect(user).toBeUndefined()
        })
        afterAll( async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM users')
            await postgres.end()
            
        })
    })
})

describe('Insert users tests', () => {
    beforeEach( async () => {
        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM users')
        await postgres.end()
        
    })
    test('Insert the first user', async () => {
        const new_user_email = new Email('test@test.com')
        const new_user = UserDataMapper.toModel({
            id: 1,
            email: new_user_email.value,
            username: 'test',
            password: 'test',
            role: 'admin',
            points: -1
        } as UserType)

        const users = new UsersSql(PostgresSqlClient)
        await users.save(new_user)

        const user = await users.findUserByEmail(new_user_email)
        
        expect(user).toBeDefined()
    })
    test('Insert a user twice', async () => {
        const new_user_email = new Email('test@test.com')
        const new_user = UserDataMapper.toModel({
            id: 1,
            email: new_user_email.value,
            username: 'test',
            password: 'test',
            role: 'admin',
            points: -1
        } as UserType)

        const users = new UsersSql(PostgresSqlClient)
        const first = await users.save(new_user)
        const second = await users.save(new_user)
        
        expect(first).toBeTruthy()
        expect(second).toBeFalsy()
    })
    afterAll( async () => {
        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM users')
        await postgres.end()
        
    })
})
