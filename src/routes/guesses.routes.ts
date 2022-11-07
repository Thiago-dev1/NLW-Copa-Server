import { Router } from "express"
import z from "zod"

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"

import { prisma } from "../lib/prisma"

const guessesRoutes = Router()

guessesRoutes.get("games/count", async (request, response) => {
    const count = await prisma.guess.count()

    return response.json({count: count})
})

guessesRoutes.post("/polls/:pollId/:gameId/guesses", ensureAuthenticated, async (request, response) => {
    const createGuessParams = z.object({
        pollId: z.string(),
        gameId: z.string()
    })

    const createGuessBody = z.object({
        firstTeamPoints: z.number(),
        secondTeamPoints: z.number()
    })

    const { gameId, pollId } = createGuessParams.parse(request.params)
    const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)

    const participant = await prisma.participant.findUnique({
        where: {
            userId_poolId: {
                poolId: pollId,
                userId: request.user.id
            }
        }
    })

    if(!participant) {
        return response.status(400).send({
            message: "You're not allowed to create a guess inside this poll."
        })
    }

    const guess = await prisma.guess.findUnique({
        where: {
            participantId_gameId: {
                participantId: participant.id,
                gameId
            }
        }
    })


    if(guess) {
        return response.status(400).send({
            message: "You already sent a guess to this game on this poll"
        })
    }

    const game = await prisma.game.findUnique({
        where: {
            id: gameId
        }
    })

    if(!game) {
        return response.status(400).send({
            message: "Game not found"
        })
    }

    if(game.date < new Date()) {
        return response.status(400).send({
            message: "You cannot send guesses after the game date,"
        })
    }

    await prisma.guess.create({
        data: {
            firstTeamPoints,
            secondTeamPoints,
            gameId,
            participantId: participant.id,
        }
    })


    return response.status(201).send()

})

export { guessesRoutes }