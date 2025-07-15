import { FastifyReply, FastifyRequest } from "fastify";
import Joi from "joi";
import handleValidationError from "../helper/validation/validationErrorMessage";

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  contact: Joi.string().required(),
  dob: Joi.date()
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
  address: Joi.string().required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  role: Joi.string().valid("admin", "user", "trainer").required(),
  photo: Joi.string().optional(),
  joining_date: Joi.date().optional(),
  expiry_date: Joi.date().optional(),
  gym_package: Joi.date().optional(),
  workout_package: Joi.string().optional(),
  paid_fees: Joi.number().optional(),
}).unknown(true);


const validateUser = async (fields:any, reply:FastifyReply, isUpdate:boolean = false) => {
  return await handleValidationError(fields, reply, userSchema);
};

export {validateUser, userSchema}