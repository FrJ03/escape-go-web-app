import express from 'express';
import { Email } from '../../domain/model/value-objects/email';
import { SignUpRequest } from '../../dto/requests/signup.request';
import { SignUpResponse } from '../../dto/responses/signup.response';
import { container } from '../../../commons/container/container'
import { LoginRequest } from '../../dto/requests/login.request';
import { LoginResponse } from '../../dto/responses/login.response';
import { DeleteRequest } from '../../dto/requests/delete.request';
import { DeleteResponse } from '../../dto/responses/delete.response';


const accountRouter = express.Router();

//POST /account/signup --> register

accountRouter.post('/signup', async (req, res) => { //REGISTRO -- solo se registran participants
    if(req.body.username != undefined && req.body.password != undefined && Email.esMail(req.body.email) == true){

        //res.send('datos: ' + username + ', ' + password + ', ' + posiblemail + '\n');

        const userRequest = SignUpRequest.with({ //esta request se enviara luego al container.registerUser

            email: req.body.email,
            username: req.body.username,
            password: req.body.password

        });

        const userResponse: SignUpResponse = await container.signUpUser.with(userRequest);

        res.status(userResponse.code || 200).send(userResponse);
    }
    else{

        res.sendStatus(400); //algunos datos son undefined o el correo no es valido
    }

});

//POST /account/signin --> login

accountRouter.post('/signin', async (req, res) => { //FUNCIONALIDAD

    //res.send('Datos recibidos: ' + posiblemail + ', ' + username + ', ' + password);

    if(req.body.password != undefined && Email.esMail(req.body.email) == true){ //comprobamos que los datos esten correctos

        //res.send('Datos recibidos: ' + req.body.email + ', ' + req.body.username + ', ' + req.body.password);

        const userRequest = LoginRequest.with({

            email: req.body.email,
            password: req.body.password

        })

        const userResponse: LoginResponse = await container.loginUser.with(userRequest);

        res.status(userResponse.code || 200).send(userResponse);

    }
    else{

        res.sendStatus(400); //error en algun dato o correo no valido

    }

});

//DELETE /account --> elimina la cuenta

accountRouter.delete('/', async (req, res) => { //FUNCIONALIDAD

    if(req.body.password != undefined && Email.esMail(req.body.email)){

        const userRequest = DeleteRequest.with({

            password: req.body.password,
            email: req.body.email

        })

        const userResponse: DeleteResponse = await container.deleteUser.with(userRequest);

        res.status(userResponse.code || 200).send(userResponse);

    }else{

        res.sendStatus(400); //error en algun dato o correo no valido

    }

});

export default accountRouter;