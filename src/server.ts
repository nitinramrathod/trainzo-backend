import fastify from 'fastify';
import App from './app';
import dotenv from "dotenv";

dotenv.config();

const server = fastify({ logger: true });

server.register(App);

server.listen({ port: 3030 }, (err, address) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server listening at ${address}`);
});
