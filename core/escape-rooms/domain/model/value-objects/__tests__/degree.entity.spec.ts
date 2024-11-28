import { describe } from "@jest/globals";
import { Degree } from "../degree.entity";

describe('Degree Value Object tests', () => {
    test('get value test', () => {
        const value = 10
        const degree: Degree = new Degree(value)

        expect(degree.value).toBe(value)
    })
    describe('Create Degree object tests', () => {
        test('valid degree (0)', () => {
            const value = 0
            const degree = Degree.create(value)

            expect(degree).toBeDefined()

            if(degree){
                expect(degree.value).toBe(value)
            }
        })
        test('valid degree (360)', () => {
            const value = 360
            const degree = Degree.create(value)

            expect(degree).toBeDefined()

            if(degree){
                expect(degree.value).toBe(value)
            }
        })
        test('invalid degree (-1)', () => {
            const value = -1
            const degree = Degree.create(value)

            expect(degree).toBeUndefined()
        })
        test('invalid degree (361)', () => {
            const value = -361
            const degree = Degree.create(value)

            expect(degree).toBeUndefined()
        })
    })
})