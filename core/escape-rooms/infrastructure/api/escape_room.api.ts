import express from 'express';
import { container } from '../../../commons/container/container'
import { CreateEscapeRoomRequest } from '../../dto/resquests/create-escape-room.request';
import { CreateEscapeRoomResponse } from '../../dto/responses/create-escape-room.response';
import { GetEscapeRoomsByDistanceResponse } from '../../dto/responses/get-escape-rooms-by-distance.response';
import { GetEscapeRoomsByDistanceRequest } from '../../dto/resquests/get-escape-rooms-by-distance.request';
import { DeleteEscapeRoomRequest } from '../../dto/resquests/delete-escape-room.request';
import { DeleteEscapeRoomResponse } from '../../dto/responses/delete-escape-room.response';

const escapeRoomRouter = express.Router();

//POST

escapeRoomRouter.post('/create', async (req, res) => { //Crear escape room
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

escapeRoomRouter.delete('/', async (req, res) => { //Borrar escape room

    if(req.body.id != undefined){

        const escape_roomRequest = DeleteEscapeRoomRequest.with({
            id: req.body.id,
        })

        const escaperoomResponse: DeleteEscapeRoomResponse = await container.deleteEscapeRoom.with(escape_roomRequest);
        res.status(escaperoomResponse.code || 200).send(escaperoomResponse);

    }else{
        res.sendStatus(400); //error al borrar el escape room
    }
});

escapeRoomRouter.get('/proximity', async (req, res) => { //GET obtener escapeRooms por cercania

    if(req.body.coordinates != undefined){

        const escape_roomRequest = GetEscapeRoomsByDistanceRequest.with({

            coordinates: req.body.coordinates

        });

        const escape_roomResponse: GetEscapeRoomsByDistanceResponse = await container.getEscapeRoomsByDistance.with(escape_roomRequest);
        res.status(escape_roomResponse.code || 200).send(escape_roomResponse);

    }else{

        res.sendStatus(400); //error al obtener las coordenadas del usuario

    }

});

escapeRoomRouter.get('/info', async (req, res) => { //GET info del escapeRoom ID

    //res.send('Endpoint /info listening !!');

    if(req.body.id != undefined){

        //code

    }else{

        res.sendStatus(400); //error al obtener el id del escape_room

    }

});

//POST participar en el scapeRoom ID

escapeRoomRouter.post('/participate', (req, res) => {

    res.send('Endpoint /participate listening !!');

});

export default escapeRoomRouter;