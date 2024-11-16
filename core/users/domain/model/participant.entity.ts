import {User} from './user.entity';
import { Email } from './value-objects/email';

export class Participant extends User{

    private points: number;

    constructor(id: number, e_mail: Email, username: string, password: string, points?: number){ //constructor parametrizado

        super(id, e_mail, username, password);

        if(points != undefined){

            this.points = points;

        }
        else{

            this.points = 0;

        }

    }

    public getPoints(): number{

        return this.points;

    }

    public setPoints(new_points: number){

        this.points = new_points;

    }

}