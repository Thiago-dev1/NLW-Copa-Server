import { Router } from "express"
import axios from "axios"
import { sign } from "jsonwebtoken"
import z from "zod"
import ShortUniqueId from "short-unique-id"

import { prisma } from "../lib/prisma"

const authRoutes = Router()


authRoutes.post("/", async (request, response) => {
    const createUserBody = z.object({
        access_token: z.string()
    })

    const { access_token } = createUserBody.parse(request.body)

    const userResponse = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {

        headers: {
            Authorization: `Bearer ${access_token}`,
        }
    })

    const userData = userResponse.data


    const userInfoSchema = z.object({
        id: z.string(),
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url()
    })

    const userInfo = userInfoSchema.parse(userData)

    let user = await prisma.user.findUnique({
        where: {
            email: userInfo.email
        }
    })

    if(!user) {
        user = await prisma.user.create({
            data: {
                email: userInfo.email,
                name: userInfo.name,
                AvatartUrl: userInfo.picture
            }
        })
    }

    const token = sign({name: user.name, avatartUrl: user.AvatartUrl }, "nlwcopa", {
        subject: user.id,
        expiresIn: "7 days"
    })

    return response.status(200).json(token)
})


export { authRoutes }