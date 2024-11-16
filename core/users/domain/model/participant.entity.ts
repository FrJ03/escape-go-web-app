import {User} from './user.entity';

export class Participant extends User{

    private points: number;

    constructor(e_mail: string, username: string, password: string, points?: number){ //constructor parametrizado

        super(e_mail, username, password);

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