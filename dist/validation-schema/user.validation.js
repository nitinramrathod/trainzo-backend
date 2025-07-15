"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const validationErrorMessage_1 = __importDefault(require("../helper/validation/validationErrorMessage"));
const userSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    contact: joi_1.default.string().required(),
    dob: joi_1.default.date()
        .iso()
        .empty("")
        .max("now")
        .required()
        .messages({
        "date.base": "Date of birth must be a valid date in ISO format",
        "date.format": "Date of birth should be in format",
        "date.max": "Date of birth cannot be a future date",
        "any.required": "Joining date is required",
    }),
    address: joi_1.default.string().required(),
    gender: joi_1.default.string().valid("Male", "Female", "Other").required(),
    role: joi_1.default.string().valid("admin", "user", "trainer").required(),
    photo: joi_1.default.string().optional(),
    joining_date: joi_1.default.date().optional(),
    expiry_date: joi_1.default.date().optional(),
    gym_package: joi_1.default.date().optional(),
    workout_package: joi_1.default.string().optional(),
    paid_fees: joi_1.default.number().optional(),
}).unknown(true);
exports.userSchema = userSchema;
const validateUser = async (fields, reply, isUpdate = false) => {
    return await (0, validationErrorMessage_1.default)(fields, reply, userSchema);
};
exports.validateUser = validateUser;
