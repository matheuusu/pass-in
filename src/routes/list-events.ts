import { FastifyInstance } from "fastify"
import { prisma } from "../lib/prisma"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"

export async function listEvents(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/events",
    {
      schema: {
        summary: "Get all events",
        tags: ["events"],
        response: {
          200: z.object({
            events: z.array(
              z.object({
                id: z.string().uuid(),
                title: z.string(),
                details: z.string().nullable(),
                slug: z.string(),
                maximumAttendees: z.number().int().positive().nullable(),
              })
            ),
          }),
        },
      },
    },
    async (request, reply) => {
      const events = await prisma.event.findMany()

      return reply.send({
        events: events.map((event) => {
          return {
            id: event.id,
            title: event.title,
            details: event.details ?? null,
            slug: event.slug,
            maximumAttendees: event.maximumAttendees ?? null,
          }
        }),
      })
    }
  )
}
