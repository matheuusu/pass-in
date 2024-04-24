import { z } from "zod"
import { FastifyInstance } from "fastify"
import { ZodTypeProvider } from "fastify-type-provider-zod"
import { prisma } from "../lib/prisma"

export async function registerForEvent(fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/events/:eventId/attendees",
    {
      schema: {
        body: z.object({
          name: z.string().min(4),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { name, email } = request.body
      const { eventId } = request.params

      const eventExist = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      })

      if (!eventExist) {
        throw new Error("O evento para o qual você se registrou não existe")
      }

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId,
          },
        },
      })

      if (attendeeFromEmail !== null) {
        throw new Error("This email is already registered for this event")
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId,
        },
      })

      return reply.status(201).send({ attendeeId: attendee.id })
    }
  )
}
