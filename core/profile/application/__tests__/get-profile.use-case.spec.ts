import { describe } from "@jest/globals"
import { container } from "../../../commons/container/container"
import { Client } from "pg"
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client"
import { Participant } from "../../../users/domain/model/participant.entity"
import * as bcrypt from 'bcrypt'
import { Email } from "../../../users/domain/model/value-objects/email"
import { UsersSql } from "../../../users/infrastructure/services/users-sql.repository"
import { SALT } from "../../../commons/utils/config"

describe('get profile use case tests', () => {
    test('non existing user', async () => {
        // Arrange
        const request = {
            email: 'test@test.es'
        }
        // Act
        const response = await container.getProfile.with(request)
        // Assert
        expect(response.code).toBe(404)
    })
    describe('existing user', () => {
        beforeEach( async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM userssessions');
            await postgres.query('DELETE FROM users')
            await postgres.end()
        })

        const user_data = {
            email: 'test@test.es',
            username: 'test',
            password: 'test'
        }

        beforeEach(async () => {
            const password_cipher = await bcrypt.hash(user_data.password, SALT);
            const new_user = new Participant(1, new Email(user_data.email), user_data.username, password_cipher)
    
            const users = new UsersSql(PostgresSqlClient)
            await users.save(new_user)
        })
    
        test('valid user', async () => {
            const request = {
                email: user_data.email,
            }
    
            const response = await container.getProfile.with(request);
    
            expect(response.code).toBe(200);
            expect(response.user.email).toBe(user_data.email);
            expect(response.user.username).toBe(user_data.username);
            expect(response.user.role).toBe('participant');
        })
        test('wrong email', async () => {
            const request = {
                email: 'test',
            }
    
            const response = await container.getProfile.with(request);
    
            expect(response.code).toBe(400);
        })
        test('non existing user', async () => {
            const request = {
                email: user_data.email + 'a',
            }
    
            const response = await container.getProfile.with(request);
    
            expect(response.code).toBe(404);
        })
    
        afterAll( async () => {
    
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM userssessions');
            await postgres.query('DELETE FROM users')
            await postgres.end()
            
        })
    })
})