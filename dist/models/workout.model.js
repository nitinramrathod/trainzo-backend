"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workoutSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    video_iframe: { type: String, required: true }
}, { timestamps: true });
const WorkoutModel = (0, mongoose_1.model)('workout', workoutSchema);
exports.default = WorkoutModel;
