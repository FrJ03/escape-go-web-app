import { NextFunction, Request, Response } from "express";
import { decode } from "jsonwebtoken";
import { container } from "../../container/container";
import { CheckRoleRequest } from "../../../users/dto/requests/check-role.resquest";
import { CheckRoleResponse } from "../../../users/dto/responses/check-role.response";

export const adminAuthentication = async (request: Request, response: Response, next: NextFunction) => {
    if(request.headers.authorization === undefined){
        response.sendStatus(401)
    }
    else{
        const decodedToken = decode(`${request.headers.authorization}`)

        if (typeof decodedToken == 'string' || decodedToken === null) {
            response.sendStatus(401)
        }
        else{
            const isAdmin: CheckRoleResponse = await container.checkUserRole.with({
                email: decodedToken.email,
                role: 'admin'
            } as CheckRoleRequest)

            if(isAdmin.value){
                next()
            }
            else{
                response.sendStatus(401)
            }
        }
    }
}

export const participantAuthentication = async (request: Request, response: Response, next: NextFunction) => {
    if(request.headers.authorization === undefined){
        response.sendStatus(401)
    }
    else{
        const decodedToken = decode(`${request.headers.authorization}`)

        if (typeof decodedToken == 'string' || decodedToken === null) {
            response.sendStatus(401)
        }
        else{
            const isAdmin: CheckRoleResponse = await container.checkUserRole.with({
                email: decodedToken.email,
                role: 'participant'
            } as CheckRoleRequest)

            if(isAdmin.value){
                next()
            }
            else{
                response.sendStatus(401)
            }
        }
    }
}