import { EscapeRooms } from "../domain/services/escape_rooms.repository";
import { DeleteEscapeRoomResponse } from "../dto/responses/delete-escape-room.response";
import { DeleteEscapeRoomRequest } from "../dto/resquests/delete-escape-room.request";

export class DeleteEscapeRoomUseCase {
    constructor(private readonly escape_rooms: EscapeRooms) {}

    async with(request: DeleteEscapeRoomRequest): Promise<DeleteEscapeRoomResponse> {
        const { id } = request;

        try {
            if (id === undefined || typeof id !== 'number') {
                return {
                    code: 400,
                    message: 'Invalido Id'
                } as DeleteEscapeRoomResponse;
            }

            // Intentar eliminar el escape room
            const wasDeleted = await this.escape_rooms.delete(id);

            if (wasDeleted) {
                return {
                    code: 200,
                } as DeleteEscapeRoomResponse;
            } else {
                return {
                    code: 404,
                } as DeleteEscapeRoomResponse;
            }
        } catch (error) {
            return {
                code: 500,
            } as DeleteEscapeRoomResponse;
        }
    }
}