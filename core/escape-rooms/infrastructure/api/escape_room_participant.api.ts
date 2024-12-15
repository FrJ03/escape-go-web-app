import express from 'express';
import { container } from '../../../commons/container/container'
import { GetEscapeRoomsByDistanceResponse } from '../../dto/responses/get-escape-rooms-by-distance.response';
import { GetEscapeRoomsByDistanceRequest } from '../../dto/resquests/get-escape-rooms-by-distance.request';
import { GetEscapeRoomInfoRequest } from '../../dto/resquests/get-escape-room-info.request';
import { GetEscapeRoomInfoResponse } from '../../dto/responses/get-escape-room-info.response';

const escapeRoomParticipantRouter = express.Router();

escapeRoomParticipantRouter.get('/proximity', async (req, res) => { //GET obtener escapeRooms por cercania

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

escapeRoomParticipantRouter.get('/info', async (req, res) => { //GET info del escapeRoom ID

    if(req.body.id != undefined){

        const escape_roomRequest = GetEscapeRoomInfoRequest.with({

            id: req.body.id

        });

        const escape_roomResponse: GetEscapeRoomInfoResponse = await container.getEscapeRoomInfoById.with(escape_roomRequest);

        res.status(escape_roomResponse.code || 200).send(escape_roomResponse);

    }else{

        res.sendStatus(400); //error al obtener el id del escape_room

    }

});

export default escapeRoomParticipantRouter;