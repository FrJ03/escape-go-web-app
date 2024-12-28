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
import e from 'express';

const api = supertest(app)
const base_endpoint = '/profile'

describe('profile api', () => {
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
    afterAll(async () => {
        const postgres = new Client(PostgresSqlConfig)
        await postgres.connect()
        await postgres.query('DELETE FROM userssessions')
        await postgres.query('DELETE FROM users')
        await postgres.end()
    })
})