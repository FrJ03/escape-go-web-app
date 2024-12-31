import { Client } from "pg";
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client";
import { EscapeRoomsSql } from "../../infrastructure/services/escape_rooms_sql.repository";
import { GetEscapeRoomInfoRequest } from "../../dto/resquests/get-escape-room-info.request";
import { GetEscapeRoomInfoResponse} from "../../dto/responses/get-escape-room-info.response";
import { GetEscapeRoomInfoByIdUseCase } from "../get-escape-room-info-by-id.use-case";
import { ParticipationsSql } from "../../infrastructure/services/participations_sql.repository";



describe('get escape room info by id use case tests', () => {

    beforeAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        await postgres.connect()
        await postgres.query('DELETE FROM participations');
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })

    test('without escape_rooms inserted', async () => {

        const request: GetEscapeRoomInfoRequest = {

            id: -1

        }
        
        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig);
        const participations = new ParticipationsSql(PostgresSqlConfig);
        const getescaperoominfobyidusecase = new GetEscapeRoomInfoByIdUseCase(escape_rooms, participations);

        const response: GetEscapeRoomInfoResponse = await getescaperoominfobyidusecase.with(request);

        expect(response.code).toBe(404); //no debe encontrar ningun escape_room

    });

    describe('get escape room info by id use case tests', () => {

        beforeAll(async() =>{ //introducir escape_room, participation, location

            let postgres: Client;
            postgres = new Client(PostgresSqlConfig);

            await postgres.connect();
            await postgres.query('INSERT INTO countries (id, country_name) VALUES (1, \'españa\')'); //country
            await postgres.query('INSERT INTO cities (id, city_name, country) VALUES (1, \'cordoba\', 1)'); //cities
            await postgres.query('INSERT INTO locations (id, coordinates, street, street_number, other_info, city) VALUES (1, \'test\', \'test\', 1, \'test\', 1)');
            await postgres.query('INSERT INTO escaperooms (id, title, description, solution, difficulty, price, physical_location, deleted) VALUES (1, \'test\', \'test\', \'test\', 1, 100, 1, false)');
            await postgres.query('INSERT INTO participations (id, escape_room, start_time, points, end_time) VALUES (1, 1, 0, 0, 1)');
            await postgres.end();

        }) //creados he introducidos el escape_room con un participation

        test('with a escape_room inserted', async() => {

            const request: GetEscapeRoomInfoRequest = {
    
                id: 1
        
            }

            const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig);
            const participations = new ParticipationsSql(PostgresSqlConfig);

            const getescaperoominfobyidusecase = new GetEscapeRoomInfoByIdUseCase(escape_rooms, participations);
        
            const response: GetEscapeRoomInfoResponse = await getescaperoominfobyidusecase.with(request);
        
            expect(response.code).toBe(200); //debe encontrar el escape_room
            expect(response.escape_room.id).toBe(1); //debe encontrar el id del escape_room insertado
            expect(response.participations.length).toBe(1); //debe tener al menos algun participations
    
            response.participations.forEach(participation => {
                   
                expect(participation.id).toBe(1);
                expect(participation.start_date).not.toBeUndefined;
                expect(participation.end_date).not.toBeUndefined;
    
            })
    
        });

    });

    afterAll(async () => {

        const postgres = new Client(PostgresSqlConfig)
        await postgres.connect()
        await postgres.query('DELETE FROM participations');
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()

    });  

});