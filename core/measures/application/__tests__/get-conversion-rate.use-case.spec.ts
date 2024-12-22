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

describe('get conversion rate use case tests', () => {
    beforeAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
                
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions')
        await postgres.query('DELETE FROM usersparticipations')
        await postgres.query('DELETE FROM users')
        await postgres.query('DELETE FROM participations')
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })
    test('without sessions', async () => {
        const response = await container.getConversionRate.with()

        expect(response.code).toBe(200)
        expect(response.rate).toBe(0)
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
            }
        })
        test('without pays', async () => {
            const response = await container.getConversionRate.with()

            expect(response.code).toBe(200)
            expect(response.rate).toBe(0)
        })
        describe('with pays', () => {
            let escape_room_data = {
                id: -1,
                title: 'test',
                description: 'test',
                solution: 'test',
                difficulty: 1,
                price: 100,
                location: {
                    id: -1,
                    coordinates: '0º 30\'30\" N, 0º 30\'30\" N',
                    street: 'test',
                    street_number: 1,
                    other_info: '',
                    city: 'cordoba',
                    country: 'españa'
                }
            }

            let participation = {
                id: 1, 
                start_date: new Date(2025, 12, 15, 10, 20, 20),
                end_date: new Date(2025, 12, 15, 13, 20, 20),
                points: 0,
                escape_room: escape_room_data
            }
            
            beforeAll(async () => {
                const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
    
                await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))
    
                const postgres2 = new Client(PostgresSqlConfig)
                await postgres2.connect()
                const er = await postgres2.query('SELECT * FROM escaperooms')
                await postgres2.end()
    
                escape_room_data.id = er.rows[0].id
                participation.escape_room = escape_room_data
    
                const participations = new ParticipationsSql(PostgresSqlConfig)
                await participations.save(ParticipationDataMapper.toModel(participation))
    
                const postgres3 = new Client(PostgresSqlConfig)
                await postgres3.connect()
                const pr = await postgres3.query('SELECT * FROM participations')
                await postgres3.end()
    
                participation.id = pr.rows[0].id

                const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
                await userparticipations.save(UserParticipationDataMapper.toModel({user: user_data, participation: participation}))
            })
            test('with one pay', async () => {
                const response = await container.getConversionRate.with()

                expect(response.code).toBe(200)
                expect(response.rate).toBe(1 / n_sessions)
            })
            afterAll(async () => {
                const postgres = new Client(PostgresSqlConfig)
                
                await postgres.connect()
                await postgres.query('DELETE FROM usersparticipations')
                await postgres.query('DELETE FROM participations')
                await postgres.query('DELETE FROM escaperooms')
                await postgres.query('DELETE FROM locations')
                await postgres.query('DELETE FROM cities')
                await postgres.query('DELETE FROM countries')
                await postgres.end()
            })
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