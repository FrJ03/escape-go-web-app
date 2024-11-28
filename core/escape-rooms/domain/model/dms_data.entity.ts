import { Degree } from "./value-objects/degree.entity";
import { Minute } from "./value-objects/minute.entity";
import { Second } from "./value-objects/second.entity";

export class DMSData{
    constructor(private readonly _degrees: Degree, private readonly _minutes: Minute, private readonly _seconds: Second){}

    public static create(dms_data: string): DMSData | undefined{
        if(dms_data.length < 9){
            return undefined
        }

        if(!dms_data.includes('º ') || !dms_data.includes('\'') || !dms_data.includes('\"')){
            return undefined
        }

        const degree_str = dms_data.substring(0, dms_data.indexOf('º'))
        const minute_str = dms_data.substring(dms_data.indexOf('º') + 2, dms_data.indexOf('\''))
        const second_str = dms_data.substring(dms_data.indexOf('\'') + 1, dms_data.indexOf('\"'))

        if(!Number.isNaN(degree_str) && !Number.isNaN(minute_str) && !Number.isNaN(second_str)){
            const degree = Degree.create(Number(degree_str))
            const minute = Minute.create(Number(minute_str))
            const second = Second.create(Number(second_str))

            if(degree && minute && second){
                return new DMSData(degree, minute, second)
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

    public toString(): string{
        return `${this._degrees.value}º ${this._minutes.toString()}'${this._seconds.toString()}"`
    }
}