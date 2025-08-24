import fp from 'fastify-plugin';
import cors from '@fastify/cors';


export default fp(async (fastify) => {
  fastify.register(cors, {
     origin: process.env.NODE_ENV === 'production' 
      ? "https://trenzo-ui.vercel.app" 
      : "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // Needed for cookies or Authorization headers
  });
});