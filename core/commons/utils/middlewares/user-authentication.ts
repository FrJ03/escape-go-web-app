import { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";

export const userAuthentication = (request: Request, response: Response, next: NextFunction) => {
    if(request.headers.authorization === undefined){
        response.sendStatus(401)
    }
    else{
        const decodedToken = decode(`${request.headers.authorization}`)

        if(typeof decodedToken === 'string' || decodedToken === null){
            response.sendStatus(401)
        }
        else{
            next()
        }
    }
}