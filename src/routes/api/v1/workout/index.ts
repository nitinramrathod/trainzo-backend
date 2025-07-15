import { FastifyPluginAsync } from "fastify";
import workoutController from "../../../../controllers/workout.controller"

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", workoutController.getAll);
  fastify.post("/", workoutController.create);
  fastify.put('/:id', workoutController.update);
  fastify.delete('/:id', workoutController.remove);
  fastify.get('/:id', workoutController.getById);
};

export default userRoutes;
