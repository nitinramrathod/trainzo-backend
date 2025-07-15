import { FastifyPluginAsync } from "fastify";
import userController from "../../../../controllers/user.controller"

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", userController.getAll);
  fastify.post("/", userController.create);
  fastify.put('/:id', userController.update);
  fastify.delete('/:id', userController.remove);
  fastify.get('/:id', userController.getById);
};

export default userRoutes;
