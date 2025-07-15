import { FastifyPluginAsync } from "fastify";
import membershipController from "../../../../controllers/membership.controller"

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", membershipController.getAll);
  fastify.post("/", membershipController.create);
  fastify.put('/:id', membershipController.update);
  fastify.delete('/:id', membershipController.remove);
  fastify.get('/:id', membershipController.getById);
};

export default userRoutes;
