import { prisma } from "./prisma"

async function seed() {
  await prisma.event.create({
    data: {
      id: "6ab61f14-c6dd-4c37-9895-2da8814e47c1",
      title: "Unite Summit",
      slug: "unite-summit",
      details: "Um evento para quem ama estudar programação",
      maximumAttendees: 120,
    },
  })
}

try {
  seed().then(() => {
    console.log("Database seeded!")
    prisma.$disconnect()
  })
} catch (error) {
  throw new Error("Database seed was not completed")
}
