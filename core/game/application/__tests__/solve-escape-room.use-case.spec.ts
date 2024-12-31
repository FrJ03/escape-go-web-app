import { describe } from "@jest/globals";
import { container } from "../../../commons/container/container";
import { Client } from "pg";
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client";
import { EscapeRoomDataMapper } from "../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper";
import { ParticipationsSql } from "../../../escape-rooms/infrastructure/services/participations_sql.repository";
import { EscapeRoomsSql } from "../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository";
import { ParticipationDataMapper } from "../../../escape-rooms/infrastructure/persistence/participation.data-mapper";

describe('solve escape room use case tests', () => {
    beforeAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions')
        await postgres.query('DELETE FROM usersparticipations')
        await postgres.query('DELETE FROM users')
        await postgres.query('DELETE FROM clues')
        await postgres.query('DELETE FROM participations')
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })
    test('Non exisiting participation', async () => {
        const response = await container.solveEscapeRoom.with({escape_room_id: 0, participation_id: 0, solution: '', user_email: ''})

        expect(response.code).toBe(404)
    })
    describe('Participation ended', () => {
        const now = new Date()
        let start_date = new Date(now)
        let end_date = new Date(now)
        
        start_date.setHours(start_date.getHours() - 2)
        end_date.setHours(end_date.getHours() - 1)

        let participation_data = {
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
            start_date: start_date,
            end_date: end_date,
            points: 0
        }

        let participant = {
            email: 'test@test.es',
            username: 'test',
            password: 'test',
        }
        beforeAll(async () => {
            const postgres = new Client(PostgresSqlConfig)

            const escaperooms = new EscapeRoomsSql(PostgresSqlConfig)
            const participations = new ParticipationsSql(PostgresSqlConfig)

            await escaperooms.save(EscapeRoomDataMapper.toModel(participation_data.escape_room))
            await postgres.connect()
            const escaperoom_id = await postgres.query('SELECT id FROM escaperooms')
            participation_data.escape_room.id = escaperoom_id.rows[0].id
            
            await participations.save(ParticipationDataMapper.toModel(participation_data))
            const participation_id = await postgres.query('SELECT id FROM participations')
            participation_data.id = participation_id.rows[0].id
            await postgres.end()

            await container.signUpUser.with(participant)

            await container.registerParticipant.with({
                user_email: participant.email,
                escape_room_id: participation_data.escape_room.id,
                participation_id: participation_data.id
            }) 
        })
        test('participation ended test', async () => {
            const response = await container.solveEscapeRoom.with({escape_room_id: participation_data.escape_room.id, participation_id: participation_data.id, solution: '', user_email: participant.email})

            expect(response.code).toBe(423)
        })
        afterAll(async () => {
            const postgres = new Client(PostgresSqlConfig)
        
            await postgres.connect()
            await postgres.query('DELETE FROM userssessions')
            await postgres.query('DELETE FROM usersparticipations')
            await postgres.query('DELETE FROM users')
            await postgres.query('DELETE FROM clues')
            await postgres.query('DELETE FROM participations')
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })
    describe('Participation not started yet', () => {
        const now = new Date()
        let start_date = new Date(now)
        let end_date = new Date(now)
        
        start_date.setHours(start_date.getHours() + 1)
        end_date.setHours(end_date.getHours() + 2)

        let participation_data = {
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
            start_date: start_date,
            end_date: end_date,
            points: 0
        }
        let participant = {
            email: 'test@test.es',
            username: 'test',
            password: 'test',
        }
        beforeAll(async () => {
            const postgres = new Client(PostgresSqlConfig)

            const escaperooms = new EscapeRoomsSql(PostgresSqlConfig)
            const participations = new ParticipationsSql(PostgresSqlConfig)

            await escaperooms.save(EscapeRoomDataMapper.toModel(participation_data.escape_room))
            await postgres.connect()
            const escaperoom_id = await postgres.query('SELECT id FROM escaperooms')
            participation_data.escape_room.id = escaperoom_id.rows[0].id
            
            await participations.save(ParticipationDataMapper.toModel(participation_data))
            const participation_id = await postgres.query('SELECT id FROM participations')
            participation_data.id = participation_id.rows[0].id
            await postgres.end()

            await container.signUpUser.with(participant)

            await container.registerParticipant.with({
                user_email: participant.email,
                escape_room_id: participation_data.escape_room.id,
                participation_id: participation_data.id
            }) 
        })
        test('participation not started yet test', async () => {
            const response = await container.solveEscapeRoom.with({escape_room_id: participation_data.escape_room.id, participation_id: participation_data.id, solution: '', user_email: participant.email})

            expect(response.code).toBe(423)
        })
        afterAll(async () => {
            const postgres = new Client(PostgresSqlConfig)
        
            await postgres.connect()
            await postgres.query('DELETE FROM userssessions')
            await postgres.query('DELETE FROM usersparticipations')
            await postgres.query('DELETE FROM users')
            await postgres.query('DELETE FROM clues')
            await postgres.query('DELETE FROM participations')
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })
    describe('valid participation inserted', () => {
        const now = new Date(Date.now())
        let start_date = new Date(now)
        let end_date = new Date(now)
        
        start_date.setHours(start_date.getHours() - 2)
        end_date.setHours(end_date.getHours() + 2)

        let participation_data = {
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
            start_date: start_date,
            end_date: end_date,
            points: 0
        }
        let participant = {
            email: 'test@test.es',
            username: 'test',
            password: 'test',
        }
        beforeAll(async () => {
            const postgres = new Client(PostgresSqlConfig)

            const escaperooms = new EscapeRoomsSql(PostgresSqlConfig)
            const participations = new ParticipationsSql(PostgresSqlConfig)

            await escaperooms.save(EscapeRoomDataMapper.toModel(participation_data.escape_room))
            await postgres.connect()
            const escaperoom_id = await postgres.query('SELECT id FROM escaperooms')
            participation_data.escape_room.id = escaperoom_id.rows[0].id
            
            await participations.save(ParticipationDataMapper.toModel(participation_data))
            const participation_id = await postgres.query('SELECT id FROM participations')
            participation_data.id = participation_id.rows[0].id
            await postgres.end()

            await container.signUpUser.with(participant)

            await container.registerParticipant.with({
                user_email: participant.email,
                escape_room_id: participation_data.escape_room.id,
                participation_id: participation_data.id
            }) 
        })
        test('not valid solution test', async () => {
            const solution = participation_data.escape_room.solution + 's'

            const response = await container.solveEscapeRoom.with({escape_room_id: participation_data.escape_room.id, participation_id: participation_data.id, solution: solution, user_email: participant.email})

            expect(response.code).toBe(400)
        })
        test('valid solution: upper case', async () => {
            const solution = participation_data.escape_room.solution

            const response = await container.solveEscapeRoom.with({escape_room_id: participation_data.escape_room.id, participation_id: participation_data.id, solution: solution, user_email: participant.email})
            
            const postgres = new Client(PostgresSqlConfig)
        
            await postgres.connect()
            const points = await postgres.query('SELECT points FROM participations WHERE id = $1 AND escape_room = $2', [participation_data.id, participation_data.escape_room.id])
            await postgres.end()

            expect(response.code).toBe(200)
            expect(points.rows[0].points).toBe(response.points)
        })
        test('valid solution: upper case', async () => {
            const solution = participation_data.escape_room.solution.toUpperCase()

            const response = await container.solveEscapeRoom.with({escape_room_id: participation_data.escape_room.id, participation_id: participation_data.id, solution: solution, user_email: participant.email})

            const postgres = new Client(PostgresSqlConfig)
        
            await postgres.connect()
            const points = await postgres.query('SELECT points FROM participations WHERE id = $1 AND escape_room = $2', [participation_data.id, participation_data.escape_room.id])
            await postgres.end()

            expect(response.code).toBe(200)
            expect(points.rows[0].points).toBe(response.points)
        })
        afterAll(async () => {
            const postgres = new Client(PostgresSqlConfig)
        
            await postgres.connect()
            await postgres.query('DELETE FROM userssessions')
            await postgres.query('DELETE FROM usersparticipations')
            await postgres.query('DELETE FROM users')
            await postgres.query('DELETE FROM clues')
            await postgres.query('DELETE FROM participations')
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })
})