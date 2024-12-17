import { describe, test, expect, beforeAll, afterEach } from "@jest/globals";
import { Client } from "pg";
import { EscapeRoomsSql } from "../../infrastructure/services/escape_rooms_sql.repository";
import { UpdateEscapeRoomUseCase } from "../update-escape-room.use-case";
import PostgresSqlConfig from '../../../commons/infrastructure/database-client/postgresql-client';
import { UpdateEscapeRoomRequest } from "../../dto/resquests/update-escape-room.request";

describe('Update escape room use case tests', () => {
    
    let postgres: Client;
    let newEscapeRoomData: any;
    postgres = new Client(PostgresSqlConfig);
    
    beforeAll(async () => {
        await postgres.connect()
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')

        //Insertar datos para la prueba
        await postgres.query(`insert into countries (id,country_name) values (995,'Spain');`); // Insertar un pais
        await postgres.query(`insert into cities (id,city_name,country) values (992,'Cordoba',995);`); // Insertar una ciudad
        await postgres.query(`insert into locations (id,coordinates,street,street_number,other_info,city) values (992,'sd','a',7,'',992);`); // Insertar localizacion
        
        // Insertar un escape room inicial para las pruebas
         newEscapeRoomData = {
            title: 'test',
            description: 'test',
            solution: 'test',
            difficulty: 3,
            price: 150,
            maxSessionDuration: 5,
            location: 992
        };

        await postgres.query(`
            INSERT INTO escaperooms (id, title, description, solution, difficulty, price, physical_location, deleted)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) `, [900,newEscapeRoomData.title, newEscapeRoomData.description,newEscapeRoomData.solution,newEscapeRoomData.difficulty,newEscapeRoomData.price,newEscapeRoomData.location,false]);
        

    });

    afterAll(async () => {
        await postgres.query('DELETE FROM escaperooms');
        await postgres.query('DELETE FROM locations');
        await postgres.query('DELETE FROM cities');
        await postgres.query('DELETE FROM countries');
        await postgres.end();
    });

    test('Actualizar escape room existente', async () => {
        const request: UpdateEscapeRoomRequest = {
            id: 900,
            title: 'Updated Title',
            description: 'Updated Description',
            solution: 'Updated Solution',
            difficulty: 4,
            price: 200,
        };

        let escape_rooms: EscapeRoomsSql;
        escape_rooms = new EscapeRoomsSql(PostgresSqlConfig);
        const update_escape_room = new UpdateEscapeRoomUseCase(escape_rooms);
        const response = await update_escape_room.with(request);

        expect(response.code).toBe(200);
    });

    test('No debe actualizar escape room que no existe', async () => {
        const request = {
            id: 958, // ID que no existe
            title: 'New Title',
            description: 'New Description',
            solution: 'New Solution',
            difficulty: 2,
            price: 120
        } as UpdateEscapeRoomRequest;

        let escape_rooms: EscapeRoomsSql;
        escape_rooms = new EscapeRoomsSql(PostgresSqlConfig);
        const update_escape_room = new UpdateEscapeRoomUseCase(escape_rooms);
        const response = await update_escape_room.with(request);

        expect(response.code).toBe(404);
    });

});

    

