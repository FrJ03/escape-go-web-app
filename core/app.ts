import express from "express";
import accountRouter from "./users/infrastructure/api/account.api";
import { userAuthentication } from "./commons/utils/middlewares/user-authentication";
import { adminAuthentication, participantAuthentication } from "./commons/utils/middlewares/user-role-authentication";
import { escapeRoomAdminRouter } from "./escape-rooms/infrastructure/api/escape_room_admin.api";
import escapeRoomParticipantRouter from "./escape-rooms/infrastructure/api/escape_room_participant.api";

const app = express();
app.use(express.json()); //middleware que transforma req.body a JSON

app.use('/account', accountRouter) //ruta para la API account
app.use('/escaperoom/admin', userAuthentication, adminAuthentication, escapeRoomAdminRouter) //ruta para la API escaperoom admin
app.use('/escaperoom/participant', userAuthentication, participantAuthentication, escapeRoomParticipantRouter) //ruta para la API escaperoom admin

export default app 