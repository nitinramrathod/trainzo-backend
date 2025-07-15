"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutValidationSchema = exports.validateWorkout = void 0;
const joi_1 = __importDefault(require("joi"));
const validationErrorMessage_1 = __importDefault(require("../helper/validation/validationErrorMessage"));
const workoutValidationSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    video_iframe: joi_1.default.string().required()
}).unknown(true);
exports.workoutValidationSchema = workoutValidationSchema;
const validateWorkout = async (fields, reply) => {
    return await (0, validationErrorMessage_1.default)(fields, reply, workoutValidationSchema);
};
exports.validateWorkout = validateWorkout;
