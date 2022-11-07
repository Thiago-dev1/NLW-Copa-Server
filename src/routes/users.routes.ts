import { Router } from "express"

import { prisma } from "../lib/prisma"

const usersRoutes = Router()

usersRoutes.get("/count", async (request, response) => {
    const count = await prisma.user.count()

    return response.json({count: count})
})

export { usersRoutes }