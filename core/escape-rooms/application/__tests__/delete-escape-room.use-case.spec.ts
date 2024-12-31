import { describe, test, beforeAll, afterEach, afterAll } from "@jest/globals";
import { Client } from "pg";
import { EscapeRoomsSql } from "../../infrastructure/services/escape_rooms_sql.repository";
import { DeleteEscapeRoomUseCase } from "../delete-escape-room.use-case";
import PostgresSqlConfig from '../../../commons/infrastructure/database-client/postgresql-client';
import { CreateEscapeRoomRequest } from "../../dto/resquests/create-escape-room.request";
import { CreateEscapeRoomUseCase } from "../create-escape-room.use-case";

describe('Delete escape room use case tests', () => {
    let postgres: Client;
    let escape_rooms: EscapeRoomsSql;
    let createdEscapeRoomId: number | undefined;

    beforeAll(async () => {
        postgres = new Client(PostgresSqlConfig);
        await postgres.connect();

        const escape_room_data: CreateEscapeRoomRequest = {
            title: 'test',
            description: 'test',
            solution: 'test',
            difficulty: 1,
            price: 100,
            maxSessionDuration: 3,
            location: {
                country: 'test_country',
                city: 'test_city',
                street: 'test_street',
                street_number: 1,
                coordinates: '0º 30\'30" N, 0º 30\'30" W',
                info: '',
            },
            clues: [],
        };

        escape_rooms = new EscapeRoomsSql(PostgresSqlConfig);

        const create_escape_room = new CreateEscapeRoomUseCase(escape_rooms);
        const createResponse = await create_escape_room.with(escape_room_data);

        if (createResponse.code === 200 && createResponse.id !== undefined) {
            // Asignar el ID del escape room creado para usarlo en el test de borrado
            createdEscapeRoomId = createResponse.id;
        }
    });

    afterEach(async () => {
        await postgres.query('DELETE FROM clues');
        await postgres.query('DELETE FROM escaperooms');
        await postgres.query('DELETE FROM locations');
        await postgres.query('DELETE FROM cities');
        await postgres.query('DELETE FROM countries');
    });

    afterAll(async () => {
        await postgres.end();
    });

    test('Borrar un escape room existente', async () => {
        if (createdEscapeRoomId === undefined) {
            throw new Error('ID no encontrado');
        }

        // Verificar si el escape room existe antes de borrarlo
        const escapeRoom = await escape_rooms.findById(createdEscapeRoomId);
        if (!escapeRoom) {
            return { code: 404 };
        }

        const request = { id: createdEscapeRoomId };
        const delete_escape_room = new DeleteEscapeRoomUseCase(escape_rooms);
        const response = await delete_escape_room.with(request);

        if (response.code === 200 && response) {
            // Verificar si realmente fue eliminado
            const checkDeleted = await escape_rooms.findById(createdEscapeRoomId);
            expect(checkDeleted).toBe(null); // No debe encontrarse el escape room eliminado
        }

        expect(response.code).toBe(200);
    });

    test('Borrar un escape room que no existe', async () => {
        const request = { id: 9999 }; // Se asume que este Id no existe
        const delete_escape_room = new DeleteEscapeRoomUseCase(escape_rooms);
        const response = await delete_escape_room.with(request);
        expect(response.code).toBe(404);
    });
});
