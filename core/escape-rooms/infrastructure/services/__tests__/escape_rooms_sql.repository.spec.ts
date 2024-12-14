import { describe } from "@jest/globals";
import PostgresSqlClient from '../../../../commons/infrastructure/database-client/postgresql-client'
import { Client } from "pg";
import { EscapeRoomType } from "../../persistence/escape_room.type";
import { EscapeRoomDataMapper } from "../../persistence/escape_room.data-mapper";
import { EscapeRoomsSql } from "../escape_rooms_sql.repository";
import { LocationType } from "../../persistence/location.type";
import { Coordinate } from "../../../domain/model/coordinate.entity";

describe('Escape rooms sql repository tests', () => {
    describe('Save escape room tests', () => {
        beforeAll(async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
        test('Save valid escape room tests', async () => {
            const escape_room_data = {
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
            const escape_room = EscapeRoomDataMapper.toModel(escape_room_data)
            const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)

            const response: boolean = await escape_rooms.save(escape_room)

            expect(response).toBeTruthy()
        })
        afterEach(async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })
    
    describe('Get all escape rooms by distance', () => {
        beforeAll(async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
        test('Without escape rooms', async () => {
            const coordinate = Coordinate.create('0º 30\'30\" N, 0º 30\'30\" N')
            if(coordinate !== undefined){
                const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)

                const response = await escape_rooms.getAllByDistance(coordinate)

                expect(response.length).toBe(0)
            }
        })
        describe('With escape rooms inserted tests', () => {
            const escape_rooms_data = [
                {
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
            test('With one escape room', async () => {
                const coordinate = Coordinate.create('0º 30\'30\" N, 0º 30\'30\" N')
                if(coordinate !== undefined){
                    const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))

                    const response = await escape_rooms.getAllByDistance(coordinate)

                    expect(response.length).toBe(1)
                    expect(response[0].location.coordinates.toString()).toBe(escape_rooms_data[0].location.coordinates)
                }
            })
            test('With two escape rooms', async () => {
                const coordinate = Coordinate.create('0º 30\'30\" N, 0º 30\'30\" N')
                if(coordinate !== undefined){
                    const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[1]))

                    const response = await escape_rooms.getAllByDistance(coordinate)

                    expect(response.length).toBe(2)
                    expect(coordinate.distance(response[0].location.coordinates) <= coordinate.distance(response[1].location.coordinates)).toBeTruthy()
                }
            })
            test('With n escape rooms', async () => {
                const coordinate = Coordinate.create('0º 30\'30\" N, 0º 30\'30\" N')
                if(coordinate !== undefined){
                    const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)
                    for(let i = 0 ; i < escape_rooms_data.length ; i++){
                        await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[i]))
                    }

                    const response = await escape_rooms.getAllByDistance(coordinate)

                    expect(response.length).toBe(escape_rooms_data.length)
                    for(let i = 0 ; i < response.length - 1 ; i++){
                        expect(coordinate.distance(response[i].location.coordinates) <= coordinate.distance(response[i + 1].location.coordinates)).toBeTruthy()
                    }
                }
            })

            afterEach(async () => {
                const postgres = new Client(PostgresSqlClient)
                await postgres.connect()
                await postgres.query('DELETE FROM escaperooms')
                await postgres.query('DELETE FROM locations')
                await postgres.query('DELETE FROM cities')
                await postgres.query('DELETE FROM countries')
                await postgres.end()
            })
        })
    })
    describe('Find escape room by id', () => {
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
        beforeAll(async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()

            const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)
            await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))
            const postgres2 = new Client(PostgresSqlClient)
            await postgres2.connect()
            const res = await postgres2.query('SELECT id FROM escaperooms')
            await postgres2.end()

            escape_room_data.id = res.rows[0].id
        })
        test('get an existing escape room', async () => {
            const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)

            const response = await escape_rooms.findById(escape_room_data.id)

            expect(response).toBeDefined()
            if(response !== undefined){
                expect(response.id).toBe(escape_room_data.id)
            }
        })
        test('get a non existing escape room', async () => {
            const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)

            const response = await escape_rooms.findById(escape_room_data.id + 1)

            expect(response).toBeUndefined()
        })
        afterAll(async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })
})