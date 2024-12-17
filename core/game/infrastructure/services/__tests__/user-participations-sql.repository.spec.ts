import { describe, beforeAll, afterAll, afterEach } from "@jest/globals";
import { Client } from "pg";
import PostgresSqlConfig from "../../../../commons/infrastructure/database-client/postgresql-client";
import { EscapeRoomsSql } from "../../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository";
import { UsersSql } from "../../../../users/infrastructure/services/users-sql.repository";
import { ParticipationsSql } from "../../../../escape-rooms/infrastructure/services/participations_sql.repository";
import UserDataMapper from "../../../../users/infrastructure/persistence/user.data-mapper";
import { EscapeRoomDataMapper } from "../../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper";
import { ParticipationDataMapper } from "../../../../escape-rooms/infrastructure/persistence/participation.data-mapper";
import { UserParticipationType } from "../../persistence/user-participation.type";
import { UserParticipationsSql } from "../user-participations-sql.repository";
import { UserParticipationDataMapper } from "../../persistence/user-participation.data-mapper";


describe('user participations sql repository', () => {
    describe('save user participations tests', () => {
        let participation = {
            id: 1, 
            escape_room: {
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
            },
            start_date: new Date(2025, 12, 15, 10, 20, 20),
            end_date: new Date(2025, 12, 15, 13, 20, 20),
            points: 0
        }
        let user = {
            id: 1,
            email: 'test@test.es',
            username: 'test',
            password: 'test',
            role: 'admin',
            points: -1
        }
        beforeAll(async () => {
            const postgres = new Client(PostgresSqlConfig)
        
            await postgres.connect()
            await postgres.query('DELETE FROM usersparticipations')
            await postgres.query('DELETE FROM users')
            await postgres.query('DELETE FROM participations')
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')

            const users = new UsersSql(PostgresSqlConfig)
            const escaperooms = new EscapeRoomsSql(PostgresSqlConfig)
            const participations = new ParticipationsSql(PostgresSqlConfig)

            await users.save(UserDataMapper.toModel(user))
            const user_id = await postgres.query('SELECT id FROM users')
            user.id = user_id.rows[0].id

            await escaperooms.save(EscapeRoomDataMapper.toModel(participation.escape_room))
            const escaperoom_id = await postgres.query('SELECT id FROM escaperooms')
            participation.escape_room.id = escaperoom_id.rows[0].id
            
            await participations.save(ParticipationDataMapper.toModel(participation))
            const participation_id = await postgres.query('SELECT id FROM participations')
            participation.id = participation_id.rows[0].id
            await postgres.end()
        })

        test('inscribe in a valid participation', async () => {
            const up = {
                user: user,
                participation: participation
            } as UserParticipationType
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)

            const response = await userparticipations.save(UserParticipationDataMapper.toModel(up))

            expect(response).toBeTruthy()
        })
        test('inscribe twice in a valid participation', async () => {
            const up = {
                user: user,
                participation: participation
            } as UserParticipationType
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)

            const response1 = await userparticipations.save(UserParticipationDataMapper.toModel(up))
            const response2 = await userparticipations.save(UserParticipationDataMapper.toModel(up))

            expect(response1).toBeTruthy()
            expect(response2).toBeFalsy()
        })
        test('invalid user', async () => {
            const up = {
                user: user,
                participation: participation
            } as UserParticipationType
            up.user.id = up.user.id + 1
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)

            const response = await userparticipations.save(UserParticipationDataMapper.toModel(up))

            expect(response).toBeFalsy()
        })
        test('invalid participation', async () => {
            const up = {
                user: user,
                participation: participation
            } as UserParticipationType
            up.participation.id = up.participation.id + 1
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)

            const response = await userparticipations.save(UserParticipationDataMapper.toModel(up))

            expect(response).toBeFalsy()
        })
        test('invalid escape room', async () => {
            const up = {
                user: user,
                participation: participation
            } as UserParticipationType
            up.participation.escape_room.id = up.participation.escape_room.id + 1
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)

            const response = await userparticipations.save(UserParticipationDataMapper.toModel(up))

            expect(response).toBeFalsy()
        })

        afterEach(async () => {
            const postgres = new Client(PostgresSqlConfig)

            await postgres.connect()
            await postgres.query('DELETE FROM usersparticipations')
            await postgres.end()
        })

        afterAll(async () => {
            const postgres = new Client(PostgresSqlConfig)
        
            await postgres.connect()
            await postgres.query('DELETE FROM usersparticipations')
            await postgres.query('DELETE FROM users')
            await postgres.query('DELETE FROM participations')
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })
})