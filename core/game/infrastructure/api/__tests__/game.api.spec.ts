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
import { RegisterUserParticipationRequest } from '../../../dto/requests/register-user-participation.request';
import { EscapeRoomsSql } from '../../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository';
import { EscapeRoomDataMapper } from '../../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper';
import { ParticipationsSql } from '../../../../escape-rooms/infrastructure/services/participations_sql.repository';
import { ParticipationDataMapper } from '../../../../escape-rooms/infrastructure/persistence/participation.data-mapper';
import { ClueDataMapper } from '../../../../escape-rooms/infrastructure/persistence/clue.data-mapper';

const api = supertest(app)
const base_endpoint = '/game'

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
    describe('register user into participation endpoint tests', () => {
        const endpoint = `${base_endpoint}/register`
        test('before login', async () => {
            await api
                .post(endpoint)
                .expect(401)
        })
        describe('after login with an admin account', () => {
            test('after login', async () => {
                await api
                    .post(endpoint)
                    .set('Authorization', admin_token)
                    .expect(401)
            })
        })
        describe('after login with a participant account', () => {
            test('without escape rooms', async () => {
                const request = {
                    user_email: participantData.email,
                    escape_room_id: 1,
                    participation_id: 1
                } as RegisterUserParticipationRequest

                await api
                    .post(endpoint)
                    .set('Authorization', participant_token)
                    .send(request)
                    .expect(404)
            })
            describe('with participations inserted', () => {
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
                        }
                }
                let participation_data = {
                    id: 1, 
                    escape_room: escape_room_data,
                    start_date: new Date(2025, 12, 15, 10, 20, 20),
                    end_date: new Date(2025, 12, 15, 13, 20, 20),
                    points: 0
                }
                beforeAll(async () => {
                    const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))

                    const postgres = new Client(PostgresSqlConfig)
                    await postgres.connect()
                    const er_res = await postgres.query('SELECT * FROM escaperooms')
                    escape_room_data.id = er_res.rows[0].id
                    participation_data.escape_room = escape_room_data

                    const participations = new ParticipationsSql(PostgresSqlConfig)
                    await participations.save(ParticipationDataMapper.toModel(participation_data))

                    const p_res = await postgres.query('SELECT * FROM participations')
                    await postgres.end()
                    participation_data.id = p_res.rows[0].id
                })
                test('register in a valid participation', async () => {
                    const request = {
                        user_email: participantData.email,
                        escape_room_id: escape_room_data.id,
                        participation_id: participation_data.id
                    }
    
                    await api
                        .post(endpoint)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)
                })
                test('invalid user', async () => {
                    const request = {
                        user_email: 's'+participantData.email,
                        escape_room_id: escape_room_data.id,
                        participation_id: participation_data.id
                    }
    
                    await api
                        .post(endpoint)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(404)
                })
                test('invalid escape room', async () => {
                    const request = {
                        user_email: participantData.email,
                        escape_room_id: escape_room_data.id + 1,
                        participation_id: participation_data.id
                    }
    
                    await api
                        .post(endpoint)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(404)
                })
                test('invalid participation', async () => {
                    const request = {
                        user_email: participantData.email,
                        escape_room_id: escape_room_data.id,
                        participation_id: participation_data.id + 1
                    }
    
                    await api
                        .post(endpoint)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(404)
                })
                afterEach(async () => {
                    const postgres = new Client(PostgresSqlConfig)
                    await postgres.connect()
                    await postgres.query('DELETE FROM usersparticipations')
                    await postgres.end()
                })
                afterAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
                    await postgres.connect()
                    await postgres.query('DELETE FROM participations')
                    await postgres.query('DELETE FROM escaperooms')
                    await postgres.query('DELETE FROM locations')
                    await postgres.query('DELETE FROM cities')
                    await postgres.query('DELETE FROM countries')
                    await postgres.end()
                })
            })
        })
    })
    describe('get clue by id endpoint tests', () => {
        const endpoint = `${base_endpoint}/clue`
        test('before login', async () => {
            await api
                .post(endpoint)
                .expect(401)
        })
        describe('after login with an admin account', () => {
            test('after login', async () => {
                await api
                    .post(`${endpoint}/1`)
                    .set('Authorization', admin_token)
                    .expect(401)
            })
        })
        describe('after login with a participant account', () => {
            test('Without clues inserted', async () => {
                const clue_id = 1
                const request = {
                    escape_room_id: -1
                }
            
                await api
                    .post(`${endpoint}/${clue_id}`)
                    .set('Authorization', participant_token)
                    .send(request)
                    .expect(404)
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
                let clue = {
                    id: -1,
                    escape_room: escape_room.id,
                    title: 'test',
                    info: 'test'
                }
                beforeAll(async () => {
                    const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
            
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room))
            
                    const postgres = new Client(PostgresSqlConfig)
                    await postgres.connect()
                    const response = await postgres.query('SELECT * FROM escaperooms')
                    await postgres.end()
            
                    escape_room.id = response.rows[0].id
                    clue.escape_room = escape_room.id
            
                    await escape_rooms.saveClue(ClueDataMapper.toModel(clue), clue.escape_room)
            
                    const postgres_2 = new Client(PostgresSqlConfig)
                    await postgres_2.connect()
                    const c_response = await postgres_2.query('SELECT * FROM clues')
                    await postgres_2.end()
            
                    clue.id = c_response.rows[0].id
                })
                test('Existing clue', async () => {
                    const clue_id = clue.id
                    const request = {
                        escape_room_id: escape_room.id
                    }
                
                    const response = await api
                        .post(`${endpoint}/${clue_id}`)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)

                    expect(response.body.id).toBe(clue.id)
                })
                test('Non existing clue: invalid clue id', async () => {
                    const clue_id = clue.id + 1
                    const request = {
                        escape_room_id: escape_room.id
                    }
                
                    await api
                        .post(`${endpoint}/${clue_id}`)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(404)
                })
                test('Non existing clue: invalid escape room id', async () => {
                    const clue_id = clue.id
                    const request = {
                        escape_room_id: escape_room.id + 1
                    }
                
                    await api
                        .post(`${endpoint}/${clue_id}`)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(404)
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
    })
    describe('get next clue endpoint tests', () => {
        const endpoint = `${base_endpoint}/clue`
        test('before login', async () => {
            await api
                .post(endpoint)
                .expect(401)
        })
        describe('after login with an admin account', () => {
            test('after login', async () => {
                await api
                    .post(endpoint)
                    .set('Authorization', admin_token)
                    .expect(401)
            })
        })
        describe('after login with a participant account', () => {
            test('Without clues inserted', async () => {
                const request = {
                    clues_ids: [],
                    escape_room_id: -1
                }
        
                await api
                    .post(`${endpoint}`)
                    .set('Authorization', participant_token)
                    .send(request)
                    .expect(404)
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
            
                    const response = await api
                        .post(`${endpoint}`)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)
                    expect(response.body.id).toBe(clues[0].id)
                })
                test('With the first clue known', async () => {
                    const request = {
                        clues_ids: [clues[0].id],
                        escape_room_id: escape_room.id
                    }
            
                    const response = await api
                        .post(`${endpoint}`)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)

                    expect(response.body.id).toBe(clues[1].id)
                })
                test('With the second clue known', async () => {
                    const request = {
                        clues_ids: [clues[1].id],
                        escape_room_id: escape_room.id
                    }
            
                    const response = await api
                        .post(`${endpoint}`)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)

                    expect(response.body.id).toBe(clues[0].id)
                })
                test('With two clues known', async () => {
                    const request = {
                        clues_ids: [clues[0].id, clues[1].id],
                        escape_room_id: escape_room.id
                    }
            
                    const response = await api
                        .post(`${endpoint}`)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)

                    expect(response.body.id).toBe(clues[2].id)
                })
                test('With all clues known', async () => {
                    const request = {
                        clues_ids: [clues[0].id, clues[1].id, clues[2].id],
                        escape_room_id: escape_room.id
                    }
            
                    await api
                        .post(`${endpoint}`)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(204)
                })
                test('invalid escape room id', async () => {
                    const request = {
                        clues_ids: [],
                        escape_room_id: escape_room.id + 1
                    }
            
                    await api
                        .post(`${endpoint}`)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(404)
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
    })
    describe('solve escape room endpoint tests', () => {
        const endpoint = `${base_endpoint}/solve`
        test('before login', async () => {
            await api
                .post(endpoint)
                .expect(401)
        })
        describe('after login with an admin account', () => {
            test('after login', async () => {
                await api
                    .post(endpoint)
                    .set('Authorization', admin_token)
                    .expect(401)
            })
        })
        describe('after login with a participant account', () => {
            test('Non exisiting participation', async () => {
                const request = {
                    escape_room_id: 0,
                    participation_id: 0,
                    solution: ''
                }
                
                await api
                    .post(endpoint)
                    .set('Authorization', participant_token)
                    .send(request)
                    .expect(404)
            })
            describe('Participation ended', () => {
                const now = new Date()
                let start_date = new Date(now)
                let end_date = new Date(now)
                
                start_date.setHours(start_date.getHours() - 2)
                end_date.setHours(end_date.getHours() - 1)
            
                let participation_data = {
                    id: 1, 
                    escape_room: {
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
                    start_date: start_date,
                    end_date: end_date,
                    points: 0
                }
                beforeAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
            
                    const escaperooms = new EscapeRoomsSql(PostgresSqlConfig)
                    const participations = new ParticipationsSql(PostgresSqlConfig)
            
                    await escaperooms.save(EscapeRoomDataMapper.toModel(participation_data.escape_room))
                    await postgres.connect()
                    const escaperoom_id = await postgres.query('SELECT id FROM escaperooms')
                    participation_data.escape_room.id = escaperoom_id.rows[0].id
                    
                    await participations.save(ParticipationDataMapper.toModel(participation_data))
                    const participation_id = await postgres.query('SELECT id FROM participations')
                    participation_data.id = participation_id.rows[0].id
                    await postgres.end()
                })
                test('participation ended test', async () => {
                    const request = {
                        escape_room_id: participation_data.escape_room.id,
                        participation_id: participation_data.id,
                        solution: ''
                    }
                    
                    await api
                        .post(endpoint)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(423)
                })
                afterAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
                
                    await postgres.connect()
                    await postgres.query('DELETE FROM participations')
                    await postgres.query('DELETE FROM escaperooms')
                    await postgres.query('DELETE FROM locations')
                    await postgres.query('DELETE FROM cities')
                    await postgres.query('DELETE FROM countries')
                    await postgres.end()
                })
            })
            describe('Participation not started yet', () => {
                const now = new Date()
                let start_date = new Date(now)
                let end_date = new Date(now)
                
                start_date.setHours(start_date.getHours() + 1)
                end_date.setHours(end_date.getHours() + 2)
            
                let participation_data = {
                    id: 1, 
                    escape_room: {
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
                    start_date: start_date,
                    end_date: end_date,
                    points: 0
                }
                beforeAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
            
                    const escaperooms = new EscapeRoomsSql(PostgresSqlConfig)
                    const participations = new ParticipationsSql(PostgresSqlConfig)
            
                    await escaperooms.save(EscapeRoomDataMapper.toModel(participation_data.escape_room))
                    await postgres.connect()
                    const escaperoom_id = await postgres.query('SELECT id FROM escaperooms')
                    participation_data.escape_room.id = escaperoom_id.rows[0].id
                    
                    await participations.save(ParticipationDataMapper.toModel(participation_data))
                    const participation_id = await postgres.query('SELECT id FROM participations')
                    participation_data.id = participation_id.rows[0].id
                    await postgres.end()
                })
                test('participation not started yet test', async () => {
                    const request = {
                        escape_room_id: participation_data.escape_room.id,
                        participation_id: participation_data.id,
                        solution: ''
                    }
                    
                    await api
                        .post(endpoint)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(423)
                })
                afterAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
                
                    await postgres.connect()
                    await postgres.query('DELETE FROM participations')
                    await postgres.query('DELETE FROM escaperooms')
                    await postgres.query('DELETE FROM locations')
                    await postgres.query('DELETE FROM cities')
                    await postgres.query('DELETE FROM countries')
                    await postgres.end()
                })
            })
            describe('valid participation inserted', () => {
                const now = new Date(Date.now())
                let start_date = new Date(now)
                let end_date = new Date(now)
                
                start_date.setHours(start_date.getHours() - 2)
                end_date.setHours(end_date.getHours() + 2)
            
                let participation_data = {
                    id: 1, 
                    escape_room: {
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
                    start_date: start_date,
                    end_date: end_date,
                    points: 0
                }
                beforeAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
            
                    const escaperooms = new EscapeRoomsSql(PostgresSqlConfig)
                    const participations = new ParticipationsSql(PostgresSqlConfig)
            
                    await escaperooms.save(EscapeRoomDataMapper.toModel(participation_data.escape_room))
                    await postgres.connect()
                    const escaperoom_id = await postgres.query('SELECT id FROM escaperooms')
                    participation_data.escape_room.id = escaperoom_id.rows[0].id
                    
                    await participations.save(ParticipationDataMapper.toModel(participation_data))
                    const participation_id = await postgres.query('SELECT id FROM participations')
                    participation_data.id = participation_id.rows[0].id
                    await postgres.end()
                })
                test('not valid solution test', async () => {
                    const request = {
                        escape_room_id: participation_data.escape_room.id,
                        participation_id: participation_data.id,
                        solution: participation_data.escape_room.solution + 's'
                    }
                    
                    await api
                        .post(endpoint)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(400)
                })
                test('valid solution', async () => {
                    const request = {
                        escape_room_id: participation_data.escape_room.id,
                        participation_id: participation_data.id,
                        solution: participation_data.escape_room.solution
                    }
                    
                    await api
                        .post(endpoint)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)
                })
                test('valid solution: upper case', async () => {
                    const request = {
                        escape_room_id: participation_data.escape_room.id,
                        participation_id: participation_data.id,
                        solution: participation_data.escape_room.solution.toUpperCase()
                    }
                    
                    await api
                        .post(endpoint)
                        .set('Authorization', participant_token)
                        .send(request)
                        .expect(200)
                })
                afterAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
                
                    await postgres.connect()
                    await postgres.query('DELETE FROM participations')
                    await postgres.query('DELETE FROM escaperooms')
                    await postgres.query('DELETE FROM locations')
                    await postgres.query('DELETE FROM cities')
                    await postgres.query('DELETE FROM countries')
                    await postgres.end()
                })
            })
        })
    })
})