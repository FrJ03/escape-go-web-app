import { CardinalDirections } from "./cardinal_directions.entity";
import { Degree } from "./value-objects/degree.entity";
import { Minute } from "./value-objects/minute.entity";
import { Second } from "./value-objects/second.entity";

export class DMSData{
    constructor(
        private readonly _degrees: Degree,
        private readonly _minutes: Minute,
        private readonly _seconds: Second,
        private readonly _cardinal_direction: CardinalDirections 
    ){}

    public static create(dms_data: string): DMSData | undefined{
        if(dms_data.length < 9){
            return undefined
        }

        if(!dms_data.includes('º ') || !dms_data.includes('\'') || !dms_data.includes('\" ')){
            return undefined
        }

        const degree_str = dms_data.substring(0, dms_data.indexOf('º'))
        const minute_str = dms_data.substring(dms_data.indexOf('º') + 2, dms_data.indexOf('\''))
        const second_str = dms_data.substring(dms_data.indexOf('\'') + 1, dms_data.indexOf("\""))
        const card_dir_letter = dms_data.substring(dms_data.indexOf("\"") + 2)
        let card_dir

        if(card_dir_letter === 'N'){
            card_dir = CardinalDirections.North
        }
        else if(card_dir_letter === 'E'){
            card_dir = CardinalDirections.East
        }
        else if(card_dir_letter === 'W'){
            card_dir = CardinalDirections.West
        }
        else if(card_dir_letter === 'S'){
            card_dir = CardinalDirections.South
        }
        else{
            return undefined
        }

        if(!Number.isNaN(degree_str) && !Number.isNaN(minute_str) && !Number.isNaN(second_str)){
            const degree = Degree.create(Number(degree_str))
            const minute = Minute.create(Number(minute_str))
            const second = Second.create(Number(second_str))

            if(degree && minute && second){
                return new DMSData(degree, minute, second, card_dir)
            }
            else{
                return undefined
            }
        }
        else{
            return undefined
        }
    }

    get degrees(): Degree{
        return this._degrees
    }
    get minutes(): Minute{
        return this._minutes
    }
    get seconds(): Second{
        return this._seconds
    }

    get cardinalDirection(): CardinalDirections{
        return this._cardinal_direction
    }

    get decimal(): number{
        return this._degrees.value + this._minutes.value/60 + this._seconds.value/60
    }

    get radians(): number{
        return this.decimal * (Math.PI/180)
    }

    public toString(): string{
        const card_dir_letter = 
            (this._cardinal_direction === CardinalDirections.North) ? 
                'N'
            :
                (this._cardinal_direction === CardinalDirections.East) ? 
                    'E'
                :
                    (this._cardinal_direction === CardinalDirections.West) ? 
                        'W'
                    :
                        'S'

        return `${this._degrees.value}º ${this._minutes.toString()}'${this._seconds.toString()}" ${card_dir_letter}`
    }
}