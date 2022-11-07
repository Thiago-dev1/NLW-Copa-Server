import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"



interface IPayload {
    sub: string
}

export async function ensureAuthenticated(request: Request, response: Response, next: NextFunction) {

    const authHeader = request.headers.authorization


    if (!authHeader) {
        throw new Error("Token missing")
    }

    const [, token] = authHeader!.split(" ")


    try {
        const { sub: user_id } = verify(token, "nlwcopa") as IPayload

        request.user = {
            id: user_id,
        }

        next()
    } catch {
        throw new Error("Invalid token!")
    }
}