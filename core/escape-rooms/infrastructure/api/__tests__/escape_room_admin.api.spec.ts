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

describe('escape room api', () => {
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
    describe('create escape room', () => {
        test('before login', async () => {
            await api
                .post('/escaperoom/admin/create')
                .expect(401)
        })
        describe('after login with a participant account', () => {
            test('after login', async () => {
                await api
                    .post('/escaperoom/admin/create')
                    .set('Authorization', participant_token)
                    .expect(401)
            })
        })
        describe('after login with an admin account', () => {
            test('create a valid escape room', async () => {
                const request = {
                    title: 'test',
                    description: 'test',
                    solution: 'test',
                    difficulty: 1,
                    price: 100,
                    maxSessionDuration: 1,
                    location:{
                        country: 'españa',
                        city: 'córdoba',
                        street: 'test',
                        street_number: 1,
                        coordinates: '0º 30\'30\" N, 0º 30\'30\" N',
                        info: ''
                    }
                }

                await api
                    .post('/escaperoom/admin/create')
                    .set('Authorization', admin_token)
                    .send(request)
                    .expect(200)
            })
            test('create an invalid escape room: wrong coordinates', async () => {
                const request = {
                    title: 'test',
                    description: 'test',
                    solution: 'test',
                    difficulty: 1,
                    price: 100,
                    maxSessionDuration: 1,
                    location:{
                        country: 'españa',
                        city: 'córdoba',
                        street: 'test',
                        street_number: 1,
                        coordinates: '0º 30\'30\"N, 0º 30\'30\" N',
                        info: ''
                    }
                }

                await api
                    .post('/escaperoom/admin/create')
                    .set('Authorization', admin_token)
                    .send(request)
                    .expect(400)
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
    describe('delete escape room', () => {
        test('before login', async () => {
            await api
                .delete('/escaperoom/admin')
                .expect(401)
        })
        describe('after login with a participant account', () => {
            test('after login', async () => {
                await api
                    .delete('/escaperoom/admin')
                    .set('Authorization', participant_token)
                    .expect(401)
            })
        })
        describe('after login with an admin account', () => {
            test('delete a valid escape room', async () => {
                const request = {
                    title: 'test',
                    description: 'test',
                    solution: 'test',
                    difficulty: 1,
                    price: 100,
                    maxSessionDuration: 1,
                    location:{
                        country: 'españa',
                        city: 'córdoba',
                        street: 'test',
                        street_number: 1,
                        coordinates: '0º 30\'30\" N, 0º 30\'30\" N',
                        info: ''
                    }
                }
                await api
                    .post('/escaperoom/admin/create')
                    .set('Authorization', admin_token)
                    .send(request)
                    .expect(200)

                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                const id_response = await postgres.query('SELECT * FROM escaperooms')
                await postgres.end()

                const id = id_response.rows[0].id

                await api
                    .delete(`/escaperoom/admin?id=${id}`)
                    .set('Authorization', admin_token)
                    .expect(200)
            })
            test('delete a non existing escape room', async () => {
                await api
                    .delete(`/escaperoom/admin?id=${1}`)
                    .set('Authorization', admin_token)
                    .expect(200)
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
    describe('get all escape rooms', () => {
        test('before login', async () => {
            await api
                .get('/escaperoom/admin')
                .expect(401)
        })
        describe('after login with a participant account', () => {
            test('after login', async () => {
                await api
                    .get('/escaperoom/admin')
                    .set('Authorization', participant_token)
                    .expect(401)
            })
        })
        describe('after login with an admin account', () => {
            const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
            test('Without escape rooms', async () => {
                const response = await api
                    .get('/escaperoom/admin')
                    .set('Authorization', admin_token)
                    .expect(200)

                expect(response.body.escape_rooms.length).toBe(0)
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
                test('With one escape room', async () => {
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))
                    
                    const response = await api
                        .get('/escaperoom/admin')
                        .set('Authorization', admin_token)
                        .expect(200)
                
                    expect(response.body.escape_rooms.length).toBe(1)
                })
                test('With two escape rooms', async () => {
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[0]))
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[1]))
                    
                    const response = await api
                        .get('/escaperoom/admin')
                        .set('Authorization', admin_token)
                        .expect(200)
                    
                    expect(response.body.escape_rooms.length).toBe(2)
                })
                test('With n escape rooms', async () => {
                    for (let i = 0 ; i < escape_rooms_data.length ; i++){
                        await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_rooms_data[i]))
                    }

                    const response = await api
                        .get('/escaperoom/admin')
                        .set('Authorization', admin_token)
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
        })
    })
    describe('get escape room', () => {
        test('before login', async () => {
            await api
                .get(`/escaperoom/admin/1`)
                .expect(401)
        })
        describe('after login with a participant account', () => {
            test('after login', async () => {
                await api
                    .get(`/escaperoom/admin/1`)
                    .set('Authorization', participant_token)
                    .expect(401)
            })
        })
        describe('after login with an admin account', () => {
            const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
            test('Without escape rooms', async () => {
                await api
                    .get(`/escaperoom/admin/1`)
                    .set('Authorization', admin_token)
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
                        .get(`/escaperoom/admin/${id}`)
                        .query({id: id.toString()})
                        .set('Authorization', admin_token)
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
                        .get(`/escaperoom/admin/${id + 1}`)
                        .query({id: id.toString()})
                        .set('Authorization', admin_token)
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