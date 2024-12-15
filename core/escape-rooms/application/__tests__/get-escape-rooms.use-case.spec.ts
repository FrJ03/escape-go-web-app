import { describe, test, beforeAll, afterEach } from "@jest/globals"
import { Client } from "pg"
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client"
import { Coordinate } from "../../domain/model/coordinate.entity"
import { EscapeRoomsSql } from "../../infrastructure/services/escape_rooms_sql.repository"
import { GetEscapeRoomsByDistanceUseCase } from "../get-escape-rooms-by-distance.use-case"
import { GetEscapeRoomsByDistanceRequest } from "../../dto/resquests/get-escape-rooms-by-distance.request"
import { LocationType } from "../../infrastructure/persistence/location.type"
import { EscapeRoomType } from "../../infrastructure/persistence/escape_room.type"
import { EscapeRoomDataMapper } from "../../infrastructure/persistence/escape_room.data-mapper"
import { GetEscapeRoomsRequest } from "../../dto/resquests/get-escape-rooms.request"
import { GetEscapeRoomsUseCase } from "../get-escape-rooms.use-case"

describe('Get escape rooms use case', () => {
    beforeAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        await postgres.connect()
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })
    const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
    test('Without escape rooms', async () => {
        const use_case = new GetEscapeRoomsUseCase(escape_rooms)
        const request = {

        } as GetEscapeRoomsRequest

        const response = await use_case.with(request)

        expect(response.code).toBe(200)
        expect(response.escape_rooms.length).toBe(0)
    })
    describe('With escape rooms inserted tests', () => {
        const escape_rooms_data = [{
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
        } as EscapeRoomType,
        {
            id: -1,
            title: 'test',
            description: 'test',
            solution: 'test',
            difficulty: 1,
            price: 100,
            location: {
                id: -1,
                coordinates: '10º 30\'30\" N, 0º 30\'30\" N',
                street: 'test',
                street_number: 1,
                other_info: '',
                city: 'sevilla',
                country: 'españa'
            } as LocationType
        } as EscapeRoomType,
        {
            id: -1,
            title: 'test',
            description: 'test',
            solution: 'test',
            difficulty: 1,
            price: 100,
            location: {
                id: -1,
                coordinates: '10º 30\'30\" N, 10º 30\'30\" N',
                street: 'test',
                street_number: 1,
                other_info: '',
                city: 'sevilla',
                country: 'españa'
            } as LocationType
        } as EscapeRoomType
    ]
        const escape_room_data_2 = 
        test('With one escape room', async () => {
            await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))
            const use_case = new GetEscapeRoomsUseCase(escape_rooms)
            const request = {
                
            } as GetEscapeRoomsRequest
    
            const response = await use_case.with(request)
    
            expect(response.code).toBe(200)
            expect(response.escape_rooms.length).toBe(1)
        })
        test('With two escape rooms', async () => {
            await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))
            await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[1]))
            const use_case = new GetEscapeRoomsUseCase(escape_rooms)
            const request = {
                
            } as GetEscapeRoomsRequest
    
            const response = await use_case.with(request)
    
            expect(response.code).toBe(200)
            expect(response.escape_rooms.length).toBe(2)
        })
        test('With n escape rooms', async () => {
            escape_rooms_data.forEach(async escape_room => {
                await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room))
            })
            const use_case = new GetEscapeRoomsUseCase(escape_rooms)
            const request = {
                
            } as GetEscapeRoomsRequest
    
            const response = await use_case.with(request)
    
            expect(response.code).toBe(200)
            expect(response.escape_rooms.length).toBe(escape_rooms_data.length)            
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