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

export {gameRouter}