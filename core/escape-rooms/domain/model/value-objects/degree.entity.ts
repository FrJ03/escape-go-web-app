export class Degree{
    constructor(private readonly _value: number){}

    public static create(value: number): Degree | undefined{
        if(value >= 0 && value <= 360){
            return new Degree(value)
        }
        else{
            return undefined
        }
    }

    get value(): number{
        return this._value
    }
}