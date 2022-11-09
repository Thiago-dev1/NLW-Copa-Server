import { Router } from "express"

import z from "zod"
import ShortUniqueId from "short-unique-id"

import { ensureAuthenticated } from "../middlewares/ensureAuthenticated"
import { prisma } from "../lib/prisma"

const pollsRoutes = Router()

pollsRoutes.get("/count", async (request, response) => {
    const count = await prisma.poll.count()

    return response.json({ count: count })
})

pollsRoutes.post("/", ensureAuthenticated, async (request, response) => {
    const createPollBody = z.object({
        title: z.string()
    })

    const { title } = createPollBody.parse(request.body)

    const generate = new ShortUniqueId({ length: 6 })
    const code = String(generate()).toUpperCase()


    await prisma.poll.create({
        data: {
            title,
            code,
            ownerId: request.user.id,
            Participant: {
                create: {
                    userId: request.user.id,          
                }
            }
        }
    }) 

    return response.json({ code })
})

pollsRoutes.post("/join", ensureAuthenticated, async (request, response) => {
    const joinPollBody = z.object({
        code: z.string(),
    })

    const { code } = joinPollBody.parse(request.body)

    const poll  = await prisma.poll.findUnique({
        where: {
            code
        },
        include: {
            Participant: { 
                where: {
                    userId: request.user.id
                }
            }
        }
    })

    if(!poll) {
        return response.status(400).json({message: "Poll not found!!"})
    } 

    if(poll.Participant.length > 0) {
        return response.status(400).json({message: "User already participates in the pool!!"})
    } 
    
    await prisma.participant.create({
        data: {
            poolId: poll.id,
            userId: request.user.id,
        }
    })

    return response.status(201).json({message: "Entrou"})
})

pollsRoutes.get("/", ensureAuthenticated, async (request, response) => {
    const { id } = request.user

    const polls = await prisma.poll.findMany({
        where: {
            Participant: {
                some: {
                    userId: id
                }
            }
        },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true
                }
            },
            Participant: {
                select: {
                    id: true,
                    User: {
                        select: {
                            AvatartUrl: true
                        }
                    }
                },
                take: 4
            }
            ,
            _count: {
                select: {
                    Participant: true
                }
            }
        }
    })

    return response.status(200).json(polls)
})

pollsRoutes.get("/:id", ensureAuthenticated, async (request, response) => {
    const getPollParams = z.object({
        id: z.string()
    })

    const { id } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
        where: {
            id
        },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true
                }
            },
            Participant: {
                select: {
                    id: true,
                    User: {
                        select: {
                            AvatartUrl: true
                        }
                    }
                },
                take: 4
            }
            ,
            _count: {
                select: {
                    Participant: true
                }
            }
        }
    })

    return response.status(200).json(poll)
})

export { pollsRoutes }