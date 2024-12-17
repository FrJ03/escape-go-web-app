import { describe } from "@jest/globals";
import { container } from "../../../commons/container/container";
import { EscapeRoomsSql } from "../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository";
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client";
import { EscapeRoomDataMapper } from "../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper";
import { Client } from "pg";
import { ClueDataMapper } from "../../../escape-rooms/infrastructure/persistence/clue.data-mapper";
import { GetNextClueRequest } from "../../dto/requests/get-next-clue.request";

describe('Get next clue use case tests', () => {
    test('Without clues inserted', async () => {
        const request = {
            clues_ids: [],
            escape_room_id: -1
        }

        const response = await container.getNextClue.with(request)

        expect(response.code).toBe(404)
    })
    describe('With clues inserted', () => {
        let escape_room = {
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
        let clues = [
            {
                id: -1,
                escape_room: escape_room.id,
                title: 'test',
                info: 'test'
            },
            {
                id: -1,
                escape_room: escape_room.id,
                title: 'test',
                info: 'test'
            },
            {
                id: -1,
                escape_room: escape_room.id,
                title: 'test',
                info: 'test'
            }
        ]
        beforeAll(async () => {
            const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)

            await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room))

            const postgres = new Client(PostgresSqlConfig)
            await postgres.connect()
            const response = await postgres.query('SELECT * FROM escaperooms')
            await postgres.end()

            escape_room.id = response.rows[0].id

            for (let i = 0 ; i < clues.length ; i++){
                clues[i].escape_room = escape_room.id
                await escape_rooms.saveClue(ClueDataMapper.toModel(clues[i]), clues[i].escape_room)
            }

            const postgres_2 = new Client(PostgresSqlConfig)
            await postgres_2.connect()
            const c_response = await postgres_2.query('SELECT * FROM clues')
            await postgres_2.end()

            for (let i = 0 ; i < clues.length ; i++){
                clues[i].id = c_response.rows[i].id
            }            
        })
        test('Existing clue', async () => {
            const request = {
                clues_ids: [],
                escape_room_id: escape_room.id
            }
    
            const response = await container.getNextClue.with(request)
    
            expect(response.code).toBe(200)
            expect(response.clue.id).toBe(clues[0].id)
        })
        test('With the first clue known', async () => {
            const request = {
                clues_ids: [clues[0].id],
                escape_room_id: escape_room.id
            }
    
            const response = await container.getNextClue.with(request)
    
            expect(response.code).toBe(200)
            expect(response.clue.id).toBe(clues[1].id)
        })
        test('With the second clue known', async () => {
            const request = {
                clues_ids: [clues[1].id],
                escape_room_id: escape_room.id
            }
    
            const response = await container.getNextClue.with(request)
    
            expect(response.code).toBe(200)
            expect(response.clue.id).toBe(clues[0].id)
        })
        test('With two clues known', async () => {
            const request = {
                clues_ids: [clues[0].id, clues[1].id],
                escape_room_id: escape_room.id
            }
    
            const response = await container.getNextClue.with(request)
    
            expect(response.code).toBe(200)
            expect(response.clue.id).toBe(clues[2].id)
        })
        test('With all clues known', async () => {
            const request = {
                clues_ids: [clues[0].id, clues[1].id, clues[2].id],
                escape_room_id: escape_room.id
            }
    
            const response = await container.getNextClue.with(request)
    
            expect(response.code).toBe(204)
        })
        test('invalid escape room id', async () => {
            const request = {
                clues_ids: [],
                escape_room_id: escape_room.id + 1
            }
    
            const response = await container.getNextClue.with(request)
    
            expect(response.code).toBe(404)
        })
        afterAll(async () => {
            const postgres = new Client(PostgresSqlConfig)
            await postgres.connect()
            await postgres.query('DELETE FROM clues')
            await postgres.query('DELETE FROM escaperooms')
            await postgres.query('DELETE FROM locations')
            await postgres.query('DELETE FROM cities')
            await postgres.query('DELETE FROM countries')
            await postgres.end()
        })
    })
})