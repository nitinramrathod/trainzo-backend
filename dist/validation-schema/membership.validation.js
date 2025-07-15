"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.membershipValidationSchema = exports.validateMembership = void 0;
const joi_1 = __importDefault(require("joi"));
const validationErrorMessage_1 = __importDefault(require("../helper/validation/validationErrorMessage"));
const membershipValidationSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().optional(),
    duration: joi_1.default.number().required(),
    price: joi_1.default.number().required(),
    discount_price: joi_1.default.number().optional()
}).unknown(true);
exports.membershipValidationSchema = membershipValidationSchema;
const validateMembership = async (fields, reply) => {
    return await (0, validationErrorMessage_1.default)(fields, reply, membershipValidationSchema);
};
exports.validateMembership = validateMembership;
