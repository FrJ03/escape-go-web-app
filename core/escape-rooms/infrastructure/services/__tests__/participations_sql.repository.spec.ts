import { afterAll, describe } from "@jest/globals";
import { Client } from "pg";
import PostgresSqlClient from '../../../../commons/infrastructure/database-client/postgresql-client'
import { LocationType } from "../../persistence/location.type";
import { EscapeRoomType } from "../../persistence/escape_room.type";
import { EscapeRoomsSql } from "../escape_rooms_sql.repository";
import { EscapeRoomDataMapper } from "../../persistence/escape_room.data-mapper";
import { ParticipationType } from "../../persistence/participation.type";
import { ParticipationsSql } from "../participations_sql.repository";
import { ParticipationDataMapper } from "../../persistence/participation.data-mapper";
import { Coordinate } from "../../../domain/model/coordinate.entity";

describe('Participations repository tests', () => {
    beforeAll(async () => {
        const postgres = new Client(PostgresSqlClient)
        
        await postgres.connect()
        await postgres.query('DELETE FROM participations')
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })
    describe('Save participation tests', () => {
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
            const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)
            const postgres = new Client(PostgresSqlClient)

            await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))
            
            await postgres.connect()
            const response = await postgres.query('SELECT * FROM escaperooms')
            await postgres.end()

            escape_room_data.id = response.rows[0].id
        })

        test('save a valid participation', async () => {
            const participation = {
                id: 1, 
                escape_room: escape_room_data,
                start_date: new Date(2025, 12, 15, 10, 20, 20),
                end_date: new Date(2025, 12, 15, 13, 20, 20),
                points: 0
            } as ParticipationType

            const participations = new ParticipationsSql(PostgresSqlClient)

            const response = await participations.save(ParticipationDataMapper.toModel(participation))

            expect(response).toBeTruthy()
        })
        test('invalid escape_room', async () => {
            let participation = {
                id: 1, 
                escape_room: escape_room_data,
                start_date: new Date(2025, 12, 15, 10, 20, 20),
                end_date: new Date(2025, 12, 15, 13, 20, 20),
                points: 0
            } as ParticipationType

            participation.escape_room.id = participation.escape_room.id + 1

            const participations = new ParticipationsSql(PostgresSqlClient)

            const response = await participations.save(ParticipationDataMapper.toModel(participation))

            expect(response).toBeFalsy()
        })
        afterEach(async () => {
            const postgres = new Client(PostgresSqlClient)
            
            await postgres.connect()
            await postgres.query('DELETE FROM participations')
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })

    describe('find by escape room tests', () => {
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
            const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)
            const postgres = new Client(PostgresSqlClient)

            await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))
            
            await postgres.connect()
            const response = await postgres.query('SELECT * FROM escaperooms')
            await postgres.end()

            escape_room_data.id = response.rows[0].id
        })

        test('There is not any participation for the escape room', async() =>{
            const participations = new ParticipationsSql(PostgresSqlClient)

            const response = await participations.findAllByEscapeRoom(escape_room_data.id)

            expect(response.length).toBe(0)
        })
    describe('With participations', () => {
            test('with one participation', async () => {
                const participation = {
                    id: 1, 
                    escape_room: escape_room_data,
                    start_date: new Date(2025, 12, 15, 10, 20, 20),
                    end_date: new Date(2025, 12, 15, 13, 20, 20),
                    points: 0
                } as ParticipationType
                const participations = new ParticipationsSql(PostgresSqlClient)
    
                await participations.save(ParticipationDataMapper.toModel(participation))

                const response = await participations.findAllByEscapeRoom(escape_room_data.id)

                expect(response.length).toBe(1)
            })
            test('with two participation', async () => {
                const participation = {
                    id: 1, 
                    escape_room: escape_room_data,
                    start_date: new Date(2025, 12, 15, 10, 20, 20),
                    end_date: new Date(2025, 12, 15, 13, 20, 20),
                    points: 0
                } as ParticipationType
                const participations = new ParticipationsSql(PostgresSqlClient)
    
                await participations.save(ParticipationDataMapper.toModel(participation))
                await participations.save(ParticipationDataMapper.toModel(participation))

                const response = await participations.findAllByEscapeRoom(escape_room_data.id)

                expect(response.length).toBe(2)
            })
            afterEach(async () => {
                const postgres = new Client(PostgresSqlClient)
            
                await postgres.connect()
                await postgres.query('DELETE FROM participations')
                await postgres.end()
            })
        })
    })

    describe('find by id tests', () => {
        let participation = {
            id: 1, 
            start_date: new Date(2025, 12, 15, 10, 20, 20),
            end_date: new Date(2025, 12, 15, 13, 20, 20),
            points: 0
        } as ParticipationType
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
            await postgres.query('DELETE FROM participations')
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()

            const coordinate = Coordinate.create('0º 30\'30\" N, 0º 30\'30\" N')
        
            const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)

            await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))

            const postgres2 = new Client(PostgresSqlClient)
            await postgres2.connect()
            const er = await postgres2.query('SELECT * FROM escaperooms')
            await postgres2.end()

            escape_room_data.id = er.rows[0].id
            participation.escape_room = escape_room_data

            const participations = new ParticipationsSql(PostgresSqlClient)
            await participations.save(ParticipationDataMapper.toModel(participation))

            const postgres3 = new Client(PostgresSqlClient)
            await postgres3.connect()
            const pr = await postgres3.query('SELECT * FROM participations')
            await postgres3.end()

            participation.id = pr.rows[0].id
        })

        test('find a valid participation', async () => {
            const participations = new ParticipationsSql(PostgresSqlClient)

            const response = await participations.findById(participation.escape_room.id, participation.id)

            expect(response).toBeDefined()
            if(response !== undefined){
                expect(response.id).toBe(participation.id)
                expect(response.escape_room.id).toBe(participation.escape_room.id)
            }
        })
        test('Invalid participation id', async () => {
            const participations = new ParticipationsSql(PostgresSqlClient)

            const response = await participations.findById(participation.escape_room.id, participation.id + 1)

            expect(response).toBeUndefined()
        })
        test('Invalid escape room id', async () => {
            const participations = new ParticipationsSql(PostgresSqlClient)

            const response = await participations.findById(participation.escape_room.id + 1, participation.id)

            expect(response).toBeUndefined()
        })
        afterAll(async () => {
            const postgres = new Client(PostgresSqlClient)
            
            await postgres.connect()
            await postgres.query('DELETE FROM participations')
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })
    afterAll(async () => {
        const postgres = new Client(PostgresSqlClient)
        
        await postgres.connect()
        await postgres.query('DELETE FROM participations')
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })
})