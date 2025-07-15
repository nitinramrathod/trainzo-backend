import { FastifyPluginAsync } from "fastify";
import workoutPlanController from "../../../../controllers/workout-plan.controller"

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/", workoutPlanController.getAll);
  fastify.post("/", workoutPlanController.create);
  fastify.put('/:id', workoutPlanController.update);
  fastify.delete('/:id', workoutPlanController.remove);
  fastify.get('/:id', workoutPlanController.getById);
};

export default userRoutes;
