export class Location {
    private _id: number;
    private _country: string;
    private _city: string;
    private _street: string;
    private _number: number;
    private _coordinates: { latitude: number, longitude: number };

    constructor(id: number, country: string, city: string, street: string, number: number, coordinates: { latitude: number, longitude: number }) {
        this._id = id;
        this._country = country;
        this._city = city;
        this._street = street;
        this._number = number;
        this._coordinates = coordinates;
    }

    // Getters
    getId(): number {
        return this._id;
    }

    getCountry(): string {
        return this._country;
    }

    getCity(): string {
        return this._city;
    }

    getStreet(): string {
        return this._street;
    }

    getNumber(): number {
        return this._number;
    }

    getCoordinates(): { latitude: number, longitude: number } {
        return this._coordinates;
    }

    // Setters
    setId(id: number): void {
        this._id = id;
    }

    setCountry(country: string): void {
        this._country = country;
    }

    setCity(city: string): void {
        this._city = city;
    }

    setStreet(street: string): void {
        this._street = street;
    }

    setNumber(number: number): void {
        this._number = number;
    }

    setCoordinates(coordinates: { latitude: number, longitude: number }): void {
        this._coordinates = coordinates;
    }
}
