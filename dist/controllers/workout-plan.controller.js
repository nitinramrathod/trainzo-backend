"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser_1 = __importDefault(require("../helper/common/bodyParser"));
const workout_model_1 = __importDefault(require("../models/workout.model"));
const workout_validation_1 = require("../validation-schema/workout.validation");
const workout_plan_model_1 = __importDefault(require("../models/workout-plan.model"));
const workout_plan_validation_1 = require("../validation-schema/workout-plan.validation");
async function getAll(request, reply) {
    try {
        const workoutPlans = await workout_plan_model_1.default.find().sort({ createdAt: -1 }); // newest first
        reply.send({ workoutPlans });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to fetch workout plan", details: err });
    }
}
async function create(request, reply) {
    try {
        if (!request.isMultipart()) {
            return reply
                .status(422)
                .send({ error: "Request must be multipart/form-data" });
        }
        const fields = await (0, bodyParser_1.default)(request);
        const { name, description, days, } = fields;
        console.log('fields===+===>', fields);
        let isValid = await (0, workout_plan_validation_1.validateWorkoutPlan)(fields, reply);
        if (isValid) {
            return;
        }
        const user = await workout_plan_model_1.default.create({
            name,
            description,
            days
            // workouts: fields.workouts
        });
        reply.status(201).send({
            message: "workout plan created successfully",
            user,
        });
    }
    catch (error) {
        reply.status(500).send({ error: "Failed to get workout plan" + error });
    }
}
async function update(request, reply) {
    try {
        if (!request.isMultipart()) {
            return reply
                .status(422)
                .send({ error: "Request must be multipart/form-data" });
        }
        const fields = await (0, bodyParser_1.default)(request);
        const { name, description, video_iframe } = fields;
        let isValid = await (0, workout_validation_1.validateWorkout)(fields, reply);
        if (isValid) {
            return;
        }
        const { id } = request.params;
        const updatedWorkout = await workout_model_1.default.findByIdAndUpdate(id, {
            name,
            description,
            video_iframe
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedWorkout) {
            return reply.status(404).send({ error: "Workout not found" });
        }
        reply.status(200).send({
            message: "Workout updated successfully",
            workout: updatedWorkout,
        });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to update workout", details: err });
    }
}
async function remove(request, reply) {
    const { id } = request.params;
    try {
        const deletedWorkout = await workout_model_1.default.findByIdAndDelete(id);
        if (!deletedWorkout) {
            return reply.status(404).send({ error: "Workout not found" });
        }
        reply.status(200).send({
            message: "Workout deleted successfully",
            user: deletedWorkout,
        });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to delete workout", details: err });
    }
}
async function getById(request, reply) {
    const { id } = request.params;
    try {
        const workout = await workout_model_1.default.findById(id);
        if (!workout) {
            return reply.status(404).send({ error: "Workout not found" });
        }
        reply.status(200).send({ workout });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to fetch workout", details: err });
    }
}
exports.default = { create, remove, update, getAll, getById };
