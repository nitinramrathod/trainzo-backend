import { FastifyPluginAsync } from 'fastify';

const rootRoute: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (request, reply) => {
    return { root: true };
  });
};

export default rootRoute;
