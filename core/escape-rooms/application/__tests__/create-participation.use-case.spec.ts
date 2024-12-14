import {test, describe, beforeAll, beforeEach, afterAll, afterEach} from '@jest/globals'
import { Client } from 'pg'
import PostgresSqlConfig from '../../../commons/infrastructure/database-client/postgresql-client'
import { LocationType } from '../../infrastructure/persistence/location.type'
import { EscapeRoomType } from '../../infrastructure/persistence/escape_room.type'
import { EscapeRoomsSql } from '../../infrastructure/services/escape_rooms_sql.repository'
import { EscapeRoomDataMapper } from '../../infrastructure/persistence/escape_room.data-mapper'
import { CreateParticipationRequest } from '../../dto/resquests/create-participation.request'
import { CreateParticipationUseCase } from '../create-participation.use-case'
import { ParticipationsSql } from '../../infrastructure/services/participations_sql.repository'

describe('Save participation use case tests', () => {
    beforeAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        
        await postgres.connect()
        await postgres.query('DELETE FROM participations')
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })

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
        } as LocationType
    } as EscapeRoomType
    
    beforeEach(async () => {
        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
        const postgres = new Client(PostgresSqlConfig)

        await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))
        
        await postgres.connect()
        const response = await postgres.query('SELECT * FROM escaperooms')
        await postgres.end()

        escape_room_data.id = response.rows[0].id
    })

    test('save a valid participation', async () => {
        const start_date = new Date(2025, 12, 15, 10, 20, 20)
        const end_date = new Date(2025, 12, 15, 13, 20, 20)
        const participation = {
            escape_room_id: escape_room_data.id,
            start_date: start_date.toISOString(),
            end_date: end_date.toISOString()
        } as CreateParticipationRequest

        const participations = new ParticipationsSql(PostgresSqlConfig)
        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)

        const use_case = new CreateParticipationUseCase(escape_rooms, participations)

        const response = await use_case.with(participation)

        expect(response.code).toBe(200)
    })
    test('invalid escape_room', async () => {
        const start_date = new Date(2025, 12, 15, 10, 20, 20)
        const end_date = new Date(2025, 12, 15, 13, 20, 20)
        const participation = {
            escape_room_id: escape_room_data.id + 1,
            start_date: start_date.toISOString(),
            end_date: end_date.toISOString()
        } as CreateParticipationRequest

        const participations = new ParticipationsSql(PostgresSqlConfig)
        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)

        const use_case = new CreateParticipationUseCase(escape_rooms, participations)

        const response = await use_case.with(participation)

        expect(response.code).toBe(404)
    })
    test('invalid start date', async () => {
        const start_date = new Date(2025, 12, 15, 10, 20, 20)
        const end_date = new Date(2025, 12, 15, 13, 20, 20)
        const participation = {
            escape_room_id: escape_room_data.id,
            start_date: start_date.toISOString()+ 's',
            end_date: end_date.toISOString()
        } as CreateParticipationRequest

        const participations = new ParticipationsSql(PostgresSqlConfig)
        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)

        const use_case = new CreateParticipationUseCase(escape_rooms, participations)

        const response = await use_case.with(participation)

        expect(response.code).toBe(400)
    })
    test('invalid end date', async () => {
        const start_date = new Date(2025, 12, 15, 10, 20, 20)
        const end_date = new Date(2025, 12, 15, 13, 20, 20)
        const participation = {
            escape_room_id: escape_room_data.id,
            start_date: start_date.toISOString(),
            end_date: end_date.toISOString()+ 's'
        } as CreateParticipationRequest

        const participations = new ParticipationsSql(PostgresSqlConfig)
        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)

        const use_case = new CreateParticipationUseCase(escape_rooms, participations)

        const response = await use_case.with(participation)

        expect(response.code).toBe(400)
    })
    test('invalid start and end date', async () => {
        const start_date = new Date(2025, 12, 15, 10, 20, 20)
        const end_date = new Date(2025, 12, 15, 9, 20, 20)
        const participation = {
            escape_room_id: escape_room_data.id,
            start_date: start_date.toISOString(),
            end_date: end_date.toISOString()
        } as CreateParticipationRequest

        const participations = new ParticipationsSql(PostgresSqlConfig)
        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)

        const use_case = new CreateParticipationUseCase(escape_rooms, participations)

        const response = await use_case.with(participation)

        expect(response.code).toBe(400)
    })
    afterEach(async () => {
        const postgres = new Client(PostgresSqlConfig)
        
        await postgres.connect()
        await postgres.query('DELETE FROM participations')
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })
    afterAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        
        await postgres.connect()
        await postgres.query('DELETE FROM participations')
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })
})