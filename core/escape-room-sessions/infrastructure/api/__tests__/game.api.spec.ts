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
import { ParticipationType } from '../../../../escape-rooms/infrastructure/persistence/participation.type';
import { EscapeRoom } from '../../../../escape-rooms/domain/model/escapeRoom.entity';
import { EscapeRoomsSql } from '../../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository';
import { EscapeRoomDataMapper } from '../../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper';
import { ParticipationsSql } from '../../../../escape-rooms/infrastructure/services/participations_sql.repository';
import { ParticipationDataMapper } from '../../../../escape-rooms/infrastructure/persistence/participation.data-mapper';

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
    describe('register user into participation', () => {
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