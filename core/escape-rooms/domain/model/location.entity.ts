import { Coordinate } from "./coordinate.entity";

export class Location {
    private _id: number;
    private _country: string;
    private _city: string;
    private _street: string;
    private _number: number;
    private _coordinates: Coordinate;
    private _info: string

    constructor(id: number, country: string, city: string, street: string, number: number, coordinates: Coordinate, info: string = '') {
        this._id = id;
        this._country = country;
        this._city = city;
        this._street = street;
        this._number = number;
        this._coordinates = coordinates;
        this._info = info
    }

    // Getters
    get id(): number {
        return this._id;
    }

    get country(): string {
        return this._country;
    }

    get city(): string {
        return this._city;
    }

    get street(): string {
        return this._street;
    }

    get number(): number {
        return this._number;
    }

    get coordinates(): Coordinate {
        return this._coordinates;
    }

    // Setters
    set id(id: number){
        this._id = id;
    }

    set country(country: string){
        this._country = country;
    }

    set city(city: string){
        this._city = city;
    }

    set street(street: string){
        this._street = street;
    }

    set number(number: number){
        this._number = number;
    }

    set coordinates(coordinates: Coordinate){
        this._coordinates = coordinates;
    }
}
