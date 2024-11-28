import { Location } from "./location.entity";

export class EscapeRoom {

    private _id: number;
    private _title: string;
    private _description: string;
    private _solution: string;
    private _difficulty: number;
    private _price: number;
    private _maxSessionDuration: number;
    private _location: Location

    constructor(id: number, title: string, description: string, solution: string, difficulty: number, price: number, maxSessionDuration: number, location: Location) {
        this._id = id;
        this._title = title;
        this._description = description;
        this._solution = solution;
        this._difficulty = difficulty;
        this._price = price;
        this._maxSessionDuration = maxSessionDuration;
        this._location = location
    }

    get id(): number {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get description(): string {
        return this._description;
    }

    get solution(): string {
        return this._solution;
    }

    get difficulty(): number {
        return this._difficulty;
    }

    get price(): number {
        return this._price;
    }

    get maxSessionDuration(): number {
        return this._maxSessionDuration;
    }

    get location(): Location{
        return this._location
    }

    set id(id: number) {
        this._id = id;
    }

    set title(title: string){
        this._title = title;
    }

    set description(description: string){
        this._description = description;
    }

    set solution(solution: string){
        this._solution = solution;
    }

    set difficulty(difficulty: number){
        this._difficulty = difficulty;
    }

    set price(price: number){
        this._price = price;
    }

    set maxSessionDuration(maxSessionDuration: number){
        this._maxSessionDuration = maxSessionDuration;
    }

    set location(location: Location){
        this._location = location
    }
}
