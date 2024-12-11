import { Client, ClientConfig } from "pg";
import { EscapeRooms } from "../../domain/services/escape_rooms.repository";
import { EscapeRoomPublisher } from "../persistence/escape_room.publisher";
import { EscapeRoom } from "../../domain/model/escapeRoom.entity";
import { Coordinate } from "../../domain/model/coordinate.entity";
import { SELECT_ESCAPE_ROOMS, SELECT_ESCAPE_ROOM_BY_ID, DELETE_ESCAPE_ROOM_BY_ID } from "../queries/escape_rooms.query";
import { EscapeRoomType } from "../persistence/escape_room.type";
import { LocationType } from "../persistence/location.type";
import { EscapeRoomDataMapper } from "../persistence/escape_room.data-mapper";

export class EscapeRoomsSql implements EscapeRooms{

    private readonly _publisher: EscapeRoomPublisher

    constructor(private readonly postgres_config: ClientConfig){
        this._publisher = new EscapeRoomPublisher(postgres_config)
    }

    async save(escape_room: EscapeRoom): Promise<boolean> {
        return await this._publisher.create(escape_room)
    }

    async getAllByDistance(coordinate: Coordinate): Promise<EscapeRoom[]> {
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query(SELECT_ESCAPE_ROOMS)
        await postgres.end()

        const escape_rooms_type: Array<EscapeRoomType> = []
        const escape_rooms: Array<EscapeRoom> = []

        if(response.rowCount === 0){
            return escape_rooms
        }

        response.rows.forEach(escape_room => {
            escape_rooms_type.push({
                id: escape_room.id,
                title: escape_room.title,
                description: escape_room.description,
                solution: escape_room.solution,
                difficulty: escape_room.difficulty,
                price: escape_room.price,
                location: {
                    id: escape_room.physical_location,
                    coordinates: escape_room.coordinates,
                    street: escape_room.street,
                    street_number: escape_room.street_number,
                    other_info: escape_room.other_info,
                    city: escape_room.city_name,
                    country: escape_room.country_name
                } as LocationType
            } as EscapeRoomType)
        })

        escape_rooms_type.forEach(escape_room => {
            escape_rooms.push(EscapeRoomDataMapper.toModel(escape_room))
        })

        return escape_rooms.sort((a, b) => {
            return coordinate.distance(a.location.coordinates) - coordinate.distance(b.location.coordinates)
        })
    }
    async findById(id: number): Promise<EscapeRoom | undefined> {
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query(SELECT_ESCAPE_ROOM_BY_ID, [id])
        await postgres.end()

        if (response.rowCount === 0) {
            return undefined; // No se encontró el EscapeRoom
        }

        const escape_room = response.rows[0];

        const escapeRoom = EscapeRoomDataMapper.toModel(escape_room);
        return escapeRoom;
    }

    async delete(id: number): Promise<boolean> {
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query(DELETE_ESCAPE_ROOM_BY_ID, [id])
        await postgres.end()

        //Devolvemos true si lo ha borrado
        return response.rowCount ? true : false;
    }

}