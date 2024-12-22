import express from "express";
import { container } from "../../../commons/container/container";

const measureRouter = express.Router();

measureRouter.get('/conversion', async (req, res) => {
    const response = await container.getConversionRate.with()

    res.status(response.code).send(response)
})

export {measureRouter}