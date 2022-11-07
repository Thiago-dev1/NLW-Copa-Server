import { Router } from "express"

import z from "zod"
import ShortUniqueId from "short-unique-id"

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"
import { prisma } from "../lib/prisma"

const gamesRoutes = Router()


gamesRoutes.get("/polls/:id/game", ensureAuthenticated, async (request, response) => {
    const getPollParams = z.object({
        id: z.string()
    })

    const { id } = getPollParams.parse(request.params)
    

    const games = await prisma.game.findMany({
        orderBy: {
            date: "desc"
        },
        include: {
            guesses: {
                where: {
                    participant: {
                        userId: request.user.id,
                        poolId: id
                    }
                }
            }
        }
    })

    return response.status(200).json(games.map(game => {
        return {
            ...game,
            guess: game.guesses.length > 0 ? game.guesses[0] : null,
            guesses: undefined
        }
    }))
})



export { gamesRoutes }