import { UsersSql } from "../users-sql.repository";
import { PostgresSqlClient } from '../../../../commons/infrastructure/database-client/postgresql-client'
import { describe } from '@jest/globals'
import { UserDataMapper } from '../../persistence/user.data-mapper'
import { UserType } from "../../persistence/user.type";
import { ApplicationError } from "../../../../commons/domain/errors/application.error";

describe('Insert users test', () => {
    test('Insert the first user', () => {
        const new_user = UserDataMapper.toModel({
            id: 1,
            email: 'test@test.com',
            username: 'test',
            password: 'test',
            role: 'admin',
            points: -1
        } as UserType)

        const users = new UsersSql(PostgresSqlClient)

        expect(users.save(new_user)).not.toThrow(ApplicationError)
    })
})