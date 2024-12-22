import { describe } from "@jest/globals";
import { container } from "../../../commons/container/container";
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client";
import { Client } from "pg";
import { EscapeRoomsSql } from "../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository";
import { EscapeRoomDataMapper } from "../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper";
import { ParticipationsSql } from "../../../escape-rooms/infrastructure/services/participations_sql.repository";
import { ParticipationDataMapper } from "../../../escape-rooms/infrastructure/persistence/participation.data-mapper";
import { UserParticipationsSql } from "../../../game/infrastructure/services/user-participations-sql.repository";
import { UserParticipationDataMapper } from "../../../game/infrastructure/persistence/user-participation.data-mapper";
import { UsersSql } from "../../../users/infrastructure/services/users-sql.repository";
import UserDataMapper from "../../../users/infrastructure/persistence/user.data-mapper";
import { SessionsSql } from "../../../users/infrastructure/services/sessions-sql.repository";
import { Session } from "../../../users/domain/model/session.entity";
import { SessionDataMapper } from "../../../users/infrastructure/persistence/session.data-mapper";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
describe('get sessions interval use case tests', () => {
    beforeAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
                
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions')
        await postgres.query('DELETE FROM users')
        await postgres.end()
    })
    test('without sessions', async () => {
        const response = await container.getSessionsInterval.with()

        expect(response.code).toBe(200)
        expect(response.years).toBe(0)
        expect(response.months).toBe(0)
        expect(response.days).toBe(0)
        expect(response.hours).toBe(0)
        expect(response.minutes).toBe(0)
        expect(response.seconds).toBe(0)
    })
    describe('with sessions', () => {
        let user_data = {
            id: 1,
            email: 'test1@test.es',
            username: 'test1',
            password: 'test',
            role: 'participant',
            points: -1
        }
        const n_sessions = 3
        beforeAll(async () => {
            const users = new UsersSql(PostgresSqlConfig)

            await users.save(UserDataMapper.toModel(user_data))
            const postgres = new Client(PostgresSqlConfig)
            postgres.connect()
            const user_id = await postgres.query('SELECT id FROM users')
            postgres.end()
            user_data.id = user_id.rows[0].id

            const sessions = new SessionsSql(PostgresSqlConfig)
            
            for(let i = 0 ; i < n_sessions ; i++){
                await sessions.save(SessionDataMapper.toModel({
                    id: -1,
                    date: new Date(),
                    user: user_data
                }))
                await sleep(1000)
            }
        })
        test('without pays', async () => {
            const response = await container.getSessionsInterval.with()

            expect(response.code).toBe(200)
            expect(response.years).toBe(0)
            expect(response.months).toBe(0)
            expect(response.days).toBe(0)
            expect(response.hours).toBe(0)
            expect(response.minutes).toBe(0)
            expect(response.seconds).not.toBe(0)
        })
        afterAll(async () => {
            const postgres = new Client(PostgresSqlConfig)
            
            await postgres.connect()
            await postgres.query('DELETE FROM userssessions')
            await postgres.query('DELETE FROM users')
            await postgres.end()
        })
    })
})