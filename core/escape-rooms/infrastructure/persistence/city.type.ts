import { CountryType } from "./country.type"

export type CityType = {
    id: number,
    name: string,
    country: CountryType
}