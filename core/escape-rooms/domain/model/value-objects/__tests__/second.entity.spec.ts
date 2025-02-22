import { describe, test } from "@jest/globals";
import { Second } from "../second.entity";

describe('Minute Value Object tests', () => {
    test('get value test', () => {
        const value = 10

        const minute: Second = new Second(value)

        expect(minute.value).toBe(value)
    })
    describe('Create Minute tests', () => {
        test('valid minute (0)', () => {
            const value = 0
    
            const minute = Second.create(value)
    
            expect(minute).toBeDefined()
            if(minute){
                expect(minute.value).toBe(value)
            }
        })
        test('valid minute (59)', () => {
            const value = 59
    
            const minute = Second.create(value)
    
            expect(minute).toBeDefined()
            if(minute){
                expect(minute.value).toBe(value)
            }
        })
        test('invalid minute (-1)', () => {
            const value = -1
    
            const minute = Second.create(value)
    
            expect(minute).toBeUndefined()
        })
        test('invalid minute (60)', () => {
            const value = 60
    
            const minute = Second.create(value)
    
            expect(minute).toBeUndefined()
        })
    })
    describe('to string method', () => {
        test(' value < 10', () => {
            const value = 9
            const str_value = `0${value}`

            const minute: Second = new Second(value)

            expect(minute.toString()).toBe(str_value)
        })
        test(' value = 10', () => {
            const value = 10
            const str_value = `${value}`

            const minute: Second = new Second(value)

            expect(minute.toString()).toBe(str_value)
        })
    })
})