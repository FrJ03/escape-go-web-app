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

describe('Get escape rooms by distance use case', () => {
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
        const use_case = new GetEscapeRoomsByDistanceUseCase(escape_rooms)
        const request = {
            coordinates: '0º 30\'30\" N, 0º 30\'30\" N'
        } as GetEscapeRoomsByDistanceRequest

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
            const use_case = new GetEscapeRoomsByDistanceUseCase(escape_rooms)
            const request = {
                coordinates: '0º 30\'30\" N, 0º 30\'30\" N'
            } as GetEscapeRoomsByDistanceRequest
    
            const response = await use_case.with(request)
    
            expect(response.code).toBe(200)
            expect(response.escape_rooms.length).toBe(1)
        })
        test('With two escape rooms', async () => {
            const coordinate = Coordinate.create('0º 30\'30\" N, 0º 30\'30\" N')
            if(coordinate !== undefined){
                await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))
                await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[1]))
                const use_case = new GetEscapeRoomsByDistanceUseCase(escape_rooms)
                const request = {
                    coordinates: coordinate.toString()
                } as GetEscapeRoomsByDistanceRequest
        
                const response = await use_case.with(request)
        
                expect(response.code).toBe(200)
                expect(response.escape_rooms.length).toBe(2)

                const coordinate_0 = Coordinate.create(response.escape_rooms[0].location.coordinates)
                const coordinate_1 = Coordinate.create(response.escape_rooms[1].location.coordinates)

                expect(coordinate_1).toBeDefined()
                expect(coordinate_0).toBeDefined()

                if(coordinate_0 !== undefined && coordinate_1 !== undefined){
                    expect(
                        coordinate.distance(coordinate_0) 
                        <= 
                        coordinate.distance(coordinate_1)
                    ).toBeTruthy()
                }
            }
        })
        test('With n escape rooms', async () => {
            const coordinate = Coordinate.create('0º 30\'30\" N, 0º 30\'30\" N')
            if(coordinate !== undefined){
                await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))
                await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[1]))
                const use_case = new GetEscapeRoomsByDistanceUseCase(escape_rooms)
                const request = {
                    coordinates: coordinate.toString()
                } as GetEscapeRoomsByDistanceRequest
        
                const response = await use_case.with(request)
        
                expect(response.code).toBe(200)
                expect(response.escape_rooms.length).toBe(2)

                const coordinate_0 = Coordinate.create(response.escape_rooms[0].location.coordinates)
                const coordinate_1 = Coordinate.create(response.escape_rooms[1].location.coordinates)

                if(coordinate_0 !== undefined && coordinate_1 !== undefined){
                    expect(
                        coordinate.distance(coordinate_0) 
                        <= 
                        coordinate.distance(coordinate_1)
                    ).toBeTruthy()
                }
                for(let i = 0 ; i < response.escape_rooms.length - 1 ; i++){
                    const coordinate_1 = Coordinate.create(response.escape_rooms[i].location.coordinates)
                    const coordinate_2 = Coordinate.create(response.escape_rooms[i+1].location.coordinates)

                    expect(coordinate_1).toBeDefined()
                    expect(coordinate_2).toBeDefined()

                    if(coordinate_2 !== undefined && coordinate_1 !== undefined){
                        expect(
                            coordinate.distance(coordinate_1) 
                            <= 
                            coordinate.distance(coordinate_2)
                        ).toBeTruthy()
                    }
                    else{
                        
                    }
                }
            }
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