import { describe, beforeAll, afterAll, afterEach } from "@jest/globals";
import { Client } from "pg";
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client";
import { UsersSql } from "../../../users/infrastructure/services/users-sql.repository";
import { EscapeRoomsSql } from "../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository";
import { ParticipationsSql } from "../../../escape-rooms/infrastructure/services/participations_sql.repository";
import UserDataMapper from "../../../users/infrastructure/persistence/user.data-mapper";
import { EscapeRoomDataMapper } from "../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper";
import { ParticipationDataMapper } from "../../../escape-rooms/infrastructure/persistence/participation.data-mapper";
import { RegisterUserParticipationRequest } from "../../dto/requests/register-user-participation.request";
import { UserParticipationsSql } from "../../infrastructure/services/user-participations-sql.repository";
import { RegisterUserParticipationUseCase } from "../register-user-participation.use-case";


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
            const request = {
                user_email: user.email,
                participation_id: participation.id,
                escape_room_id: participation.escape_room.id
            } as RegisterUserParticipationRequest
            const users = new UsersSql(PostgresSqlConfig)
            const participations = new ParticipationsSql(PostgresSqlConfig)
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
            const use_case = new RegisterUserParticipationUseCase(users, participations, userparticipations)

            const response = await use_case.with(request)

            expect(response.code).toBe(200)
        })
        test('inscribe twice in a valid participation', async () => {
            const request = {
                user_email: user.email,
                participation_id: participation.id,
                escape_room_id: participation.escape_room.id
            } as RegisterUserParticipationRequest
            const users = new UsersSql(PostgresSqlConfig)
            const participations = new ParticipationsSql(PostgresSqlConfig)
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
            const use_case = new RegisterUserParticipationUseCase(users, participations, userparticipations)

            const response1 = await use_case.with(request)
            const response2 = await use_case.with(request)

            expect(response1.code).toBe(200)
            expect(response2.code).toBe(400)
        })
        test('invalid user', async () => {
            const request = {
                user_email: 's' + user.email,
                participation_id: participation.id,
                escape_room_id: participation.escape_room.id
            } as RegisterUserParticipationRequest
            const users = new UsersSql(PostgresSqlConfig)
            const participations = new ParticipationsSql(PostgresSqlConfig)
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
            const use_case = new RegisterUserParticipationUseCase(users, participations, userparticipations)

            const response = await use_case.with(request)

            expect(response.code).toBe(404)
        })
        test('invalid participation', async () => {
            const request = {
                user_email: user.email,
                participation_id: participation.id + 1,
                escape_room_id: participation.escape_room.id
            } as RegisterUserParticipationRequest
            const users = new UsersSql(PostgresSqlConfig)
            const participations = new ParticipationsSql(PostgresSqlConfig)
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
            const use_case = new RegisterUserParticipationUseCase(users, participations, userparticipations)

            const response = await use_case.with(request)

            expect(response.code).toBe(404)
        })
        test('invalid escape room', async () => {
            const request = {
                user_email: user.email,
                participation_id: participation.id,
                escape_room_id: participation.escape_room.id + 1
            } as RegisterUserParticipationRequest
            const users = new UsersSql(PostgresSqlConfig)
            const participations = new ParticipationsSql(PostgresSqlConfig)
            const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
            const use_case = new RegisterUserParticipationUseCase(users, participations, userparticipations)

            const response = await use_case.with(request)

            expect(response.code).toBe(404)
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