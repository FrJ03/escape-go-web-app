import express, { request, Request, Response } from "express";
import dotenv from "dotenv";

import accountRouter from "./users/infrastructure/api/account.api";


dotenv.config();
const app = express();
app.use(express.json()); //middleware que transforma req.body a JSON

const PORT = process.env.PORT;

app.listen(PORT, () => { 
    console.log("Server running at PORT: ", PORT); 
}).on("error", (error) => {
    throw new Error(error.message);
});

app.get('/ping', (req, res) => { //ping del puerto

    console.log('Someone Pinged Here !!');
    res.send('pong');

});

app.use('/account', accountRouter) //ruta para la API account