"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workoutPlanValidationSchema = exports.validateWorkoutPlan = void 0;
const joi_1 = __importDefault(require("joi"));
const validationErrorMessage_1 = __importDefault(require("../helper/validation/validationErrorMessage"));
const workoutPlanValidationSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    days: joi_1.default.number().required(),
    workouts: joi_1.default.array().items(joi_1.default.object({
        day: joi_1.default.number().required(),
        exercises: joi_1.default.array().items(joi_1.default.object({
            workout_id: joi_1.default.string().required(),
            sets: joi_1.default.string().required(),
            gap: joi_1.default.string().optional(),
            repetition: joi_1.default.string().required(),
        })).required()
    })).required()
}).unknown(true);
exports.workoutPlanValidationSchema = workoutPlanValidationSchema;
const validateWorkoutPlan = async (fields, reply) => {
    return await (0, validationErrorMessage_1.default)(fields, reply, workoutPlanValidationSchema);
};
exports.validateWorkoutPlan = validateWorkoutPlan;
