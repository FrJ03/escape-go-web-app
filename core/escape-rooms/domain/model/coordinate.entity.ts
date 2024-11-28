import { DMSData } from "./dms_data.entity";

export class Coordinate{
    constructor(private readonly _latitude: DMSData, private readonly _longitude: DMSData){}

    public static create(value: string): Coordinate | undefined{
        if(!value.includes(', ')){
            return undefined
        }

        const latitude_str = value.substring(0, value.indexOf(', '))
        const longitude_str = value.substring(value.indexOf(', ') + 2)

        const latitude = DMSData.create(latitude_str)
        const longitude = DMSData.create(longitude_str)

        if(latitude && longitude){
            return new Coordinate(latitude, longitude)
        }
        else{
            return undefined
        }
    }

    get latitude(): DMSData{
        return this._latitude
    }
    get longitude(): DMSData{
        return this._longitude
    }

    public toString(): string{
        return `${this._latitude}, ${this._longitude}`
    }
}