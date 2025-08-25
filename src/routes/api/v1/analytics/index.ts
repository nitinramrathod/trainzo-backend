import { FastifyPluginAsync } from "fastify";
import analyticsController from "../../../../controllers/analytics.controller"

const userRoutes: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get("/stats", analyticsController.dashboardStats);
};

export default userRoutes;
