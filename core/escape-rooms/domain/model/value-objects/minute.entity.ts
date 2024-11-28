export class Minute{
    constructor(private readonly _value: number){}

    public static create(value: number): Minute | undefined{
        if(value >= 0 && value <= 59){
            return new Minute(value)
        }
        else{
            return undefined
        }
    }

    get value(): number{
        return this._value
    }
}