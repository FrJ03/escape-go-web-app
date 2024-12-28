import { container } from "../../../commons/container/container"
import { UsersSql } from "../../../users/infrastructure/services/users-sql.repository"
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client"
import UserDataMapper from "../../../users/infrastructure/persistence/user.data-mapper"
import { Client } from "pg"

describe('get ranking use case tests', () => {
    test('whitout participants', async () => {
        const response = await container.getRanking.with()

        expect(response.code).toBe(200)
        expect(response.ranking.length).toBe(0)
    })
    describe('with participants', () => {
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
            const users = new UsersSql(PostgresSqlClient)
            for(const user_data of users_data){
                await users.save(UserDataMapper.toModel(user_data))
            }
        })
        test('Get all users', async () => {
            const response = await container.getRanking.with()

            expect(response.code).toBe(200)
            expect(response.ranking.length).toBe(3)
            expect(response.ranking[0].points).toBe(30)
            expect(response.ranking[0].username).toBe('test3')
            expect(response.ranking[1].points).toBe(20)
            expect(response.ranking[1].username).toBe('test2')
            expect(response.ranking[2].points).toBe(10)
            expect(response.ranking[2].username).toBe('test1')
        })
        afterAll(async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM users')
            await postgres.end()
        })
    })
})
