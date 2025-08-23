import { FastifyPluginAsync, FastifyRequest, FastifyReply } from "fastify";
import userController from "../../../../controllers/user.controller"

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", { preHandler: fastify.authenticate }, userController.getAll);
  fastify.get("/expiring", { preHandler: fastify.authenticate }, userController.getExpiringUsers);
  fastify.post("/", { preHandler: fastify.authenticate }, userController.create);

  fastify.put<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      return userController.update(request, reply);
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      return userController.remove(request, reply);
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/:id",
    { preHandler: fastify.authenticate },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      return userController.getById(request, reply);
    }
  );
};

export default userRoutes;
