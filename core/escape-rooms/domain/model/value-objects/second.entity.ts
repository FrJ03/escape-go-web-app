export class Second{
    constructor(private readonly _value: number){}

    public static create(value: number): Second | undefined{
        if(value >= 0 && value <= 59){
            return new Second(value)
        }
        else{
            return undefined
        }
    }

    get value(): number{
        return this._value
    }

    public toString(): string{
        if(this._value >= 10){
            return `${this._value}`
        }
        else{
            return `0${this._value}`
        }
    }
}