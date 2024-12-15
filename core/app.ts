import express from "express";
import accountRouter from "./users/infrastructure/api/account.api";
import escapeRoomRouter from "./escape-rooms/infrastructure/api/escape_room.api";
import { userAuthentication } from "./commons/utils/middlewares/user-authentication";
import { adminAuthentication } from "./commons/utils/middlewares/user-role-authentication";

const app = express();
app.use(express.json()); //middleware que transforma req.body a JSON

app.use('/account', accountRouter) //ruta para la API account
app.use('/escaperoom', userAuthentication, adminAuthentication, escapeRoomRouter) //ruta para la API escaperoom

export default app 