import { FastifyReply } from "fastify";
import { ObjectSchema, ValidationErrorItem } from "joi";

const handleValidationError = async<T> (fields:T, reply:FastifyReply, validationSchema:ObjectSchema<T>) => {
  try {
    await validationSchema.validateAsync(fields, { abortEarly: false });
    return false;
  } catch (error:any) {
    const errors = (error.details as ValidationErrorItem[]).reduce((acc: Record<string, string>, err) => {
      if (err.context?.key) {
        acc[err.context.key] = err.message;
      }
      return acc;
    }, {});

    reply.status(422).send({
      message: "Validation failed",
      errors: errors,
    });
    return true;
  }
};

export default handleValidationError;