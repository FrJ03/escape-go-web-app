import { describe } from "@jest/globals";
import { EscapeRoom } from "../escapeRoom.entity";
import { Location } from "../location.entity";
import { Coordinate } from "../coordinate.entity";
import { Participation } from "../participation.entity";

describe('Participation entity tests', () => {
    test('constructor test', () => {
        const coordinate = Coordinate.create('0º 10\'10\" N, 0º 10\'10\" N')
        if(coordinate !== undefined){
            const location = new Location(1, 'españa', 'cordoba', 'test', 1, coordinate)
            const escape_room = new EscapeRoom(
                1, 'test', 'test', 'test',
                1, 100, 5, location
            )
            const participation_json = {
                id: 1,
                escape_room: escape_room,
                start_date: new Date(2000, 1, 1, 10, 10, 10),
                end_date: new Date(2000, 1, 1, 11, 10, 10),
                points: 100
            }

            const participation = new Participation(participation_json.id,
                participation_json.escape_room, participation_json.start_date, participation_json.end_date,
                participation_json.points)

            expect(participation.id).toBe(participation_json.id)
            expect(participation.escape_room.id).toBe(participation_json.escape_room.id)
            expect(participation.start_date).toBe(participation_json.start_date)
            expect(participation.end_date).toBe(participation_json.end_date)
            expect(participation.duration).toBe('01:00:00')
            expect(participation.points).toBeDefined()
            if(participation.points !== undefined){
                expect(participation.points).toBe(participation_json.points)
            }
        }
        
    })
    describe('create test', () => {
        test('valid participation', () => {
            const coordinate = Coordinate.create('0º 10\'10\" N, 0º 10\'10\" N')
            if(coordinate !== undefined){
                const location = new Location(1, 'españa', 'cordoba', 'test', 1, coordinate)
                const escape_room = new EscapeRoom(
                    1, 'test', 'test', 'test',
                    1, 100, 5, location
                )
                const participation_json = {
                    id: 1,
                    escape_room: escape_room,
                    start_date: new Date(2000, 1, 1, 10, 10, 10),
                    end_date: new Date(2000, 1, 1, 11, 10, 10),
                    points: 100
                }

                const participation = Participation.create(participation_json.id,
                    participation_json.escape_room, participation_json.start_date, participation_json.end_date,
                    participation_json.points)

                expect(participation).toBeDefined()
                if(participation !== undefined){
                    expect(participation.id).toBe(participation_json.id)
                    expect(participation.escape_room.id).toBe(participation_json.escape_room.id)
                    expect(participation.start_date).toBe(participation_json.start_date)
                    expect(participation.end_date).toBe(participation_json.end_date)
                    expect(participation.duration).toBe('01:00:00')
                    expect(participation.points).toBeDefined()
                    if(participation.points !== undefined){
                        expect(participation.points).toBe(participation_json.points)
                    }
                }
            }
        })
        test('invalid participation: one year duration', () => {
            const coordinate = Coordinate.create('0º 10\'10\" N, 0º 10\'10\" N')
            if(coordinate !== undefined){
                const location = new Location(1, 'españa', 'cordoba', 'test', 1, coordinate)
                const escape_room = new EscapeRoom(
                    1, 'test', 'test', 'test',
                    1, 100, 5, location
                )
                const participation_json = {
                    id: 1,
                    escape_room: escape_room,
                    start_date: new Date(2000, 1, 1, 10, 10, 10),
                    end_date: new Date(2001, 1, 1, 11, 10, 10),
                    points: 100
                }

                const participation = Participation.create(participation_json.id,
                    participation_json.escape_room, participation_json.start_date, participation_json.end_date,
                    participation_json.points)

                expect(participation).toBeUndefined()
            }
        })
        test('invalid participation: one month duration', () => {
            const coordinate = Coordinate.create('0º 10\'10\" N, 0º 10\'10\" N')
            if(coordinate !== undefined){
                const location = new Location(1, 'españa', 'cordoba', 'test', 1, coordinate)
                const escape_room = new EscapeRoom(
                    1, 'test', 'test', 'test',
                    1, 100, 5, location
                )
                const participation_json = {
                    id: 1,
                    escape_room: escape_room,
                    start_date: new Date(2000, 1, 1, 10, 10, 10),
                    end_date: new Date(2000, 2, 1, 11, 10, 10),
                    points: 100
                }

                const participation = Participation.create(participation_json.id,
                    participation_json.escape_room, participation_json.start_date, participation_json.end_date,
                    participation_json.points)

                expect(participation).toBeUndefined()
            }
        })
        test('invalid participation: one day duration', () => {
            const coordinate = Coordinate.create('0º 10\'10\" N, 0º 10\'10\" N')
            if(coordinate !== undefined){
                const location = new Location(1, 'españa', 'cordoba', 'test', 1, coordinate)
                const escape_room = new EscapeRoom(
                    1, 'test', 'test', 'test',
                    1, 100, 5, location
                )
                const participation_json = {
                    id: 1,
                    escape_room: escape_room,
                    start_date: new Date(2000, 1, 1, 10, 10, 10),
                    end_date: new Date(2000, 1, 2, 10, 10, 10),
                    points: 100
                }

                const participation = Participation.create(participation_json.id,
                    participation_json.escape_room, participation_json.start_date, participation_json.end_date,
                    participation_json.points)

                expect(participation).toBeUndefined()
            }
        })
        test('invalid participation: end hour < start hour', () => {
            const coordinate = Coordinate.create('0º 10\'10\" N, 0º 10\'10\" N')
            if(coordinate !== undefined){
                const location = new Location(1, 'españa', 'cordoba', 'test', 1, coordinate)
                const escape_room = new EscapeRoom(
                    1, 'test', 'test', 'test',
                    1, 100, 5, location
                )
                const participation_json = {
                    id: 1,
                    escape_room: escape_room,
                    start_date: new Date(2000, 1, 1, 10, 10, 10),
                    end_date: new Date(2000, 1, 1, 9, 10, 10),
                    points: 100
                }

                const participation = Participation.create(participation_json.id,
                    participation_json.escape_room, participation_json.start_date, participation_json.end_date,
                    participation_json.points)

                expect(participation).toBeUndefined()
            }
        })
        test('invalid participation: end minute < start minute', () => {
            const coordinate = Coordinate.create('0º 10\'10\" N, 0º 10\'10\" N')
            if(coordinate !== undefined){
                const location = new Location(1, 'españa', 'cordoba', 'test', 1, coordinate)
                const escape_room = new EscapeRoom(
                    1, 'test', 'test', 'test',
                    1, 100, 5, location
                )
                const participation_json = {
                    id: 1,
                    escape_room: escape_room,
                    start_date: new Date(2000, 1, 1, 10, 10, 10),
                    end_date: new Date(2000, 1, 1, 10, 9, 10),
                    points: 100
                }

                const participation = Participation.create(participation_json.id,
                    participation_json.escape_room, participation_json.start_date, participation_json.end_date,
                    participation_json.points)

                expect(participation).toBeUndefined()
            }
        })
        test('invalid participation: end second < start second', () => {
            const coordinate = Coordinate.create('0º 10\'10\" N, 0º 10\'10\" N')
            if(coordinate !== undefined){
                const location = new Location(1, 'españa', 'cordoba', 'test', 1, coordinate)
                const escape_room = new EscapeRoom(
                    1, 'test', 'test', 'test',
                    1, 100, 5, location
                )
                const participation_json = {
                    id: 1,
                    escape_room: escape_room,
                    start_date: new Date(2000, 1, 1, 10, 10, 10),
                    end_date: new Date(2000, 1, 1, 10, 10, 9),
                    points: 100
                }

                const participation = Participation.create(participation_json.id,
                    participation_json.escape_room, participation_json.start_date, participation_json.end_date,
                    participation_json.points)

                expect(participation).toBeUndefined()
            }
        })
        test('invalid participation: end second = start second', () => {
            const coordinate = Coordinate.create('0º 10\'10\" N, 0º 10\'10\" N')
            if(coordinate !== undefined){
                const location = new Location(1, 'españa', 'cordoba', 'test', 1, coordinate)
                const escape_room = new EscapeRoom(
                    1, 'test', 'test', 'test',
                    1, 100, 5, location
                )
                const participation_json = {
                    id: 1,
                    escape_room: escape_room,
                    start_date: new Date(2000, 1, 1, 10, 10, 10),
                    end_date: new Date(2000, 1, 1, 10, 10, 10),
                    points: 100
                }

                const participation = Participation.create(participation_json.id,
                    participation_json.escape_room, participation_json.start_date, participation_json.end_date,
                    participation_json.points)

                expect(participation).toBeUndefined()
            }
        })
    })
})