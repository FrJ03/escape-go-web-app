import { describe, test } from "@jest/globals";
import { Degree } from "../value-objects/degree.entity";
import { Minute } from "../value-objects/minute.entity";
import { Second } from "../value-objects/second.entity";
import { DMSData } from "../dms_data.entity";
import { CardinalDirections } from "../cardinal_directions.entity";

describe('DMS Data tests', () => {
    test('get values', () => {
        const degree = new Degree(60)
        const minute = new Minute(30)
        const second = new Second(30)
        const card_dir = CardinalDirections.East

        const dms_data = new DMSData(degree, minute, second, card_dir)

        expect(dms_data.degrees.value).toBe(degree.value)
        expect(dms_data.minutes.value).toBe(minute.value)
        expect(dms_data.seconds.value).toBe(second.value)
        expect(dms_data.cardinalDirection).toBe(card_dir)
    })
    test('to string method', () => {
        const degree = new Degree(60)
        const minute = new Minute(30)
        const second = new Second(30)
        const card_dir = CardinalDirections.North
        const card_dir_letter = 'N'
        const dms_data_str = `${degree.value}º ${minute.toString()}'${second.toString()}" ${card_dir_letter}`

        const dms_data = new DMSData(degree, minute, second, card_dir)

        expect(dms_data.toString()).toBe(dms_data_str)
    })

    describe('Create from string data', () => {
        test('valid input', () => {
            const degree = 60
            const minute = 30
            const second = 30
            const card_dir = CardinalDirections.North
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º ${minute}'${second}" ${card_dir_letter}`

            const dms_data = DMSData.create(dms_data_str)

            expect(dms_data).toBeDefined()
            if(dms_data){
                expect(dms_data.degrees.value).toBe(degree)
                expect(dms_data.minutes.value).toBe(minute)
                expect(dms_data.seconds.value).toBe(second)
                expect(dms_data.cardinalDirection).toBe(card_dir)
            }
        })
        test('invalid input: degree without space', () => {
            const degree = 60
            const minute = 30
            const second = 30
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º${minute}'${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: missing º', () => {
            const degree = 60
            const minute = 30
            const second = 30
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}  ${minute}'${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: missing \'', () => {
            const degree = 60
            const minute = 30
            const second = 30
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º ${minute} ${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: missing \"', () => {
            const degree = 60
            const minute = 30
            const second = 30
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º ${minute}'${second} ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: missing cardinal direction', () => {
            const degree = 60
            const minute = 30
            const second = 30
            const dms_data_str = `${degree}º ${minute}'${second}  `
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: degree big number', () => {
            const degree = 361
            const minute = 30
            const second = 30
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º ${minute}'${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: degree short number', () => {
            const degree = -1
            const minute = 30
            const second = 30
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º ${minute}'${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: degree big number', () => {
            const degree = 60
            const minute = 60
            const second = 30
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º ${minute}'${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: degree short number', () => {
            const degree = 60
            const minute = -1
            const second = 30
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º ${minute}'${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: degree big number', () => {
            const degree = 60
            const minute = 30
            const second = 60
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º ${minute}'${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: degree short number', () => {
            const degree = 60
            const minute = 30
            const second = -1
            const card_dir_letter = 'N'
            const dms_data_str = `${degree}º ${minute}'${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
        test('invalid input: not valid cardinal direction', () => {
            const degree = 60
            const minute = 30
            const second = -1
            const card_dir_letter = 'A'
            const dms_data_str = `${degree}º ${minute}'${second}" ${card_dir_letter}`
    
            const dms_data = DMSData.create(dms_data_str)
    
            expect(dms_data).toBeUndefined()
        })
    })
})