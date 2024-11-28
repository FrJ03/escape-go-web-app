import { describe } from "@jest/globals";
import { DMSData } from "../dms_data.entity";
import { Degree } from "../value-objects/degree.entity";
import { Minute } from "../value-objects/minute.entity";
import { Second } from "../value-objects/second.entity";
import { CardinalDirections } from "../cardinal_directions.entity";
import { Coordinate } from "../coordinate.entity";

describe('Coordinate entity tests', () => {
    test('get values', () => {
        const latitude = new DMSData(new Degree(60), new Minute(30), new Second(30), CardinalDirections.North)
        const longitude = new DMSData(new Degree(60), new Minute(30), new Second(30), CardinalDirections.North)

        const coordiante = new Coordinate(latitude, longitude)

        expect(coordiante.latitude.toString()).toBe(latitude.toString())
        expect(coordiante.longitude.toString()).toBe(longitude.toString())
    })
    test('to string method', () => {
        const latitude = new DMSData(new Degree(60), new Minute(30), new Second(30), CardinalDirections.North)
        const longitude = new DMSData(new Degree(60), new Minute(30), new Second(30), CardinalDirections.North)
        const coordiante_str = `${latitude.toString()}, ${longitude.toString()}`

        const coordiante = new Coordinate(latitude, longitude)

        expect(coordiante.toString()).toBe(coordiante_str)
    })
    describe('create method', () => {
        test('valid input', () => {
            const coordiante_str = `60º 30\'30\" N, 60º 30\'30\" N`

            const coordinate = Coordinate.create(coordiante_str)

            expect(coordinate).toBeDefined()
            if(coordinate){
                expect(coordinate.latitude.toString()).toBe('60º 30\'30\" N')
                expect(coordinate.longitude.toString()).toBe('60º 30\'30\" N')
            }
        })
        test('invalid input: without comma', () => {
            const coordiante_str = `60º 30\'30\" N 60º 30\'30\" N`

            const coordinate = Coordinate.create(coordiante_str)

            expect(coordinate).toBeUndefined()
        })
        test('invalid input: without space', () => {
            const coordiante_str = `60º 30\'30\" N,60º 30\'30\" N`

            const coordinate = Coordinate.create(coordiante_str)

            expect(coordinate).toBeUndefined()
        })
        test('invalid input: bad latitude format', () => {
            const coordiante_str = `60º 60\'30\" N 60º 30\'30\" N`

            const coordinate = Coordinate.create(coordiante_str)

            expect(coordinate).toBeUndefined()
        })
        test('invalid input: bad longitude format', () => {
            const coordiante_str = `60º 30\'30\" N 60º 30\'60\" N`

            const coordinate = Coordinate.create(coordiante_str)

            expect(coordinate).toBeUndefined()
        })
    })
})