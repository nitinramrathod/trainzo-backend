import { FastifyReply } from "fastify";


const successResponse = <T>(
    message: string,
    data: T,
    reply: FastifyReply,
    meta?:any,
    status_code:number = 200
) => {
  reply.code(status_code).send({
    message,
    success: true,
    data,
    ...(meta ? { meta } : {})
  });
};

export { successResponse };
