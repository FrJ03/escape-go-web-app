import supertest from 'supertest'
import app from "../../../../app";
import { afterAll, describe, test } from '@jest/globals';
import * as bcrypt from 'bcrypt'
import { Client } from 'pg';
import PostgresSqlConfig from '../../../../commons/infrastructure/database-client/postgresql-client';
import { UsersSql } from '../../../../users/infrastructure/services/users-sql.repository';
import { Email } from '../../../../users/domain/model/value-objects/email';
import { Participant } from '../../../../users/domain/model/participant.entity';
const api = supertest(app)
const base_endpoint = '/account'

describe('delete user endpoint', () => {
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
    const endpoint = `${base_endpoint}/delete`
    test('before login', async () => {
      const request = {
        email: 'test@test.es',
        password: 'test'
      }
        await api
            .post(endpoint)
            .send(request)
            .expect(401)
    })
    describe('after login an account', () => {
        test('without users inserted', async () => {
            const request = {
                email: 'test@test.es',
                password: 'test'
            }
            await api
                .post(endpoint)
                .set('Authorization', participant_token)
                .send(request)
                .expect(404)
        })
        describe('with users inserted', () => {
          beforeAll(async () => {
            const users = new UsersSql(PostgresSqlConfig)
            const participant = new Participant(
                2, new Email('test2@test.es'),
                'test2',
                await bcrypt.hash('test', 10),
                0
            )
            await users.save(participant)
          })
          test('with correct data', async () => {
            const request = {
                email: 'test2@test.es',
                password: 'test'
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
            await postgres.query('DELETE FROM users WHERE email = $1', ['test2@test.es'])
            await postgres.end()
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