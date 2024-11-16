import {User} from './user.entity';
import { Email } from './value-objects/email';

export class Participant extends User{

    private _points: number;

    constructor(id: number, e_mail: Email, username: string, password: string, points?: number){ //constructor parametrizado

        super(id, e_mail, username, password);

        if(points != undefined){

            this._points = points;

        }
        else{

            this._points = 0;

        }

    }

    get points(): number{

        return this._points;

    }

    set points(new_points: number){

        this._points = new_points;

    }

}