"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const membership_controller_1 = __importDefault(require("../../../../controllers/membership.controller"));
const userRoutes = async (fastify, opts) => {
    fastify.get("/", membership_controller_1.default.getAll);
    fastify.post("/", membership_controller_1.default.create);
    fastify.put('/:id', membership_controller_1.default.update);
    fastify.delete('/:id', membership_controller_1.default.remove);
    fastify.get('/:id', membership_controller_1.default.getById);
};
exports.default = userRoutes;
