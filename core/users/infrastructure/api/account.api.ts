import express from 'express';
import { Email } from '../../domain/model/value-objects/email';


const accountRouter = express.Router();

//POST /account/signup --> register

accountRouter.post('/signup', async (req, res) => { //REGISTRO -- solo se registran participants

    //PARSEAMOS LOS DATOS RECIBIDOS EN EL req.body

    const posiblemail = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if(username != undefined && password != undefined && Email.esMail(posiblemail) == true){

        res.send('datos: ' + username + ', ' + password + ', ' + posiblemail + '\n');

    }
    else{

        res.sendStatus(400); //algunos datos son undefined o el correo no es valido

    }

        

});

//POST /account/signin --> login

accountRouter.post('/signin', async (req, res) => { //FUNCIONALIDAD

    res.send('signing in !!');

});

//DELETE /account/session --> cierra sesion (determinar si es necesario)

accountRouter.delete('/session', async (req, res) => { //FUNCIONALIDAD

    res.send('Closing sessions !!');

});

//DELETE /account --> elimina la cuenta

accountRouter.delete('/', async (req, res) => { //FUNCIONALIDAD

    res.send('Deleting accounts !!');

});

export default accountRouter;