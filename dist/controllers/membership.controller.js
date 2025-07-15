"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser_1 = __importDefault(require("../helper/common/bodyParser"));
const membership_model_1 = __importDefault(require("../models/membership.model"));
const membership_validation_1 = require("../validation-schema/membership.validation");
async function getAll(request, reply) {
    try {
        const memberships = await membership_model_1.default.find().sort({ createdAt: -1 }); // newest first
        reply.send({ memberships });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to fetch membership", details: err });
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
        const { name, description, duration, price, discount_price } = fields;
        let isValid = await (0, membership_validation_1.validateMembership)(fields, reply);
        if (isValid) {
            return;
        }
        if (!name || !duration || !price) {
            return reply
                .status(400)
                .send({ error: "name, duration, and price are required" });
        }
        const existing = await membership_model_1.default.findOne({ name });
        if (existing) {
            return reply
                .status(409)
                .send({ error: "Membership with this name already exists" });
        }
        const user = await membership_model_1.default.create({
            name,
            description,
            duration,
            price,
            discount_price
        });
        reply.status(201).send({
            message: "Membership created successfully",
            user,
        });
    }
    catch (error) {
        reply.status(500).send({ error: "Failed to get membership " + error });
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
        const { name, description, duration, price, discount_price } = fields;
        let isValid = await (0, membership_validation_1.validateMembership)(fields, reply);
        if (isValid) {
            return;
        }
        const { id } = request.params;
        const updatedMembership = await membership_model_1.default.findByIdAndUpdate(id, {
            name,
            description,
            duration,
            price,
            discount_price
        }, {
            new: true,
            runValidators: true,
        });
        if (!updatedMembership) {
            return reply.status(404).send({ error: "Membership not found" });
        }
        reply.status(200).send({
            message: "Membership updated successfully",
            membership: updatedMembership,
        });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to update membership", details: err });
    }
}
async function remove(request, reply) {
    const { id } = request.params;
    try {
        const deletedMembership = await membership_model_1.default.findByIdAndDelete(id);
        if (!deletedMembership) {
            return reply.status(404).send({ error: "Membership not found" });
        }
        reply.status(200).send({
            message: "Membership deleted successfully",
            user: deletedMembership,
        });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to delete membership", details: err });
    }
}
async function getById(request, reply) {
    const { id } = request.params;
    try {
        const membership = await membership_model_1.default.findById(id);
        if (!membership) {
            return reply.status(404).send({ error: "membership not found" });
        }
        reply.status(200).send({ membership });
    }
    catch (err) {
        reply.status(500).send({ error: "Failed to fetch membership", details: err });
    }
}
exports.default = { create, remove, update, getAll, getById };
