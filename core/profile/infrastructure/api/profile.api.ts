import express from "express";
import { container } from "../../../commons/container/container";
import { decode } from "jsonwebtoken";

const profileRouter = express.Router();

profileRouter.get('/', async (req, res) => {
    const decodedToken = decode(`${req.headers.authorization}`)

    if(typeof decodedToken === 'string' || decodedToken === null){
        res.sendStatus(401)
    }
    else{
        const request = {
            email: decodedToken.email
        }

        const response = await container.getProfile.with(request)

        if(response.code === 200){
            res.status(response.code).send(response.user)
        }
        else{
            res.sendStatus(response.code)
        }
    }
})
profileRouter.get('/participations', async (req, res) => {
    const decodedToken = decode(`${req.headers.authorization}`)

    if(typeof decodedToken === 'string' || decodedToken === null){
        res.sendStatus(401)
    }
    else{
        const request = {
            email: decodedToken.email
        }

        const response = await container.getParticipationsByUser.with(request)

        if(response.code === 200){
            res.status(response.code).send(response.participatons)
        }
        else{
            res.sendStatus(response.code)
        }
    }
})