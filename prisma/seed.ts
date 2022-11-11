import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()


async function main() {

    // const user = await prisma.user.create({
    //     data: {
    //         email: "thiago@gmail.com",
    //         name: "Thiago",
    //         AvatartUrl: "https://avatars.githubusercontent.com/u/72626831?s=40&v=4"    
    //     }
    // })

    // const pool = await prisma.poll.create({
    //     data: {
    //         code: "BOL123",
    //         title: "Braza",
    //         ownerId: user.id,
    //         Participant: {
    //             create: {
    //                 userId: user.id
    //             }
    //         }
    //     }
    // })
 
    // await prisma.game.create({
    //     data: {
    //         date: "2022-11-03T19:10:20.241Z",
    //         firstTeamCountryCode: "DE",
    //         secondTeamCountryCode: "BR"
    //     }
    // })

    // await prisma.game.create({
    //     data: {
    //         date: "2022-11-02T19:10:20.241Z",
    //         firstTeamCountryCode: "BR",
    //         secondTeamCountryCode: "AR",
    //         guesses: {
    //             create: {
    //                 firstTeamPoints: 3,
    //                 secondTeamPoints: 3,
    //                 participant: {
    //                     connect: {
    //                         userId_poolId: {
    //                             poolId: pool.id,
    //                             userId: user.id
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // })

    const user2 = await prisma.user.create({
        data: {
            email: "test@gmail.com",
            name: "test",
            AvatartUrl: "https://avatars.githubusercontent.com/u/2254731?v=4"    
        }
    })

 
    await prisma.participant.create({
        data: {
            poolId: "cla1bjtdd0003ven3pu4n6cjr",
            userId: user2.id,
        }
    })
}

main ()