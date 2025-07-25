"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const cors_1 = __importDefault(require("@fastify/cors"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(cors_1.default, {
        origin: true, // Allow all origins — for dev only!
        credentials: true, // Needed for cookies or Authorization headers
    });
});
