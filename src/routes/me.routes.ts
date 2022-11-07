import { Router } from "express"

import { prisma } from "../lib/prisma"

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"


const meRoutes = Router()


meRoutes.get('/me', ensureAuthenticated, async (request, response) => {
    
    const user = await prisma.user.findUnique({
        where: {
            id: request.user.id
        }
    })

    response.status(200).json(user)
})


export { meRoutes }