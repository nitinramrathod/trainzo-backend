import { FastifyReply } from "fastify";
import Joi from "joi";
import handleValidationError from "../helper/validation/validationErrorMessage";

const workoutPlanValidationSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  days: Joi.number().required(),
  workouts: Joi.array().items(
    Joi.object({
      day: Joi.number().required(),
      exercises: Joi.array().items(
        Joi.object({
          workout_id: Joi.string().required(),
          sets: Joi.string().required(),
          gap: Joi.string().optional(),
          repetition: Joi.string().required(),
        })
      ).required()
    })
  ).required()
}).unknown(true);


const validateWorkoutPlan = async (fields:any, reply:FastifyReply) => {
  return await handleValidationError(fields, reply, workoutPlanValidationSchema);
};

export {validateWorkoutPlan, workoutPlanValidationSchema}