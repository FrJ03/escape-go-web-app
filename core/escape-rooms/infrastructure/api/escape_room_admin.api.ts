import express from 'express';
import { container } from '../../../commons/container/container'
import { CreateEscapeRoomRequest } from '../../dto/resquests/create-escape-room.request';
import { CreateEscapeRoomResponse } from '../../dto/responses/create-escape-room.response';
import { DeleteEscapeRoomRequest } from '../../dto/resquests/delete-escape-room.request';
import { DeleteEscapeRoomResponse } from '../../dto/responses/delete-escape-room.response';
import { GetEscapeRoomInfoRequest } from '../../dto/resquests/get-escape-room-info.request';
import { GetEscapeRoomInfoResponse } from '../../dto/responses/get-escape-room-info.response';
import { CreateParticipationRequest } from '../../dto/resquests/create-participation.request';
import { CreateParticipationResponse } from '../../dto/responses/create-participation.response';
import { GetEscapeRoomsRequest } from '../../dto/resquests/get-escape-rooms.request';
import { GetEscapeRoomsResponse } from '../../dto/responses/get-escape-rooms.response';

const escapeRoomAdminRouter = express.Router();

//POST

escapeRoomAdminRouter.post('/create', async (req, res) => { //Crear escape room
    const { title, description, solution, difficulty, price, maxSessionDuration, location } = req.body;

    if (title && description && solution && difficulty && price && maxSessionDuration && location) {
        const request = CreateEscapeRoomRequest.with({
            title,
            description,
            solution,
            difficulty,
            price,
            maxSessionDuration,
            location
        });
        
        const response: CreateEscapeRoomResponse = await container.createEscapeRoom.with(request);
        res.status(response.code || 200).send(response);
    } else {
        res.sendStatus(400); // Faltan datos requeridos
    }
});

//DELETE

escapeRoomAdminRouter.delete('/:id', async (req, res) => { //Borrar escape room

    if(req.params.id != undefined){

        const id = parseInt(req.params.id, 10);

        if(!isNaN(id)){

            const escape_roomRequest = DeleteEscapeRoomRequest.with({
                id: id
            })
    
            const escaperoomResponse: DeleteEscapeRoomResponse = await container.deleteEscapeRoom.with(escape_roomRequest);
            res.status(escaperoomResponse.code || 200).send(escaperoomResponse);

        }else{

            res.sendStatus(500); //error al parsear id

        }

    }else{
        res.sendStatus(400); //error al borrar el escape room
    }
});

escapeRoomAdminRouter.get('/', async (req, res) => { //GET escape rooms
        const response: GetEscapeRoomsResponse = await container.getEscapeRooms.with();

        res.status(response.code || 200).send(response)
});

escapeRoomAdminRouter.get('/:id', async (req, res) => { //GET info del escapeRoom ID

    if(req.params.id != undefined){

        const id = parseInt(req.params.id, 10);

        if(!isNaN(id)){

            const escape_roomRequest = GetEscapeRoomInfoRequest.with({

                id: id
    
            });
    
            const escape_roomResponse: GetEscapeRoomInfoResponse = await container.getEscapeRoomInfoById.with(escape_roomRequest);
    
            res.status(escape_roomResponse.code || 200).send(escape_roomResponse);

        }else{

            res.sendStatus(500); //error al parsear el id

        }

    }else{

        res.sendStatus(400); //error al obtener el id del escape_room

    }

});

//POST participar en el scapeRoom ID

escapeRoomAdminRouter.post('/:participation_id', async (req, res) => {

    if(req.params.participation_id != undefined && req.body.start_date != undefined && req.body.end_date != undefined){

        const id = parseInt(req.params.participation_id, 10);

        if(!isNaN(id)){

            const escape_roomRequest = CreateParticipationRequest.with({

                start_date: req.body.start_date,
                end_date: req.body.end_date,
                escape_room_id: id
    
    
            });
    
            const escape_roomResponse: CreateParticipationResponse = await container.createParticipation.with(escape_roomRequest);
    
            res.status(escape_roomResponse.code || 200).send(escape_roomResponse);

        }else{

            res.sendStatus(500); //error al parsear id

        }

    }else{

        res.sendStatus(400); //error al obtener la informacion

    }

});

export {escapeRoomAdminRouter};