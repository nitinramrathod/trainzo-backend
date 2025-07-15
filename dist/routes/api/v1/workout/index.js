"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const workout_controller_1 = __importDefault(require("../../../../controllers/workout.controller"));
const userRoutes = async (fastify, opts) => {
    fastify.get("/", workout_controller_1.default.getAll);
    fastify.post("/", workout_controller_1.default.create);
    fastify.put('/:id', workout_controller_1.default.update);
    fastify.delete('/:id', workout_controller_1.default.remove);
    fastify.get('/:id', workout_controller_1.default.getById);
};
exports.default = userRoutes;
