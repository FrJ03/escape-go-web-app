import { Clue } from "../domain/model/clue.entity";
import { EscapeRoom } from "../domain/model/escapeRoom.entity";
import { EscapeRooms } from "../domain/services/escape_rooms.repository";
import { UpdateEscapeRoomResponse } from "../dto/responses/update-escape-room.response";
import { UpdateEscapeRoomRequest } from "../dto/resquests/update-escape-room.request";

export class UpdateEscapeRoomUseCase {
    constructor(private readonly escape_rooms: EscapeRooms) {}

    async with(command: UpdateEscapeRoomRequest): Promise<UpdateEscapeRoomResponse> {
        // Buscar la escape room existente
        const existingEscapeRoom = await this.escape_rooms.findById(command.id);
        if (!existingEscapeRoom) {
            return {
                code: 404,
            } as UpdateEscapeRoomResponse;
        }

        // Crear la escape room con los datos actualizados
        const updatedEscapeRoom = new EscapeRoom(
            existingEscapeRoom.id,
            command.title || existingEscapeRoom.title,
            command.description || existingEscapeRoom.description,
            command.solution || existingEscapeRoom.solution,
            command.difficulty || existingEscapeRoom.difficulty,
            command.price || existingEscapeRoom.price,
            existingEscapeRoom.maxSessionDuration,
            existingEscapeRoom.location
        );

        // Guardar los cambios
        try {
            if (await this.escape_rooms.update(updatedEscapeRoom)) {

                await this.escape_rooms.deleteAllCluesByEscapeRoom(updatedEscapeRoom.id);

                for (let i = 0 ; i < command.clues.length; i++) {
                    const res = await this.escape_rooms.saveClue(
                        new Clue(
                            1, command.clues[i].title,
                            command.clues[i].info
                        ),
                        updatedEscapeRoom.id
                    );
                }

                return {
                    code: 200,
                    id: updatedEscapeRoom.id,
                } as UpdateEscapeRoomResponse;
            } else {
                return {
                    code: 400,
                } as UpdateEscapeRoomResponse;
            }
        } catch (error) {
            console.log(error);
            return {
                code: 500,
            } as UpdateEscapeRoomResponse;
        }
    }
}
