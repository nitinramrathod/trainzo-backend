"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = __importDefault(require("../models/user.model"));
const user_validation_1 = require("../validation-schema/user.validation");
const bodyParser_1 = __importDefault(require("../helper/common/bodyParser"));
async function getAll(request, reply) {
    try {
        const users = await user_model_1.default.find().sort({ createdAt: -1 }); // newest first
        reply.send({ users });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to fetch users", details: err });
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
        const { name, email, contact, dob, address, gender, photo, gym_package, workout_package, paid_fees, joining_date, expiry_date, } = fields;
        let isValid = await (0, user_validation_1.validateUser)(fields, reply);
        if (isValid) {
            return;
        }
        if (!name || !email || !contact) {
            return reply
                .status(400)
                .send({ error: "name, email, and contact are required" });
        }
        const existing = await user_model_1.default.findOne({ email });
        if (existing) {
            return reply
                .status(409)
                .send({ error: "User with this email already exists" });
        }
        const user = await user_model_1.default.create({
            name,
            email,
            contact,
            dob,
            address,
            gender,
            photo,
            gym_package,
            workout_package,
            paid_fees,
            joining_date,
            expiry_date,
        });
        reply.status(201).send({
            message: "User created successfully",
            user,
        });
    }
    catch (error) {
        reply.status(500).send({ error: "Failed to get users " + error });
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
        const { name, email, contact, dob, address, gender, photo, gym_package, workout_package, paid_fees, joining_date, expiry_date, } = fields;
        let isValid = await (0, user_validation_1.validateUser)(fields, reply);
        if (isValid) {
            return;
        }
        const { id } = request.params;
        const updatedUser = await user_model_1.default.findByIdAndUpdate(id, {
            name,
            email,
            contact,
            dob,
            address,
            gender,
            photo,
            gym_package,
            workout_package,
            paid_fees,
            joining_date,
            expiry_date
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedUser) {
            return reply.status(404).send({ error: "User not found" });
        }
        reply.status(200).send({
            message: "User updated successfully",
            user: updatedUser,
        });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to update user", details: err });
    }
}
async function remove(request, reply) {
    const { id } = request.params;
    try {
        const deletedUser = await user_model_1.default.findByIdAndDelete(id);
        if (!deletedUser) {
            return reply.status(404).send({ error: "User not found" });
        }
        reply.status(200).send({
            message: "User deleted successfully",
            user: deletedUser,
        });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to delete user", details: err });
    }
}
async function getById(request, reply) {
    const { id } = request.params;
    try {
        const user = await user_model_1.default.findById(id);
        if (!user) {
            return reply.status(404).send({ error: "User not found" });
        }
        reply.status(200).send({ user });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to fetch user", details: err });
    }
}
exports.default = { create, remove, update, getAll, getById };
