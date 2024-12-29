import supertest from 'supertest'
import app from "../../../../app";
import { afterAll, describe, test } from '@jest/globals';
import * as bcrypt from 'bcrypt'
import { Client } from 'pg';
import PostgresSqlConfig from '../../../../commons/infrastructure/database-client/postgresql-client';
import { UsersSql } from '../../../../users/infrastructure/services/users-sql.repository';
import { Email } from '../../../../users/domain/model/value-objects/email';
import { Participant } from '../../../../users/domain/model/participant.entity';
import { EscapeRoomDataMapper } from '../../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper';
import { ParticipationDataMapper } from '../../../../escape-rooms/infrastructure/persistence/participation.data-mapper';
import { ParticipationsSql } from '../../../../escape-rooms/infrastructure/services/participations_sql.repository';
import { EscapeRoomsSql } from '../../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository';
import { UserParticipationsSql } from '../../../../game/infrastructure/services/user-participations-sql.repository';
import { UserParticipationDataMapper } from '../../../../game/infrastructure/persistence/user-participation.data-mapper';

const api = supertest(app)
const base_endpoint = '/profile'

describe('profile api', () => {
    let participantData = {
        id: 1,
        username: 'p',
        email: 'p@test.es',
        password: 'test',
        points: 0,
        role: 'participant'
    }
    let participant_token = ''
    beforeAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions')
        await postgres.query('DELETE FROM users')
        await postgres.end()

        const users = new UsersSql(PostgresSqlConfig)

        const participant = new Participant(
            1, new Email(participantData.email),
            participantData.username,
            await bcrypt.hash(participantData.password, 10),
            participantData.points
        )

        await users.save(participant)

        const postgres1 = new Client(PostgresSqlConfig)
        await postgres1.connect()
        const er = await postgres1.query('SELECT id FROM users')
        await postgres1.end()

        participantData.id = er.rows[0].id
        
        const participant_response = await api
            .post('/account/signin', )
            .send({
                email: participantData.email,
                password: participantData.password
            })
        
        participant_token = participant_response.body.token
    })
    describe('get profile tests', () => {
        const endpoint = base_endpoint
        test('before login', async () => {
            await api
                .get(endpoint)
                .expect(401)
        })
        describe('after login an account', () => {
            test('get profile', async () => {
                const response = await api
                    .get(endpoint)
                    .set('Authorization', participant_token)
                    .expect(200)
                
                expect(response.body.id).toBeDefined()
                expect(response.body.email).toBe(participantData.email)
                expect(response.body.username).toBe(participantData.username)
                expect(response.body.role).toBe('participant')
                expect(response.body.points).toBe(participantData.points)
            })
        })
    })
    describe('get participatios tests', () => {
        const endpoint = `${base_endpoint}/participations`
        test('before login', async () => {
            await api
                .get(endpoint)
                .expect(401)
        })
        describe('after login with an account', () => {
            test('without inscriptions', async () => {
                const response = await api
                    .get(endpoint)
                    .set('Authorization', participant_token)
                    .expect(200)
                
                expect(response.body.length).toBe(0)
            })
            describe('with inscriptions', () => {
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
    
                let participations_data = [
                    {
                        id: 1, 
                        start_date: new Date(2025, 12, 15, 10, 20, 20),
                        end_date: new Date(2025, 12, 15, 13, 20, 20),
                        points: 0,
                        escape_room: escape_room_data
                    },
                    {
                        id: 1, 
                        start_date: new Date(2025, 12, 15, 13, 20, 20),
                        end_date: new Date(2025, 12, 15, 16, 20, 20),
                        points: 0,
                        escape_room: escape_room_data
                    }
                ]
                
                beforeAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
                    
                    await postgres.connect()
                    await postgres.query('DELETE FROM participations')
                    await postgres.query('DELETE FROM escaperooms')
                    await postgres.query('DELETE FROM locations')
                    await postgres.query('DELETE FROM cities')
                    await postgres.query('DELETE FROM countries')
                    await postgres.end()
                
                    const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
        
                    await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))
        
                    const postgres2 = new Client(PostgresSqlConfig)
                    await postgres2.connect()
                    const er = await postgres2.query('SELECT * FROM escaperooms')
                    await postgres2.end()
        
                    escape_room_data.id = er.rows[0].id
    
                    for (let i = 0 ; i < participations_data.length ; i++){
                        participations_data[i].escape_room = escape_room_data
    
                        const participations = new ParticipationsSql(PostgresSqlConfig)
                        await participations.save(ParticipationDataMapper.toModel(participations_data[i]))
    
                        const postgres3 = new Client(PostgresSqlConfig)
                        await postgres3.connect()
                        const pr = await postgres3.query('SELECT * FROM participations')
                        await postgres3.end()
            
                        participations_data[i].id = pr.rows[i].id
                    }
                })
                test('with one user inscription', async () => {
                    const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
                    await userparticipations.save(UserParticipationDataMapper.toModel({user: participantData, participation: participations_data[0]}))
                        
                    const response = await api
                        .get(endpoint)
                        .set('Authorization', participant_token)
                        .expect(200)
                    
                    expect(response.body.length).toBe(1)
                    expect(Number(response.body[0].id)).toBe(Number(participations_data[0].id))
                })
                test('with two user inscription', async () => {
                    const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
                    await userparticipations.save(UserParticipationDataMapper.toModel({user: participantData, participation: participations_data[0]}))
                    await userparticipations.save(UserParticipationDataMapper.toModel({user: participantData, participation: participations_data[1]}))
                    
                    const response = await api
                        .get(endpoint)
                        .set('Authorization', participant_token)
                        .expect(200)
                    
                    expect(response.body.length).toBe(2)
                    expect(Number(response.body[0].id)).toBe(Number(participations_data[0].id))
                    expect(Number(response.body[1].id)).toBe(Number(participations_data[1].id))
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
                    await postgres.query('DELETE FROM usersparticipations')
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
    describe('modify profile tests', () => {
        const endpoint = `${base_endpoint}/update`
        test('before login', async () => {
            await api
                .put(endpoint)
                .expect(401)
        })
        describe('after login an account', () => {
            test('modify valid profile', async () => {
                const request = {
                    emailNuevo: participantData.email,
                    username: participantData.username + 's',
                    password: participantData.password + 's'
                }
                const response = await api
                    .put(endpoint)
                    .set('Authorization', participant_token)
                    .send(request)
                    .expect(200)
                
                participant_token = response.body.token
            })
            test('wrong email', async () => {
                const request = {
                    emailNuevo: 'test',
                    username: participantData.username + 's',
                    password: participantData.password + 's'
                }
                const response = await api
                    .put(endpoint)
                    .set('Authorization', participant_token)
                    .send(request)
                    .expect(400)
            })
            test('valid email', async () => {
                const request = {
                    emailNuevo: 's' + participantData.email,
                    username: participantData.username + 's',
                    password: participantData.password + 's'
                }
                const response = await api
                    .put(endpoint)
                    .set('Authorization', participant_token)
                    .send(request)
                    .expect(200)
                
                participant_token = response.body.token
            })
        })
        afterAll(async () => {
            const postgres = new Client(PostgresSqlConfig)
            await postgres.connect()
            await postgres.query('DELETE FROM userssessions')
            await postgres.query('DELETE FROM users')
            await postgres.end()

            const users = new UsersSql(PostgresSqlConfig)

            const participant = new Participant(
                1, new Email(participantData.email),
                participantData.username,
                await bcrypt.hash(participantData.password, 10),
                participantData.points
            )

            await users.save(participant)

            const postgres1 = new Client(PostgresSqlConfig)
            await postgres1.connect()
            const er = await postgres1.query('SELECT id FROM users')
            await postgres1.end()

            participantData.id = er.rows[0].id
            
            const participant_response = await api
                .post('/account/signin', )
                .send({
                    email: participantData.email,
                    password: participantData.password
                })
            
            participant_token = participant_response.body.token
        })
    })
    afterAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions')
        await postgres.query('DELETE FROM users')
        await postgres.end()
    })
})