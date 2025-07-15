"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = async (fields, reply, validationSchema) => {
    try {
        await validationSchema.validateAsync(fields, { abortEarly: false });
        return false;
    }
    catch (error) {
        const errors = error.details.reduce((acc, err) => {
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
exports.default = handleValidationError;
