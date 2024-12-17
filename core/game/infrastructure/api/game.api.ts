import express from "express";
import { container } from "../../../commons/container/container";

const gameRouter = express.Router();

gameRouter.post('/register', async (req, res) => {
    if(req.body.user_email === undefined || req.body.escape_room_id === undefined || req.body.participation_id === undefined){
        res.sendStatus(400)
    }

    const request = {
        user_email: req.body.user_email,
        escape_room_id: req.body.escape_room_id,
        participation_id: req.body.participation_id
    }

    const response = await container.registerParticipant.with(request)

    res.sendStatus(response.code)
})
gameRouter.post('/solve', async (req, res) => {
    if(req.body.solution === undefined || req.body.escape_room_id === undefined || req.body.participation_id === undefined){
        res.sendStatus(406)
    }

    const request = {
        solution: req.body.solution,
        escape_room_id: req.body.escape_room_id,
        participation_id: req.body.participation_id
    }

    const response = await container.solveEscapeRoom.with(request)

    if(response.code === 200){
        res.status(200).send(response.points)
    }
    else{
        res.sendStatus(response.code)
    }
})
gameRouter.post('/clue', async (req, res) => {
    if(
        req.body.clues_ids === undefined ||
        req.body.escape_room_id === undefined 
    ){
        res.sendStatus(400)
    }

    const request = {
        clues_ids: req.body.clues_ids,
        escape_room_id: req.body.escape_room_id
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
        req.body.escape_room_id === undefined
    ){
        res.sendStatus(400)
    }
    else{
        const request = {
            clue_id: Number.parseInt(req.params.id),
            escape_room_id: req.body.escape_room_id
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