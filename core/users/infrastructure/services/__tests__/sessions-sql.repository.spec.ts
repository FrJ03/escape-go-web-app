import { describe } from "@jest/globals";
import { SessionsSql } from "../sessions-sql.repository";
import PostgresSqlConfig from "../../../../commons/infrastructure/database-client/postgresql-client";
import { UsersSql } from "../users-sql.repository";
import { UserType } from "../../persistence/user.type";
import UserDataMapper from "../../persistence/user.data-mapper";
import { User } from "../../../domain/model/user.entity";
import { Client } from "pg";
import { Session } from "../../../domain/model/session.entity";

describe('Sessions Sql tests', () => {
    describe('Get all sessions tests', () => {
        test('Get all without sessions', async () => {
            const sessions = new SessionsSql(PostgresSqlConfig)

            const response = await sessions.getAll()

            expect(response.length).toBe(0)
        })
        describe('With logs inserted', () => {
            let user: User

            beforeAll(async () => {
                const users = new UsersSql(PostgresSqlConfig)

                await users.save(UserDataMapper.toModel({
                    id: 1,
                    email: 'p1@test.es',
                    username: 'p1',
                    password: 'p1',
                    role: 'participant',
                    points: -1
                } as UserType))

                const user_aux = await users.findUserByUsername('p1')

                if (user_aux){
                    user = user_aux
                }
            })

            test('With a session inserted', async () => {
                const session = new Session(1, new Date(Date.now()), user)
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                await postgres.query('INSERT INTO userssessions (session_date, user_logued) VALUES ($1, $2)', [session.date, user.id])
                await postgres.end()
                const sessions = new SessionsSql(PostgresSqlConfig)

                const response = await sessions.getAll()

                expect(response.length).toBe(1)
                expect(response[0].user.email.value).toBe(user.email.value)
            })
            test('With two sessions inserted', async () => {
                const session1 = new Session(1, new Date(Date.now()), user)
                const session2 = new Session(2, new Date(Date.now()), user)
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                await postgres.query('INSERT INTO userssessions (session_date, user_logued) VALUES ($1, $2)', [session1.date, user.id])
                await postgres.query('INSERT INTO userssessions (session_date, user_logued) VALUES ($1, $2)', [session2.date, user.id])
                await postgres.end()
                const sessions = new SessionsSql(PostgresSqlConfig)

                const response = await sessions.getAll()

                expect(response.length).toBe(2)
                expect(response[0].user.email.value).toBe(user.email.value)
                expect(response[1].user.email.value).toBe(user.email.value)
            })
            afterEach(async () => {
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                await postgres.query('DELETE FROM userssessions')
                await postgres.end()
            })
            afterAll(async () => {
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                await postgres.query('DELETE FROM users')
                await postgres.end()
            })
        })
    })
})