"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = __importDefault(require("../../../../controllers/user.controller"));
const userRoutes = async (fastify, opts) => {
    fastify.get("/", user_controller_1.default.getAll);
    fastify.post("/", user_controller_1.default.create);
    fastify.put('/:id', user_controller_1.default.update);
    fastify.delete('/:id', user_controller_1.default.remove);
    fastify.get('/:id', user_controller_1.default.getById);
};
exports.default = userRoutes;
