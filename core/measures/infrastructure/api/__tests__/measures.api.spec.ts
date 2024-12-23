import { describe } from "@jest/globals"
import { Client } from "pg"
import PostgresSqlConfig from "../../../../commons/infrastructure/database-client/postgresql-client"
import { UsersSql } from "../../../../users/infrastructure/services/users-sql.repository"
import { Email } from "../../../../users/domain/model/value-objects/email"
import * as bcrypt from 'bcrypt'
import { Participant } from "../../../../users/domain/model/participant.entity"
import { Admin } from "../../../../users/domain/model/admin.entity"
import supertest from "supertest"
import app from "../../../../app"
import UserDataMapper from "../../../../users/infrastructure/persistence/user.data-mapper"
import { SessionsSql } from "../../../../users/infrastructure/services/sessions-sql.repository"
import { SessionDataMapper } from "../../../../users/infrastructure/persistence/session.data-mapper"
import { EscapeRoomsSql } from "../../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository"
import { EscapeRoomDataMapper } from "../../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper"
import { ParticipationsSql } from "../../../../escape-rooms/infrastructure/services/participations_sql.repository"
import { ParticipationDataMapper } from "../../../../escape-rooms/infrastructure/persistence/participation.data-mapper"
import { UserParticipationsSql } from "../../../../game/infrastructure/services/user-participations-sql.repository"
import { UserParticipationDataMapper } from "../../../../game/infrastructure/persistence/user-participation.data-mapper"

const base_url = '/measures'
const api = supertest(app)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('measures api integration tests', () => {
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
        await postgres.query('DELETE FROM usersparticipations')
        await postgres.query('DELETE FROM users')
        await postgres.query('DELETE FROM participations')
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
    describe('get conversion rate tests', () => {
        const url = `${base_url}/conversion`
        test('before login', async () => {
            await api
                .get(url)
                .expect(401)
        })
        describe('after login with a participant account', () => {
            test('after login', async () => {
                await api
                    .get(url)
                    .set('Authorization', participant_token)
                    .expect(401)
            })
        })
        describe('after login with an admin account', () => {
            test('without sessions', async () => {
                const response = await api
                    .get(url)
                    .set('Authorization', admin_token)
                    .expect(200)

                expect(response.body.rate).toBe(0)
            })
            describe('with sessions', () => {
                let user_data = {
                    id: 1,
                    email: 'test1@test.es',
                    username: 'test1',
                    password: 'test',
                    role: 'participant',
                    points: -1
                }
                const n_sessions = 3
                beforeAll(async () => {
                    const users = new UsersSql(PostgresSqlConfig)
        
                    await users.save(UserDataMapper.toModel(user_data))
                    const postgres = new Client(PostgresSqlConfig)
                    postgres.connect()
                    await postgres.query('DELETE FROM userssessions')
                    const user_id = await postgres.query('SELECT id FROM users')
                    postgres.end()
                    user_data.id = user_id.rows[0].id
        
                    const sessions = new SessionsSql(PostgresSqlConfig)
                    
                    for(let i = 0 ; i < n_sessions ; i++){
                        await sessions.save(SessionDataMapper.toModel({
                            id: -1,
                            date: new Date(),
                            user: user_data
                        }))
                    }
                })
                test('without pays', async () => {
                    const response = await api
                        .get(url)
                        .set('Authorization', admin_token)
                        .expect(200)

                    expect(response.body.rate).toBe(0)
                })
                describe('with pays', () => {
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
        
                    let participation = {
                        id: 1, 
                        start_date: new Date(2025, 12, 15, 10, 20, 20),
                        end_date: new Date(2025, 12, 15, 13, 20, 20),
                        points: 0,
                        escape_room: escape_room_data
                    }
                    
                    beforeAll(async () => {
                        const escape_rooms = new EscapeRoomsSql(PostgresSqlConfig)
            
                        await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))
            
                        const postgres2 = new Client(PostgresSqlConfig)
                        await postgres2.connect()
                        const er = await postgres2.query('SELECT * FROM escaperooms')
                        await postgres2.end()
            
                        escape_room_data.id = er.rows[0].id
                        participation.escape_room = escape_room_data
            
                        const participations = new ParticipationsSql(PostgresSqlConfig)
                        await participations.save(ParticipationDataMapper.toModel(participation))
            
                        const postgres3 = new Client(PostgresSqlConfig)
                        await postgres3.connect()
                        const pr = await postgres3.query('SELECT * FROM participations')
                        await postgres3.end()
            
                        participation.id = pr.rows[0].id
        
                        const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
                        await userparticipations.save(UserParticipationDataMapper.toModel({user: user_data, participation: participation}))
                    })
                    test('with one pay', async () => {
                        const response = await api
                            .get(url)
                            .set('Authorization', admin_token)
                            .expect(200)

                        expect(response.body.rate).toBe(1/n_sessions)
                    })
                })
                afterAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
                    
                    await postgres.connect()
                    await postgres.query('DELETE FROM userssessions')
                    await postgres.query('DELETE FROM users WHERE email = $1', [user_data.email])
                    await postgres.end()
                })
            })
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
    describe('get sessions interval tests', () => {
        const url = `${base_url}/sessions-interval`
        test('before login', async () => {
            await api
                .get(url)
                .expect(401)
        })
        describe('after login with a participant account', () => {
            test('after login', async () => {
                await api
                    .get(url)
                    .set('Authorization', participant_token)
                    .expect(401)
            })
        })
        describe('after login with an admin account', () => {
            beforeAll(async () => {
                const postgres = new Client(PostgresSqlConfig)
                        
                await postgres.connect()
                await postgres.query('DELETE FROM userssessions')
                await postgres.end()
            })
            test('without sessions', async () => {
                const response = await api
                    .get(url)
                    .set('Authorization', admin_token)
                    .expect(200)

                expect(response.body.years).toBe(0)
                expect(response.body.months).toBe(0)
                expect(response.body.days).toBe(0)
                expect(response.body.hours).toBe(0)
                expect(response.body.minutes).toBe(0)
                expect(response.body.seconds).toBe(0)
            })
            describe('with sessions', () => {
                let user_data = {
                    id: 1,
                    email: 'test1@test.es',
                    username: 'test1',
                    password: 'test',
                    role: 'participant',
                    points: -1
                }
                const n_sessions = 3
                beforeAll(async () => {
                    const users = new UsersSql(PostgresSqlConfig)
        
                    await users.save(UserDataMapper.toModel(user_data))
                    const postgres = new Client(PostgresSqlConfig)
                    postgres.connect()
                    const user_id = await postgres.query('SELECT id FROM users')
                    postgres.end()
                    user_data.id = user_id.rows[0].id
        
                    const sessions = new SessionsSql(PostgresSqlConfig)
                    
                    for(let i = 0 ; i < n_sessions ; i++){
                        await sessions.save(SessionDataMapper.toModel({
                            id: -1,
                            date: new Date(),
                            user: user_data
                        }))
                        await sleep(1500)
                    }
                })
                test('without pays', async () => {
                    const response = await api
                        .get(url)
                        .set('Authorization', admin_token)
                        .expect(200)

                    expect(response.body.years).toBe(0)
                    expect(response.body.months).toBe(0)
                    expect(response.body.days).toBe(0)
                    expect(response.body.hours).toBe(0)
                    expect(response.body.minutes).toBe(0)
                    expect(response.body.seconds).not.toBe(0)
                })
                afterAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
                    
                    await postgres.connect()
                    await postgres.query('DELETE FROM userssessions')
                    await postgres.query('DELETE FROM users')
                    await postgres.end()
                })
            })
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