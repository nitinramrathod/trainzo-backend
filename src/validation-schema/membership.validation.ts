import { FastifyReply } from "fastify";
import Joi from "joi";
import handleValidationError from "../helper/validation/validationErrorMessage";

const membershipValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  duration: Joi.number().required(),
  price: Joi.number().required(),
  discount_price: Joi.number().optional()
}).unknown(true);


const validateMembership = async (fields:any, reply:FastifyReply) => {
  return await handleValidationError(fields, reply, membershipValidationSchema);
};

export {validateMembership, membershipValidationSchema}