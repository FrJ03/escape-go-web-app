import express from "express";
import { container } from "../../../commons/container/container";

const rankingRouter = express.Router();

rankingRouter.get('/', async (req, res) => {
    const response = await container.getRanking.with()

    res.status(response.code).send(response.ranking)
})

export { rankingRouter }