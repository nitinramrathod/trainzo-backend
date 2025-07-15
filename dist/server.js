"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const server = (0, fastify_1.default)({ logger: true });
server.register(app_1.default);
server.listen({ port: 3030 }, (err, address) => {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    console.log(`🚀 Server listening at ${address}`);
});
