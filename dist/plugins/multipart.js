"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const multipart_1 = __importDefault(require("@fastify/multipart"));
exports.default = (0, fastify_plugin_1.default)(async (fastify) => {
    fastify.register(multipart_1.default, {
        limits: {
            fileSize: 10 * 1024 * 1024, // optional: 10MB max file size
        },
    });
});
