import supertest from 'supertest'
import app from "../../../../app";
import { afterAll, describe, test } from '@jest/globals';
import * as bcrypt from 'bcrypt'
import { Client } from 'pg';
import PostgresSqlConfig from '../../../../commons/infrastructure/database-client/postgresql-client';
import { UsersSql } from '../../../../users/infrastructure/services/users-sql.repository';
import { Email } from '../../../../users/domain/model/value-objects/email';
import { Participant } from '../../../../users/domain/model/participant.entity';
import UserDataMapper from '../../../../users/infrastructure/persistence/user.data-mapper';

const api = supertest(app)
const base_endpoint = '/ranking'

describe('ranking api', () => {
    const participantData = {
        username: 'p',
        email: 'p@test.es',
        password: 'test',
        points: 0
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
        
        const participant_response = await api
            .post('/account/signin', )
            .send({
                email: participantData.email,
                password: participantData.password
            })
        
        participant_token = participant_response.body.token
    })
    describe('get ranking tests', () => {
        const endpoint = base_endpoint
        test('before login', async () => {
            await api
                .get(endpoint)
                .expect(401)
        })
        describe('after login an account', () => {
            test('with one user', async () => {
                const response = await api
                    .get(endpoint)
                    .set('Authorization', participant_token)
                    .expect(200)
                
                expect(response.body.length).toBe(1)
            })
            describe('with more users', () => {
                const users_data = [
                    {
                        id: 1,
                        email: 'test1@test.es',
                        username: 'test1',
                        password: 'test',
                        role: 'participant',
                        points: 10
                    },
                    {
                        id: 2,
                        email: 'test2@test.es',
                        username: 'test2',
                        password: 'test',
                        role: 'participant',
                        points: 20
                    },
                    {
                        id: 3,
                        email: 'test3@test.es',
                        username: 'test3',
                        password: 'test',
                        role: 'participant',
                        points: 30
                    }
                ]
                beforeAll(async () => {
                    const users = new UsersSql(PostgresSqlConfig)
                    for(const user_data of users_data){
                        await users.save(UserDataMapper.toModel(user_data))
                    }
                })
                test('get ranking', async () => {
                    const response = await api
                    .get(endpoint)
                    .set('Authorization', participant_token)
                    .expect(200)
                
                    expect(response.body.length).toBe(4)
                    expect(response.body[0].points).toBe(30)
                    expect(response.body[1].points).toBe(20)
                    expect(response.body[2].points).toBe(10)
                    expect(response.body[3].points).toBe(0)
                })
                afterAll(async () => {
                    const postgres = new Client(PostgresSqlConfig)
                    await postgres.connect()
                    for(let i = 0 ; i < users_data.length ; i++){
                        await postgres.query(`DELETE FROM users WHERE email = \'${users_data[i].email}\'`)
                    }
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
        await postgres.end()
    })
})