import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"

export async function listEvents(fastify: FastifyInstance) {
  fastify.get("/events", async (request, reply) => {
    const events = await prisma.event.findMany()

    return reply.status(200).send(events)
  })
}
