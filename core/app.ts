import express from "express";
import accountRouter from "./users/infrastructure/api/account.api";

const app = express();
app.use(express.json()); //middleware que transforma req.body a JSON

app.use('/account', accountRouter) //ruta para la API account

export { app }