import supertest from 'supertest'
import app from "../../../../app";
import { afterAll, afterEach, describe, test } from '@jest/globals';
import * as bcrypt from 'bcrypt'
import { Client } from 'pg';
import PostgresSqlConfig from '../../../../commons/infrastructure/database-client/postgresql-client';
import { UsersSql } from '../../../../users/infrastructure/services/users-sql.repository';
import { Email } from '../../../../users/domain/model/value-objects/email';
import { Participant } from '../../../../users/domain/model/participant.entity';
import { Admin } from '../../../../users/domain/model/admin.entity';
import { EscapeRoomDataMapper } from '../../persistence/escape_room.data-mapper';
import { EscapeRoomsSql } from '../../services/escape_rooms_sql.repository';

const api = supertest(app)

describe('escape room participant api', () => {
    const adminData = {
        username: 'admin',
        email: 'admin@test.es',
        password: 'test'
    }
    const participantData = {
        username: 'p',
        email: 'p@test.es',
        password: 'test',
        points: 0
    }
    let admin_token = ''
    let participant_token = ''
    beforeAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions')
        await postgres.query('DELETE FROM users')
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()

        const users = new UsersSql(PostgresSqlConfig)

        const participant = new Participant(
            1, new Email(participantData.email),
            participantData.username,
            await bcrypt.hash(participantData.password, 10),
            participantData.points
        )
        const admin = new Admin(
            1, new Email(adminData.email),
            adminData.username,
            await bcrypt.hash(adminData.password, 10),
        )

        await users.save(participant)
        await users.save(admin)

        const admin_response = await api
            .post('/account/signin', )
            .send({
                email: adminData.email,
                password: adminData.password
            })
            .expect(200)
        
        const participant_response = await api
            .post('/account/signin', )
            .send({
                email: participantData.email,
                password: participantData.password
            })
        
        admin_token = admin_response.body.token
        participant_token = participant_response.body.token
    })
    describe('get all escape rooms by distance tests', () => {
        test('before login', async () => {
            await api
                .post('/escaperoom/participant/proximity')
                .expect(401)
        })
        describe('after login with an admin account', () => {
            test('after login', async () => {
                await api
                    .post('/escaperoom/participant/proximity')
                    .set('Authorization', admin_token)
                    .expect(401)
            })
            afterAll(async () => {
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect();
                await postgres.query('BEGIN');
                await postgres.query('DELETE FROM userssessions');
                await postgres.query('DELETE FROM users');
                await postgres.query('COMMIT');
                await postgres.end();
            })
        })
        describe('after login with a participant account', () => {
            test('valid coordinates', async () => {
                const request = {
                    coordinates: '0º 30\'30\" N, 0º 30\'30\" N'
                }

                await api
                    .post('/escaperoom/participant/proximity')
                    .set('Authorization', participant_token)
                    .send(request)
                    .expect(200)
            })
            describe('with escape rooms inserted', () => {
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
                        }
                    } ,
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
                        } 
                    } ,
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
                        }
                    }
                ]
                test('with one escape room', async () => {
                    const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))

                    const request = {
                        coordinates: '0º 30\'30\" N, 0º 30\'30\" N'
                    }
    
                    const response = await api
                        .post('/escaperoom/participant/proximity')
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)

                    expect(response.body.escape_rooms.length).toBe(1)
                })
                test('with two escape room', async () => {
                    const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[1]))

                    const request = {
                        coordinates: '0º 30\'30\" N, 0º 30\'30\" N'
                    }
    
                    const response = await api
                        .post('/escaperoom/participant/proximity')
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)

                    expect(response.body.escape_rooms.length).toBe(2)
                })
                test('with n escape room', async () => {
                    const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
                    for(let i = 0 ; i < escape_rooms_data.length ; i++){
                        await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[i]))
                    }

                    const request = {
                        coordinates: '0º 30\'30\" N, 0º 30\'30\" N'
                    }
    
                    const response = await api
                        .post('/escaperoom/participant/proximity')
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)

                    expect(response.body.escape_rooms.length).toBe(escape_rooms_data.length)
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
            test('invalid coordinates', async () => {
                const request = {
                    coordinates: '0º30\'30\" N, 0º 30\'30\" N'
                }

                await api
                    .post('/escaperoom/participant/proximity')
                    .set('Authorization', participant_token)
                    .send(request)
                    .expect(400)
            })
            afterAll(async () => {
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect();
                await postgres.query('BEGIN');
                await postgres.query('DELETE FROM userssessions');
                await postgres.query('DELETE FROM users');
                await postgres.query('COMMIT');
                await postgres.end();
            })
        })
    })
    describe('get escape room api endpoint', () => {
        test('before login', async () => {
            await api
                .get(`/escaperoom/participant/1`)
                .expect(401)
        })
        describe('after login with an admin account', () => {
            test('after login', async () => {
                await api
                    .get(`/escaperoom/participant/1`)
                    .set('Authorization', admin_token)
                    .expect(401)
            })
        })
        describe('after login with an admin account', () => {
            const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
            test('Without escape rooms', async () => {
                await api
                    .get(`/escaperoom/participant/1`)
                    .set('Authorization', participant_token)
                    .expect(404)
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
                        }
                    },
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
                        }
                    },
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
                        }
                    }
                ]
                test('Valid escape room', async () => {
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))

                    const postgres = new Client(PostgresSqlConfig)
                    await postgres.connect()
                    const id_response = await postgres.query('SELECT * FROM escaperooms')
                    await postgres.end()
                    const id = id_response.rows[0].id
                    
                    const response = await api
                        .get(`/escaperoom/participant/${id}`)
                        .query({id: id.toString()})
                        .set('Authorization', participant_token)
                        .expect(200)
                
                    expect(response.body.escape_room.id).toBe(id)
                })
                test('Invalid escape room', async () => {
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))

                    const postgres = new Client(PostgresSqlConfig)
                    await postgres.connect()
                    const id_response = await postgres.query('SELECT * FROM escaperooms')
                    await postgres.end()
                    const id = id_response.rows[0].id
                    
                    const response = await api
                        .get(`/escaperoom/participant/${id + 1}`)
                        .query({id: id.toString()})
                        .set('Authorization', participant_token)
                        .expect(404)
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
    })
    afterAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions')
        await postgres.query('DELETE FROM users')
        await postgres.query('DELETE FROM escaperooms')
        await postgres.query('DELETE FROM locations')
        await postgres.query('DELETE FROM cities')
        await postgres.query('DELETE FROM countries')
        await postgres.end()
    })
})