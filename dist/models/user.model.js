"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String },
    contact: { type: String, required: true },
    dob: { type: String },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    photo: { type: String },
    joining_date: { type: Date },
    expiry_date: { type: Date },
    gym_package: { type: Date },
    workout_package: { type: Date },
    password: { type: String },
    paid_fees: { type: Number }
}, { timestamps: true });
const UserModel = (0, mongoose_1.model)('User', userSchema);
exports.default = UserModel;
