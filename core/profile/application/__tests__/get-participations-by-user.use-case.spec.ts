import { Client } from "pg"
import { container } from "../../../commons/container/container"
import PostgresSqlClient from "../../../commons/infrastructure/database-client/postgresql-client"
import * as bcrypt from 'bcrypt'
import { SALT } from "../../../commons/utils/config"
import { Participant } from "../../../users/domain/model/participant.entity"
import { Email } from "../../../users/domain/model/value-objects/email"
import { UsersSql } from "../../../users/infrastructure/services/users-sql.repository"
import { EscapeRoomsSql } from "../../../escape-rooms/infrastructure/services/escape_rooms_sql.repository"
import { EscapeRoomDataMapper } from "../../../escape-rooms/infrastructure/persistence/escape_room.data-mapper"
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client"
import { ParticipationsSql } from "../../../escape-rooms/infrastructure/services/participations_sql.repository"
import { ParticipationDataMapper } from "../../../escape-rooms/infrastructure/persistence/participation.data-mapper"
import { UserParticipationsSql } from "../../../game/infrastructure/services/user-participations-sql.repository"
import { UserParticipationDataMapper } from "../../../game/infrastructure/persistence/user-participation.data-mapper"
import UserDataMapper from "../../../users/infrastructure/persistence/user.data-mapper"


describe('get participations by user use case tests', () => {
    test('non existing user', async () => {
        // Arrange
        const request = {
            email: 'test@test.es'
        }
        // Act
        const response = await container.getParticipationsByUser.with(request)
        // Assert
        expect(response.code).toBe(404)
    })
    describe('existing user', () => {
        beforeAll( async () => {
            const postgres = new Client(PostgresSqlClient)
            await postgres.connect()
            await postgres.query('DELETE FROM userssessions');
            await postgres.query('DELETE FROM users')
            await postgres.end()
        })

        let user_data = {
            id: 1,
            email: 'test1@test.es',
            username: 'test1',
            password: 'test',
            role: 'participant',
            points: -1
        }
        beforeAll(async () => {
            const users = new UsersSql(PostgresSqlConfig)

            await users.save(UserDataMapper.toModel(user_data))

            const postgres = new Client(PostgresSqlConfig)
            await postgres.connect()
            const er = await postgres.query('SELECT id FROM users')
            await postgres.end()

            user_data.id = er.rows[0].id
        })
    
        test('valid user', async () => {
            const request = {
                email: user_data.email,
            }
    
            const response = await container.getParticipationsByUser.with(request);
    
            expect(response.code).toBe(200)
            expect(response.participatons.length).toBe(0)
        })
        test('wrong email', async () => {
            const request = {
                email: 'test',
            }
    
            const response = await container.getParticipationsByUser.with(request);
    
            expect(response.code).toBe(400);
        })
        test('non existing user', async () => {
            const request = {
                email: user_data.email + 'a',
            }
    
            const response = await container.getParticipationsByUser.with(request);
    
            expect(response.code).toBe(404);
        })
        describe('with inscriptions', () => {
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

            let participations_data = [
                {
                    id: 1, 
                    start_date: new Date(2025, 12, 15, 10, 20, 20),
                    end_date: new Date(2025, 12, 15, 13, 20, 20),
                    points: 0,
                    escape_room: escape_room_data
                },
                {
                    id: 1, 
                    start_date: new Date(2025, 12, 15, 13, 20, 20),
                    end_date: new Date(2025, 12, 15, 16, 20, 20),
                    points: 0,
                    escape_room: escape_room_data
                }
            ]
            
            beforeAll(async () => {
                const postgres = new Client(PostgresSqlClient)
                
                await postgres.connect()
                await postgres.query('DELETE FROM participations')
                await postgres.query('DELETE FROM escaperooms')
                await postgres.query('DELETE FROM locations')
                await postgres.query('DELETE FROM cities')
                await postgres.query('DELETE FROM countries')
                await postgres.end()
            
                const escape_rooms = new EscapeRoomsSql(PostgresSqlClient)
    
                await escape_rooms.save(EscapeRoomDataMapper.toModel(escape_room_data))
    
                const postgres2 = new Client(PostgresSqlConfig)
                await postgres2.connect()
                const er = await postgres2.query('SELECT * FROM escaperooms')
                await postgres2.end()
    
                escape_room_data.id = er.rows[0].id

                for (let i = 0 ; i < participations_data.length ; i++){
                    participations_data[i].escape_room = escape_room_data

                    const participations = new ParticipationsSql(PostgresSqlConfig)
                    await participations.save(ParticipationDataMapper.toModel(participations_data[i]))

                    const postgres3 = new Client(PostgresSqlConfig)
                    await postgres3.connect()
                    const pr = await postgres3.query('SELECT * FROM participations')
                    await postgres3.end()
        
                    participations_data[i].id = pr.rows[i].id
                }
            })
            test('with one user inscription', async () => {
                const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
                await userparticipations.save(UserParticipationDataMapper.toModel({user: user_data, participation: participations_data[0]}))
                const request = {
                    email: user_data.email,
                }

                const response = await container.getParticipationsByUser.with(request);
    
                expect(response.code).toBe(200)
                expect(response.participatons.length).toBe(1)
            })
            test('with two user inscription', async () => {
                const userparticipations = new UserParticipationsSql(PostgresSqlConfig)
                await userparticipations.save(UserParticipationDataMapper.toModel({user: user_data, participation: participations_data[0]}))
                await userparticipations.save(UserParticipationDataMapper.toModel({user: user_data, participation: participations_data[1]}))
                const request = {
                    email: user_data.email,
                }

                const response = await container.getParticipationsByUser.with(request);
    
                expect(response.code).toBe(200)
                expect(response.participatons.length).toBe(2)
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
                await postgres.query('DELETE FROM usersparticipations')
                await postgres.query('DELETE FROM participations')
                await postgres.query('DELETE FROM escaperooms')
                await postgres.query('DELETE FROM locations')
                await postgres.query('DELETE FROM cities')
                await postgres.query('DELETE FROM countries')
                await postgres.end()
            })
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