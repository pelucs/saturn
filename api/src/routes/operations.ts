import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function operationRoutes(app: FastifyInstance){

  // Verificando se existe algum token de autenticação
  app.addHook('preHandler', async (request) => {
    await request.jwtVerify()
  });

  // Resgatando operações do usuário
  app
  .withTypeProvider<ZodTypeProvider>()
  .get('/operations/:userId', { 
    schema: {
      params: z.object({
        userId: z.string().uuid()
      }),
      querystring: z.object({
        startDate: z.string(),
        endDate: z.string(),
      })
      // Configurar o response
    }
   }, async (request, reply) => {
    const { userId } = request.params;
    const { startDate, endDate } = request.query;
    
    const operations = await prisma.operation.findMany({
      where: {
        userId,
        dateAt: {
          lte: new Date(endDate).toISOString(),
          gte: new Date(startDate).toISOString(),
        }
      },
      select: {
        id: true,
        description: true,
        amount: true,
        dateAt: true,
        type: true,
      },
      orderBy: {
        dateAt: 'desc'
      }
    });

    return reply.status(200).send(operations)
  });

  // Criação de uma nova operação
  app
  .withTypeProvider<ZodTypeProvider>()
  .post('/operations/create', {
    schema: {
      body: z.object({
        type: z.string(),
        dateAt: z.coerce.date(),
        description: z.string(),
        userId: z.string().uuid(),
        amount: z.coerce.number().int(),
      }),
      response: {
        201: z.object({
          operationId: z.number().int()
        })
      }
    }
  }, async (request, reply) => {
    const data = request.body;

    try {
      const operation = await prisma.operation.create({
        data: {
          type: data.type,
          amount: data.amount,
          dateAt: data.dateAt,
          userId: request.user.sub,
          description: data.description,
        }
      });

      return reply.status(201).send({ operationId: operation.id });
    } catch (error) {
      console.error(error);
    }
  });

  // Editando uma operação específica
  app
  .withTypeProvider<ZodTypeProvider>()
  .put('/operation/:operationsId', { 
    schema: {
      params: z.object({
        operationsId: z.coerce.number().int()
      }),
      body: z.object({
        type: z.string(),
        dateAt: z.coerce.date(),
        description: z.string(),
        amount: z.coerce.number().int(),
      })
    }
   }, async (request, reply) => {
    const { operationsId } = request.params;
    const { amount, dateAt, description, type } = request.body;

    const res = await prisma.operation.update({
      where: {
        id: operationsId
      },
      data: {
        type,
        amount,
        dateAt,
        description,
      }
    });

    return reply.status(200).send({ operationId: res.id });
  });
}