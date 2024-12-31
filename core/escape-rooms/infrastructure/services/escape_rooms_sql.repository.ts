import { Client, ClientConfig } from "pg";
import { EscapeRooms } from "../../domain/services/escape_rooms.repository";
import { EscapeRoomPublisher } from "../persistence/escape_room.publisher";
import { EscapeRoom } from "../../domain/model/escapeRoom.entity";
import { Coordinate } from "../../domain/model/coordinate.entity";
import { SELECT_ESCAPE_ROOMS, SELECT_ESCAPE_ROOM_BY_ID, DELETE_ESCAPE_ROOM_BY_ID, UPDATE_ESCAPE_ROOM_BY_ID } from "../queries/escape_rooms.query";
import { EscapeRoomType } from "../persistence/escape_room.type";
import { LocationType } from "../persistence/location.type";
import { EscapeRoomDataMapper } from "../persistence/escape_room.data-mapper";
import { Clue } from "../../domain/model/clue.entity";
import { CluePublisher } from "../persistence/clue.publisher";
import { DELETE_CLUES_BY_ESCAPE_ROOM, GET_ALL_CLUES_BY_ESCAPE_ROOM, GET_CLUE_BY_ID } from "../queries/clues.query";
import { ClueDataMapper } from "../persistence/clue.data-mapper";
import { ClueType } from "../persistence/clue.type";

export class EscapeRoomsSql implements EscapeRooms{

    private readonly _escape_room_publisher: EscapeRoomPublisher
    private readonly _clue_publisher: CluePublisher

    constructor(private readonly postgres_config: ClientConfig){
        this._escape_room_publisher = new EscapeRoomPublisher(postgres_config)
        this._clue_publisher = new CluePublisher(postgres_config)
    }

    async save(escape_room: EscapeRoom): Promise<boolean> {
        const response_er =  await this._escape_room_publisher.create(escape_room)

        if(!response_er){
            return false
        }

        for(let i = 0 ; i < escape_room.clues.length ; i++){
            const response_clue = await this._clue_publisher.create(escape_room.clues[i], escape_room.id)
            if(!response_clue){
                return false
            }
        }

        return true
    }

    async saveClue(clue: Clue, escape_room_id: number): Promise<boolean>{
        return await this._clue_publisher.create(clue, escape_room_id)
    }

    async getAll(): Promise<EscapeRoom[]> {
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

        for(let i = 0 ; i < escape_rooms_type.length ; i++){
            const postgres_2 = new Client(this.postgres_config)
            postgres_2.connect()
            const c_response = await postgres_2.query(GET_ALL_CLUES_BY_ESCAPE_ROOM, [escape_rooms_type[i].id])
            postgres_2.end()

            const clues: Array<ClueType> = []

            if(c_response.rowCount !== 0){
                c_response.rows.forEach(clue => {
                    clues.push({
                        id: clue.id,
                        escape_room: escape_rooms_type[i].id,
                        title: clue.title,
                        info: clue.info
                    })
                })
            }

            escape_rooms.push(EscapeRoomDataMapper.toModel(escape_rooms_type[i], clues))
        }

        return escape_rooms
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

        if (response.rowCount === 0) {
            return undefined; // No se encontró el EscapeRoom
        }

        const escape_room = {
            id: response.rows[0].id,
            title: response.rows[0].title,
            description: response.rows[0].description,
            solution: response.rows[0].solution,
            difficulty: response.rows[0].difficulty,
            price: response.rows[0].price,
            location: {
                id: response.rows[0].physical_location,
                coordinates: response.rows[0].coordinates,
                street: response.rows[0].street,
                street_number: response.rows[0].street_number,
                other_info: response.rows[0].other_info,
                city: response.rows[0].city_name,
                country: response.rows[0].country_name
            } as LocationType
        } as EscapeRoomType

        const c_response = await postgres.query(GET_ALL_CLUES_BY_ESCAPE_ROOM, [response.rows[0].id])
        await postgres.end()

        const clues: Array<ClueType> = []

        if(c_response.rowCount !== 0){
            c_response.rows.forEach(clue => {
                clues.push({
                    id: clue.id,
                    escape_room: escape_room.id,
                    title: clue.title,
                    info: clue.info
                })
            })
        }

        const escapeRoom = EscapeRoomDataMapper.toModel(escape_room, clues);
        return escapeRoom;
    }

    async getClueById(clue_id: number, escape_room_id: number): Promise<Clue | undefined> {
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query(GET_CLUE_BY_ID, [clue_id, escape_room_id])
        await postgres.end()

        if(response.rowCount === 0){
            return undefined
        }

        return ClueDataMapper.toModel({
            id: response.rows[0].id,
            escape_room: response.rows[0].escape_room,
            title: response.rows[0].title,
            info: response.rows[0].info
        })
    }

    async delete(id: number): Promise<boolean> {
        const postgres = new Client(this.postgres_config)
        await postgres.connect()
        const response = await postgres.query(DELETE_ESCAPE_ROOM_BY_ID, [id])
        await postgres.end()

        //Devolvemos true si lo ha borrado
        return response.rowCount ? true : false;
    }

    async update(escape_room: EscapeRoom): Promise<boolean> {
        const postgres = new Client(this.postgres_config);
        await postgres.connect();
        const response = await postgres.query(UPDATE_ESCAPE_ROOM_BY_ID, [escape_room.id, escape_room.title, escape_room.description, escape_room.solution, escape_room.difficulty, escape_room.price]);
        await postgres.end();

        return response.rowCount !== 0
    }

    async deleteAllCluesByEscapeRoom(escape_room_id: number): Promise<boolean> {
        try {
            const postgres = new Client(this.postgres_config);
            await postgres.connect();
            await postgres.query(DELETE_CLUES_BY_ESCAPE_ROOM, [escape_room_id]);
            await postgres.end();

            return true;
        } catch (error) {
            return false;
        }
    }
}