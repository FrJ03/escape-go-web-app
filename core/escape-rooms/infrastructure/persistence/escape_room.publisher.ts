import { Client, ClientConfig, Query, QueryResult } from "pg";
import { Publisher } from "../../../commons/domain/publisher/publisher";
import { EscapeRoom } from "../../domain/model/escapeRoom.entity";
import { EscapeRoomDataMapper } from "./escape_room.data-mapper";
import { INSERT_CITY, INSERT_COUNTRY, INSERT_ESCAPE_ROOM, INSERT_LOCATION, SELECT_CITY_BY_NAME, SELECT_COUNTRY_BY_NAME, SELECT_LOCATION } from "../queries/escape_rooms.query";
import { CountryType } from "./country.type";
import { CityType } from "./city.type";
import PostgresSqlConfig from "../../../commons/infrastructure/database-client/postgresql-client";

export class EscapeRoomPublisher extends Publisher<EscapeRoom>{
    constructor(private readonly postgres_config: ClientConfig){
        super()
    }
    async create(escape_room: EscapeRoom): Promise<boolean>{
        const data = EscapeRoomDataMapper.toType(escape_room)
        try {
            if(await this.find_country(escape_room.location.country) === undefined){
                let created = await this.create_country(escape_room.location.country)

                while(created === undefined){
                    created = await this.create_country(escape_room.location.country)
                }
            }

            let city = await this.find_city(data.location.city, data.location.country)
            if(city === undefined){
                while(city === undefined){
                    city = await this.create_city(data.location.city, data.location.country)
                }
            }

            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response_location = await postgres.query(INSERT_LOCATION, [data.location.coordinates, data.location.street, data.location.street_number, data.location.other_info, city.id])
            const location = await postgres.query(SELECT_LOCATION, [data.location.coordinates, data.location.street, data.location.street_number, data.location.other_info, city.id])

            if(response_location.rowCount === 0){
                postgres.end()
                return false
            }

            const response = await postgres.query(INSERT_ESCAPE_ROOM, [data.title, data.description, data.solution, data.difficulty, data.price, location.rows[0].id])

            await postgres.end()

            return (response.rowCount !== 0)
        } catch (error) {
            return false
        }
    }
    async update(escape_room: EscapeRoom): Promise<boolean>{
        return false
    }

    private async find_country(country_name: string): Promise<CountryType | undefined>{
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(SELECT_COUNTRY_BY_NAME, [this.toCapitalLetter(country_name)])
            await postgres.end()

            if(response.rowCount !== 0){
                return {
                    id: response.rows[0].id,
                    name: response.rows[0].country_name
                } as CountryType
            }
            else{
                return undefined
            }
        } catch (error) {
            return undefined
        }
    }

    public async create_country(country_name: string): Promise<CountryType | undefined>{
        try {
            const postgres = new Client(this.postgres_config)
            await postgres.connect()
            const response = await postgres.query(INSERT_COUNTRY, [this.toCapitalLetter(country_name)])
            await postgres.end()

            return (response.rowCount !== 0) ? 
                this.find_country(country_name)
            :
                undefined
        } catch (error) {
            return undefined
        }
    }

    private async find_city(city_name: string, country_name: string): Promise<CityType | undefined>{
        const country = await this.find_country(country_name)
        if(country !== undefined){
            try {
                const postgres = new Client(this.postgres_config)
                await postgres.connect()
                const response = await postgres.query(SELECT_CITY_BY_NAME, [this.toCapitalLetter(city_name), country.id])
                await postgres.end()
    
                if(response.rowCount !== 0){
                    return {
                        id: response.rows[0].id,
                        name: response.rows[0].city_name,
                        country: country
                    } as CityType
                }
                else{
                    return undefined
                }
            } catch (error) {
                return undefined
            }
        }
        else{
            return undefined
        }
    }

    public async create_city(city_name: string, country_name: string): Promise<CityType | undefined>{
        const country = await this.find_country(country_name)
        const city = await this.find_city(city_name, country_name)

        if(country !== undefined && city === undefined){
            try {
                const postgres = new Client(this.postgres_config)
                await postgres.connect()
                const response = await postgres.query(INSERT_CITY, [this.toCapitalLetter(city_name), country.id])
                await postgres.end()
    
                if(response.rowCount !== 0){
                    return this.find_city(city_name, country_name)
                }
                else{
                    return undefined
                }
            } catch (error) {
                return undefined
            }
        }
        else{
            return city
        }
    }

    private toCapitalLetter(name: string): string{
        return name.charAt(0).toUpperCase() + name.substring(1).toLowerCase()
    }
}

/*const escapes = new EscapeRoomPublisher(PostgresSqlConfig)
escapes.create_country('españa')
    .then((response) => {
        console.log(response)
    })
escapes.create_city('cordoba', 'españa')
    .then((response) => {
        console.log(response)
    })*/