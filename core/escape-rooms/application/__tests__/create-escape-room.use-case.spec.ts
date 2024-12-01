import { describe } from "@jest/globals";
import { CreateEscapeRoomRequest } from "../../dto/resquests/create-escape-room.request";
import { Client } from "pg";
import { EscapeRoomsSql } from "../../infrastructure/services/escape_rooms_sql.repository";
import { CreateEscapeRoomUseCase } from "../create-escape-room.use-case";
import PostgresSqlConfig from '../../../commons/infrastructure/database-client/postgresql-client'
describe('Create escape room use case tests', () => {
    describe('Save escape room tests', () => {
        beforeAll(async () => {
            const postgres = new Client(PostgresSqlConfig)
            await postgres.connect()
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
        test('Save valid escape room', async () => {
            const escape_room_data = {
                title: 'test',
                description: 'test',
                solution: 'test',
                difficulty: 1,
                price: 100,
                maxSessionDuration: 3,
                location: {
                    coordinates: '0º 30\'30\" N, 0º 30\'30\" N',
                    street: 'test',
                    street_number: 1,
                    other_info: '',
                    city: 'cordoba',
                    country: 'españa',
                    info: ''
                }
            } as CreateEscapeRoomRequest

            const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
            const create_escape_room = new CreateEscapeRoomUseCase(escape_rooms)

            const response = await create_escape_room.with(escape_room_data)

            expect(response.code).toBe(200)
        })
        test('Save invalid escape room: error in coordinates', async () => {
            const escape_room_data = {
                title: 'test',
                description: 'test',
                solution: 'test',
                difficulty: 1,
                price: 100,
                maxSessionDuration: 3,
                location: {
                    coordinates: '0º 30\'30\" N, 0 30\'30\" N',
                    street: 'test',
                    street_number: 1,
                    other_info: '',
                    city: 'cordoba',
                    country: 'españa',
                    info: ''
                }
            } as CreateEscapeRoomRequest

            const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
            const create_escape_room = new CreateEscapeRoomUseCase(escape_rooms)

            const response = await create_escape_room.with(escape_room_data)

            expect(response.code).toBe(400)
        })
        afterEach(async () => {
            const postgres = new Client(PostgresSqlConfig)
            await postgres.connect()
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })
})