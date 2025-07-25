import fp from 'fastify-plugin';
import cors from '@fastify/cors';


export default fp(async (fastify) => {
  fastify.register(cors, {
    origin: true, // Allow all origins — for dev only!
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Needed for cookies or Authorization headers
  });
});