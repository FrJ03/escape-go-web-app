import express from "express";
import { container } from "../../../commons/container/container";

const measureRouter = express.Router();

measureRouter.get('/conversion', async (req, res) => {
    const response = await container.getConversionRate.with()

    res.status(response.code).send(response)
})
measureRouter.get('/sessions-interval', async (req, res) => {
    const response = await container.getSessionsInterval.with()

    res.status(response.code).send(response)
})
measureRouter.get('/growth', async (req, res) => {
    const response = await container.getGrowthRate.with()

    res.status(response.code).send(response)
})

export {measureRouter}