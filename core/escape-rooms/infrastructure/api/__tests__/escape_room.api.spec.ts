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

const api = supertest(app)

describe('escape room api', () => {
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
    })
    describe('create escape room', () => {
        test('before login', async () => {
            await api
                .post('/escaperoom/create')
                .expect(401)
        })
        describe('after login with a participant account', () => {
            const userData = {
                username: 'test',
                email: 'test@test.es',
                password: 'test'
            }
            let token = ''
            beforeAll(async () => {
                const users = new UsersSql(PostgresSqlConfig)

                const email = new Email(userData.email)
                const participant = new Participant(
                    1, email,
                    userData.username,
                    await bcrypt.hash(userData.password, 10),
                    0
                )

                await users.save(participant)

                const response = await api
                    .post('/account/signin', )
                    .send({
                        email: userData.email,
                        password: userData.password
                    })
                    .expect(200)
                
                token = response.body.token
            })
            test('after login', async () => {
                await api
                    .post('/escaperoom/create')
                    .set('Authorization', token)
                    .expect(401)
            })
            afterAll(async () => {
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                await postgres.query('DELETE FROM userssessions')
                await postgres.query('DELETE FROM users')
                await postgres.end()
            })
        })
        describe('after login with an admin account', () => {
            const userData = {
                username: 'test',
                email: 'test@test.es',
                password: 'test'
            }
            let token = ''
            beforeAll(async () => {
                const users = new UsersSql(PostgresSqlConfig)

                const email = new Email(userData.email)
                const participant = new Admin(
                    1, email,
                    userData.username,
                    await bcrypt.hash(userData.password, 10),
                )

                await users.save(participant)

                const response = await api
                    .post('/account/signin', )
                    .send({
                        email: userData.email,
                        password: userData.password
                    })
                    .expect(200)
                
                token = response.body.token
            })
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
                    .post('/escaperoom/create')
                    .set('Authorization', token)
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
                    .post('/escaperoom/create')
                    .set('Authorization', token)
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
            afterAll(async () => {
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                await postgres.query('DELETE FROM userssessions')
                await postgres.query('DELETE FROM users')
                await postgres.end()
            })
        })
    })
    describe('delete escape room', () => {
        test('before login', async () => {
            await api
                .delete('/escaperoom')
                .expect(401)
        })
        describe('after login with a participant account', () => {
            const userData = {
                username: 'test',
                email: 'test@test.es',
                password: 'test'
            }
            let token = ''
            beforeAll(async () => {
                const users = new UsersSql(PostgresSqlConfig)

                const email = new Email(userData.email)
                const participant = new Participant(
                    1, email,
                    userData.username,
                    await bcrypt.hash(userData.password, 10),
                    0
                )

                await users.save(participant)

                const response = await api
                    .post('/account/signin', )
                    .send({
                        email: userData.email,
                        password: userData.password
                    })
                    .expect(200)
                
                token = response.body.token
            })
            test('after login', async () => {
                await api
                    .delete('/escaperoom')
                    .set('Authorization', token)
                    .expect(401)
            })
            afterAll(async () => {
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                await postgres.query('DELETE FROM userssessions')
                await postgres.query('DELETE FROM users')
                await postgres.end()
            })
        })
        describe('after login with an admin account', () => {
            const userData = {
                username: 'test',
                email: 'test@test.es',
                password: 'test'
            }
            let token = ''
            beforeAll(async () => {
                const users = new UsersSql(PostgresSqlConfig)

                const email = new Email(userData.email)
                const participant = new Admin(
                    1, email,
                    userData.username,
                    await bcrypt.hash(userData.password, 10),
                )

                await users.save(participant)

                const response = await api
                    .post('/account/signin', )
                    .send({
                        email: userData.email,
                        password: userData.password
                    })
                    .expect(200)
                
                token = response.body.token
            })
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
                    .post('/escaperoom/create')
                    .set('Authorization', token)
                    .send(request)
                    .expect(200)

                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                const id_response = await postgres.query('SELECT * FROM escaperooms')
                await postgres.end()

                const id = id_response.rows[0].id

                await api
                    .delete(`/escaperoom?id=${id}`)
                    .set('Authorization', token)
                    .expect(200)
            })
            test('delete a non existing escape room', async () => {
                await api
                    .delete(`/escaperoom?id=${1}`)
                    .set('Authorization', token)
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
            afterAll(async () => {
                const postgres = new Client(PostgresSqlConfig)
                await postgres.connect()
                await postgres.query('DELETE FROM userssessions')
                await postgres.query('DELETE FROM users')
                await postgres.end()
            })
        })
    
    })
})