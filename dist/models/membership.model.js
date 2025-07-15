"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const membershipSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    discount_price: { type: String }
}, { timestamps: true });
const MembershipModel = (0, mongoose_1.model)('membership', membershipSchema);
exports.default = MembershipModel;
