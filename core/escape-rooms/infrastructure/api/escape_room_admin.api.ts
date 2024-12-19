import express from 'express';
import { container } from '../../../commons/container/container'
import { CreateEscapeRoomRequest } from '../../dto/resquests/create-escape-room.request';
import { CreateEscapeRoomResponse } from '../../dto/responses/create-escape-room.response';
import { UpdateEscapeRoomRequest } from '../../dto/resquests/update-escape-room.request';
import { UpdateEscapeRoomResponse } from '../../dto/responses/update-escape-room.response';
import { DeleteEscapeRoomRequest } from '../../dto/resquests/delete-escape-room.request';
import { DeleteEscapeRoomResponse } from '../../dto/responses/delete-escape-room.response';
import { CreateParticipationRequest } from '../../dto/resquests/create-participation.request';
import { CreateParticipationResponse } from '../../dto/responses/create-participation.response';
import { GetEscapeRoomsResponse } from '../../dto/responses/get-escape-rooms.response';
import { GetEscapeRoomRequest } from '../../dto/resquests/get-escape-room.request';
import { GetEscapeRoomResponse } from '../../dto/responses/get-escape-room.response';

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

//UPDATE

escapeRoomAdminRouter.put('/modify', async (req, res) => { //Modificar escape room
    const { id, title, description, solution, difficulty, price } = req.body;

    // Validar que el ID está presente y es un número válido
    if (!id || isNaN(Number(id))) {
        res.sendStatus(400);
       return;
    }

    // Establece valores por defecto como undefined si no se reciben
    const request: UpdateEscapeRoomRequest = {
        id,
        title: title !== undefined ? title : undefined,
        description: description !== undefined ? description : undefined,
        solution: solution !== undefined ? solution : undefined,
        difficulty: difficulty !== undefined ? difficulty : undefined,
        price: price !== undefined ? price : undefined
    };

    if (id) {
        const response: UpdateEscapeRoomResponse = await container.updateEscapeRoom.with(request);
        res.status(response.code || 200).send(response);

    } else {
        res.sendStatus(400); // Faltan datos requeridos
    }
});

//DELETE

escapeRoomAdminRouter.delete('/delete:id', async (req, res) => { //Borrar escape room

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

escapeRoomAdminRouter.get('/info:id', async (req, res) => { //GET info del escapeRoom ID
    if(req.params.id != undefined){
        const id = parseInt(req.params.id, 10);

        if(!isNaN(id)){
            const escape_roomRequest = GetEscapeRoomRequest.with({
                id: id
            });
    
            const escape_roomResponse: GetEscapeRoomResponse = await container.getEscapeRoom.with(escape_roomRequest);
    
            res.status(escape_roomResponse.code || 200).send(escape_roomResponse);

        }else{

            res.sendStatus(500); //error al parsear el id

        }

    }else{

        res.sendStatus(400); //error al obtener el id del escape_room

    }

});

//POST create participation

escapeRoomAdminRouter.post('/participation', async (req, res) => {

    if(req.body.escape_room_id != undefined && req.body.start_date != undefined && req.body.end_date != undefined){
        const escape_roomRequest = CreateParticipationRequest.with({
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            escape_room_id: req.body.escape_room_id  
        });

        const escape_roomResponse: CreateParticipationResponse = await container.createParticipation.with(escape_roomRequest);

        res.status(escape_roomResponse.code || 200).send(escape_roomResponse);
    }else{
        res.sendStatus(400); //error al obtener la informacion
    }

});

export {escapeRoomAdminRouter};