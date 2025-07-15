"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Sub-schema for exercises
const ExerciseSchema = new mongoose_1.Schema({
    workout_id: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Workout",
        required: true,
    },
    sets: { type: String, required: true },
    gap: { type: String, required: true },
    repetition: { type: String, required: true },
}, { _id: false } // prevent _id for subdocs if not needed
);
// Sub-schema for workout days
const WorkoutDaySchema = new mongoose_1.Schema({
    day: { type: Number, required: true },
    exercises: {
        type: [ExerciseSchema],
        required: true,
        validate: {
            validator: Array.isArray,
            message: "Exercises must be an array",
        },
    },
}, { _id: false });
// Main workout plan schema
const workoutPlanSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    days: { type: Number, required: true },
    workouts: {
        type: [WorkoutDaySchema],
        required: true,
        validate: {
            validator: Array.isArray,
            message: "Workouts must be an array",
        },
    },
}, { timestamps: true });
const WorkoutPlanModel = (0, mongoose_1.model)("workoutPlan", workoutPlanSchema);
exports.default = WorkoutPlanModel;
