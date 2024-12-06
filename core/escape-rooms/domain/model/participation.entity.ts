import { EscapeRoom } from "./escapeRoom.entity";

export class Participation {
    constructor(
        private readonly _id: number,
        private readonly _escape_room: EscapeRoom,
        private readonly _start_date: Date,
        private readonly _end_date: Date,
        private readonly _points: number | undefined
    ){}

    public static create(id: number, escape_room: EscapeRoom, start_date: Date, end_date: Date, points: number | undefined): Participation | undefined{
        if(
            start_date.getFullYear() === end_date.getFullYear() &&
            start_date.getMonth() === end_date.getMonth() &&
            start_date.getDay() === end_date.getDay() &&
            (
                end_date.getHours() > start_date.getHours() ||
                (
                    end_date.getHours() === start_date.getHours() &&
                    end_date.getMinutes() > start_date.getMinutes() ||
                    (
                        end_date.getMinutes() === start_date.getMinutes() && 
                        end_date.getSeconds() > start_date.getSeconds()
                    )
                )
            )
        ){
            return new Participation(id, escape_room, start_date, end_date, points)
        }
        else{
            return undefined
        }
        
    }
    
    get id(): number{
        return this._id
    }
    get escape_room(): EscapeRoom{
        return this._escape_room
    }
    get start_date(): Date{
        return this._start_date
    }
    get end_date(): Date{
        return this._end_date
    }
    get duration(){
        let duration_string = ''

        if(this._end_date.getHours() - this._start_date.getHours() < 10){
            duration_string += `0${this._end_date.getHours() - this._start_date.getHours()}:`
        }
        else{
            duration_string += `${this._end_date.getHours() - this._start_date.getHours()}:`
        }

        if(this._end_date.getMinutes() - this._start_date.getMinutes() < 10){
            duration_string += `0${this._end_date.getMinutes() - this._start_date.getMinutes()}:`
        }
        else{
            duration_string += `${this._end_date.getMinutes() - this._start_date.getMinutes()}:`
        }

        if(this._end_date.getSeconds() - this._start_date.getSeconds() < 10){
            duration_string += `0${this._end_date.getSeconds() - this._start_date.getSeconds()}`
        }
        else{
            duration_string += `${this._end_date.getSeconds() - this._start_date.getSeconds()}`
        }

        return duration_string
    }
    get points(): number | undefined{
        return this._points
    }
}