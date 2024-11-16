import { UsersSql } from "../users-sql.repository";
import PostgresSqlClient from '../../../../commons/infrastructure/database-client/postgresql-client'
import { describe, beforeEach, test } from '@jest/globals'
import UserDataMapper from '../../persistence/user.data-mapper'
import { UserType } from "../../persistence/user.type";
import { ApplicationError } from "../../../../commons/domain/errors/application.error";
import { Client } from "pg";

describe('Insert users test', () => {
    beforeEach( async () => {
        const postgres = new Client(PostgresSqlClient)
        await postgres.connect()
        await postgres.query('DELETE FROM users')
        await postgres.end()
        
    })
    test('Insert the first user', async () => {
        const new_user_email = 'test@test.com'
        const new_user = UserDataMapper.toModel({
            id: 1,
            email: new_user_email,
            username: 'test',
            password: 'test',
            role: 'admin',
            points: -1
        } as UserType)

        const users = new UsersSql(PostgresSqlClient)
        await users.save(new_user)

        const user = await users.findUser(new_user_email)
        
        expect(user).toBeDefined()
    })
    test('Insert a user twice', async () => {
        const new_user_email = 'test@test.com'
        const new_user = UserDataMapper.toModel({
            id: 1,
            email: new_user_email,
            username: 'test',
            password: 'test',
            role: 'admin',
            points: -1
        } as UserType)

        const users = new UsersSql(PostgresSqlClient)
        const first = await users.save(new_user)
        const second = await users.save(new_user)
        
        expect(first).toBeTruthy()
        expect(second).toBeFalsy()
    })
})