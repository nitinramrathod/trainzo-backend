"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rootRoute = async (fastify, opts) => {
    fastify.get('/', async (request, reply) => {
        return { root: true };
    });
};
exports.default = rootRoute;
