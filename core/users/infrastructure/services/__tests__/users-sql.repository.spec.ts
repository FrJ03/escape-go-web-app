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
import { Participant } from "../../../domain/model/participant.entity";

describe('Get all users tests', () => {
    test('without users', async () => {
        const users = new UsersSql(PostgresSqlClient)

        const response: Array<User> = await users.getAll()

        expect(response.length).toBe(0)
    })
    describe('With users', () => {
        test('with an admin', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const admin_data = {
                id: 1,
                email: 'admin@test.es',
                username: 'admin',
                password: 'admin',
                role: 'admin',
                points: -1
            } as UserType
            await users.save(UserDataMapper.toModel(admin_data))
    
            const response: Array<User> = await users.getAll()

            expect(response.length).toBe(1)
            expect(response[0] instanceof Admin).toBeTruthy()
        })
        test('with a participant', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const participant_data = {
                id: 1,
                email: 'p1@test.es',
                username: 'p1',
                password: 'p1',
                role: 'participant',
                points: -1
            } as UserType
            await users.save(UserDataMapper.toModel(participant_data))
    
            const response: Array<User> = await users.getAll()

            expect(response.length).toBe(1)
            expect(response[0] instanceof Participant).toBeTruthy()
        })
        test('with an admin and a participant', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const admin_data = {
                id: 1,
                email: 'admin@test.es',
                username: 'admin',
                password: 'admin',
                role: 'admin',
                points: -1
            } as UserType
            const participant_data = {
                id: 1,
                email: 'p1@test.es',
                username: 'p1',
                password: 'p1',
                role: 'participant',
                points: -1
            } as UserType
            await users.save(UserDataMapper.toModel(admin_data))
            await users.save(UserDataMapper.toModel(participant_data))
    
            const response: Array<User> = await users.getAll()

            expect(response.length).toBe(2)
        })
        afterEach(async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM users')
            await postgres.end()
        })
    })
    
})
describe('Get all participants tests', () => {
    test('without users', async () => {
        const users = new UsersSql(PostgresSqlClient)

        const response: Array<User> = await users.getAllParticipants()

        expect(response.length).toBe(0)
    })
    describe('With users', () => {
        test('with an admin', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const admin_data = {
                id: 1,
                email: 'admin@test.es',
                username: 'admin',
                password: 'admin',
                role: 'admin',
                points: -1
            } as UserType
            await users.save(UserDataMapper.toModel(admin_data))
    
            const response: Array<User> = await users.getAllParticipants()

            expect(response.length).toBe(0)
        })
        test('with a participant', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const participant_data = {
                id: 1,
                email: 'p1@test.es',
                username: 'p1',
                password: 'p1',
                role: 'participant',
                points: -1
            } as UserType
            await users.save(UserDataMapper.toModel(participant_data))
    
            const response: Array<User> = await users.getAllParticipants()

            expect(response.length).toBe(1)
            expect(response[0] instanceof Participant).toBeTruthy()
        })
        test('with an admin and a participant', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const admin_data = {
                id: 1,
                email: 'admin@test.es',
                username: 'admin',
                password: 'admin',
                role: 'admin',
                points: -1
            } as UserType
            const participant_data = {
                id: 1,
                email: 'p1@test.es',
                username: 'p1',
                password: 'p1',
                role: 'participant',
                points: -1
            } as UserType
            await users.save(UserDataMapper.toModel(admin_data))
            await users.save(UserDataMapper.toModel(participant_data))
    
            const response: Array<User> = await users.getAllParticipants()

            expect(response.length).toBe(1)
        })
        afterEach(async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM users')
            await postgres.end()
        })
    })
    
})
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

describe('Delete users tests', () => {
    test('Delete without an user inserted', async () => {
        const users = new UsersSql(PostgresSqlClient)

        const response = await users.delete(1)

        expect(response).toBeFalsy()
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

        beforeEach( async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM users')
            await postgres.end()
        })
        beforeEach(async () => {
            const users = new UsersSql(PostgresSqlClient)
            await users.save(new_user)
        })

        test('Delete an existing user', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const user = await users.findUserByUsername(user_username)
            if(user instanceof User){
                const response = await users.delete(user.id)

                expect(response).toBeTruthy()
                expect(await users.delete(user.id)).toBeFalsy()
            }
        })
        test('Delete a non-existing user', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const user = await users.findUserByUsername(user_username)
            if(user instanceof User){
                const response = await users.delete(user.id + 1)

                expect(response).toBeFalsy()
            }
        })
    })
    
    afterAll( async () => {
        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM users')
        await postgres.end()
        
    })
})

describe('Add points to user tests', () => {
    test('Non existing user', async () => {
        const users = new UsersSql(PostgresSqlClient)

        const response = await users.addPoints(0, 10)

        expect(response).toBeFalsy()
    })
    describe('With an exisiting user', () => {
        const new_user = UserDataMapper.toModel({
            id: 1,
            email: 'test@test.com',
            username: 'test',
            password: 'test',
            role: 'participant',
            points: -1
        } as UserType)

        beforeEach(async () => {
            const users = new UsersSql(PostgresSqlClient)
            await users.save(new_user)

            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            const response  = await postgres.query('SELECT id FROM users WHERE email = $1', [new_user.email.value])
            await postgres.end()

            new_user.id = response.rows[0].id
        })
        test('Add to a valid user', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const points = 10

            const response = await users.addPoints(new_user.id, points)
            const user = await users.findUserByEmail(new_user.email)

            expect(response).toBeTruthy()
            if(user instanceof Participant && new_user instanceof Participant){
                expect(user.points).toBe(new_user.points + points)
            }
        })
        test('Add to a valid user twice', async () => {
            const users = new UsersSql(PostgresSqlClient)
            const points = 10

            const response_1 = await users.addPoints(new_user.id, points)
            const response_2 = await users.addPoints(new_user.id, points)
            const user = await users.findUserByEmail(new_user.email)

            expect(response_1).toBeTruthy()
            expect(response_2).toBeTruthy()
            if(user instanceof Participant && new_user instanceof Participant){
                expect(user.points).toBe(new_user.points + points * 2)
            }
        })
        afterEach(async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM users')
            await postgres.end()
        })
    })
})