import { afterAll, describe } from "@jest/globals";
import { Client } from "pg";
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client";
import { container } from "../../../commons/container/container";
import { EscapeRoomsSql } from "../../infrastructure/services/escape_rooms_sql.repository";
import { EscapeRoomDataMapper } from "../../infrastructure/persistence/escape_room.data-mapper";

describe('get escape room use case tests', () => {
    beforeAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        await postgres.connect()
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })
    test('without escape rooms inserted', async () => {
        const response = await container.getEscapeRoom.with({id: 1})

        expect(response.code).toBe(404)
    })
    describe('with escape rooms inserted', () => {
        const escape_room = {
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
        let id = 1
        beforeAll(async () =>{
            const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)

            await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room))

            const postgres = new Client(PostgresSqlConfig)
            await postgres.connect()
            const response = await postgres.query('SELECT * FROM escaperooms')
            await postgres.end()

            id = response.rows[0].id
        })
        test('find valid escape room', async () => {
            const response = await container.getEscapeRoom.with({id: id})

            expect(response.code).toBe(200)
            expect(response.escape_room.id).toBe(id)
        })
        test('find invalid escape room', async () => {
            const response = await container.getEscapeRoom.with({id: id + 1})

            expect(response.code).toBe(404)
        })
        afterAll(async () => {
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