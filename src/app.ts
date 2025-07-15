import { FastifyPluginAsync } from 'fastify';
import path from 'node:path';
import AutoLoad from '@fastify/autoload';
import { connectDB } from './helper/database/database';

const App: FastifyPluginAsync = async (fastify, opts): Promise<void> => {

  await connectDB();

  // Plugin loading
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: opts
  });

  // Route loading
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: opts
  });
};

export default App;
