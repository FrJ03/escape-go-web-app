import express from "express";
import { container } from "../../../commons/container/container";
import { decode } from "jsonwebtoken";

const gameRouter = express.Router();

gameRouter.post('/register', async (req, res) => {
    if(req.body.escape_room_id === undefined || req.body.participation_id === undefined){
        res.sendStatus(400)
        return;
    }

    const decodedToken = decode(`${req.headers.authorization}`);

    if (!decodedToken || typeof decodedToken !== 'object' || !('email' in decodedToken)) {
        res.sendStatus(401);
        return;
    }

    const request = {
        user_email: decodedToken.email,
        escape_room_id: req.body.escape_room_id,
        participation_id: req.body.participation_id
    }

    const response = await container.registerParticipant.with(request)

    res.sendStatus(response.code)
})
gameRouter.post('/solve', async (req, res) => {
    if(req.body.solution === undefined || req.body.escape_room_id === undefined || req.body.participation_id === undefined){
        res.sendStatus(406)
        return;
    }

    const decodedToken = decode(`${req.headers.authorization}`);

    if (!decodedToken || typeof decodedToken !== 'object' || !('email' in decodedToken)) {
        res.sendStatus(401);
        return;
    }      

    const request = {
        solution: req.body.solution,
        escape_room_id: req.body.escape_room_id,
        participation_id: req.body.participation_id,
        user_email: decodedToken.email
    }

    const response = await container.solveEscapeRoom.with(request)

    if(response.code === 200){
        res.status(response.code).send({points: response.points})
    }
    else{
        res.sendStatus(response.code)
    }
})
gameRouter.post('/clue', async (req, res) => {
    if(
        req.body.clues_ids === undefined ||
        req.body.escape_room_id === undefined ||
        req.body.participation_id === undefined
    ){
        res.sendStatus(400)
        return;
    }

    const decodedToken = decode(`${req.headers.authorization}`);

    if (!decodedToken || typeof decodedToken !== 'object' || !('email' in decodedToken)) {
        res.sendStatus(401);
        return;
    }   

    const request = {
        clues_ids: req.body.clues_ids,
        escape_room_id: req.body.escape_room_id,
        user_email: decodedToken.email,
        participation_id: req.body.participation_id
    }

    const response = await container.getNextClue.with(request)

    if(response.code !== 200){
        res.sendStatus(response.code)
    }
    else{
        res.status(response.code).send(response.clue)
    }
})

gameRouter.post('/clue/:id', async (req, res) => {
    if(
        req.params.id === undefined ||
        req.body.escape_room_id === undefined ||
        req.body.participation_id === undefined
    ){
        res.sendStatus(400)
        return;
    }
    else{
        const decodedToken = decode(`${req.headers.authorization}`);

        if (!decodedToken || typeof decodedToken !== 'object' || !('email' in decodedToken)) {
            res.sendStatus(401);
            return;
        }  

        const request = {
            clue_id: Number.parseInt(req.params.id),
            escape_room_id: req.body.escape_room_id,
            user_email: decodedToken.email,
            participation_id: req.body.participation_id
        }
    
        const response = await container.getClue.with(request)
    
        if(response.code !== 200){
            res.sendStatus(response.code)
        }
        else{
            res.status(response.code).send(response.clue)
        }
    }

})

export {gameRouter}