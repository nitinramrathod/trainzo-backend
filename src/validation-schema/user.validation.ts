import { FastifyReply, FastifyRequest } from "fastify";
import Joi from "joi";
import handleValidationError from "../helper/validation/validationErrorMessage";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email(),
  contact: Joi.string()
      .required()
      .pattern(/^\d+$/)
      .min(6)
      .max(20)
      .empty("")
      .messages({
        "string.base": 'Contact number should be string',
        "any.required": 'Contact number should is required',
        "string.empty": 'Contact number should not be empty',
        "string.pattern.base": "Contact Number must contain only digits",
        "string.min": "Contact number must be at least 6 digits long",
        "string.max": "Contact number must not exceed 20 digits",
      }),
  dob: Joi.date()
      .iso()
      .empty("")
      .max("now")
      .messages({
        "date.base": "Date of birth must be a valid date in ISO format",
        "date.format": "Date of birth should be in format",
        "date.max": "Date of birth cannot be a future date",
      }),
  address: Joi.string().optional(),
  gender: Joi.string().valid("male", "female", "other").required(),
  role: Joi.string().valid("admin", "user", "trainer").required(),
  photo: Joi.string().optional(),
  password: Joi.string().optional(),
  joining_date: Joi.date().optional(),
  gym_package: Joi.string().required(),
  workout_package: Joi.string().optional(),
  paid_fees: Joi.number().optional(),
}).unknown(true);


const validateUser = async (fields:any, reply:FastifyReply, isUpdate:boolean = false) => {
  return await handleValidationError(fields, reply, userSchema);
};

export {validateUser, userSchema}