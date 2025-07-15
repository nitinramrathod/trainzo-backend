"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exampleRoute = async (fastify, opts) => {
    fastify.get('/', async (request, reply) => {
        return 'this is an example';
    });
};
exports.default = exampleRoute;
