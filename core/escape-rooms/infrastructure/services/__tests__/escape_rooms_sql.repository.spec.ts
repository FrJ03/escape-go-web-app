import { describe } from "@jest/globals";
import PostgresSqlClient from '../../../../commons/infrastructure/database-client/postgresql-client'
import { Client } from "pg";
import { EscapeRoomType } from "../../persistence/escape_room.type";
import { EscapeRoomDataMapper } from "../../persistence/escape_room.data-mapper";
import { EscapeRoomsSql } from "../escape_rooms_sql.repository";
import { LocationType } from "../../persistence/location.type";

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
})