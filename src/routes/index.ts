import { Router } from "express"

import { usersRoutes } from "./users.routes"
import { pollsRoutes } from "./polls.routes"
import { guessesRoutes } from "./guesses.routes"
import { authRoutes } from "./auth.routes"
import { meRoutes } from "./me.routes"
import { gamesRoutes } from "./games.routes"


const router = Router()

router.use("/users", usersRoutes)
router.use("/polls", pollsRoutes)
router.use(guessesRoutes)
router.use("/users", authRoutes)
router.use(gamesRoutes)
router.use(meRoutes)


export { router }