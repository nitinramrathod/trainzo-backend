import { FastifyReply } from "fastify";
import Joi from "joi";
import handleValidationError from "../helper/validation/validationErrorMessage";

const workoutValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  video_iframe: Joi.string().required()
}).unknown(true);


const validateWorkout = async (fields:any, reply:FastifyReply) => {
  return await handleValidationError(fields, reply, workoutValidationSchema);
};

export {validateWorkout, workoutValidationSchema}