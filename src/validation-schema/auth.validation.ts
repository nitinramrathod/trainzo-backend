import { FastifyReply, FastifyRequest } from "fastify";
import Joi from "joi";
import handleValidationError from "../helper/validation/validationErrorMessage";

const loginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
}).unknown(true);


const validateLogin = async (fields:any, reply:FastifyReply, isUpdate:boolean = false) => {
  return await handleValidationError(fields, reply, loginSchema);
};

export {validateLogin, loginSchema}