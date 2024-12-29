import express from "express";
import { container } from "../../../commons/container/container";
import { decode } from "jsonwebtoken";
import { UpdateProfileRequest } from "../../dto/requests/update-profile.request";
import { UpdateProfileResponse } from "../../dto/response/update-profile.response";

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

profileRouter.put('/update', async (req, res) => {
    const { emailNuevo, username, password } = req.body;

    const decodedToken = decode(`${req.headers.authorization}`);

    if (!decodedToken || typeof decodedToken !== 'object' || !('email' in decodedToken)) {
        res.sendStatus(401);
        return;
    }

    const request: UpdateProfileRequest = {
        emailOriginal: decodedToken.email,
        emailNuevo: emailNuevo || undefined,
        username: username || undefined,
        password: password || undefined,
        id: decodedToken.id
    };

    const response: UpdateProfileResponse = await container.updateProfile.with(request);

    if (response.code === 200) {
        res.status(response.code || 200).send(response);
    } else {
        res.sendStatus(response.code);
    }
});


export { profileRouter }