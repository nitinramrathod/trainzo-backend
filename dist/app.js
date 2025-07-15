"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const autoload_1 = __importDefault(require("@fastify/autoload"));
const database_1 = require("./helper/database/database");
const App = async (fastify, opts) => {
    await (0, database_1.connectDB)();
    // Plugin loading
    fastify.register(autoload_1.default, {
        dir: node_path_1.default.join(__dirname, 'plugins'),
        options: opts
    });
    // Route loading
    fastify.register(autoload_1.default, {
        dir: node_path_1.default.join(__dirname, 'routes'),
        options: opts
    });
};
exports.default = App;
