import UserModel from "../models/user.model";
import { FastifyRequest, FastifyReply } from "fastify";
import bodyParser from "../helper/common/bodyParser";
import { validateLogin } from "../validation-schema/auth.validation";
interface LoginRequestBody {
  email: string;
  password: string;
}

export async function login(
  request: FastifyRequest<{ Body: LoginRequestBody }>,
  reply: FastifyReply
) {
  try {
    const fields = await bodyParser(request);
    const { email, password } = fields;
 
    let isValid = await validateLogin(fields, reply);
  
    if (isValid) {
      return;
    }

    const user = await UserModel.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return reply.status(404).send({ error: "Email or password is incorrect" });
    }

    // Generate JWT token
    const token = await reply.jwtSign(
      { userId: user._id, email: user.email },
      { expiresIn: "48h" }
    );    

      reply.status(200)
      .send({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });

  } catch (err) {
    reply.status(500).send({ error: "Failed to login", details: err });
  }
}

async function logout(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {

}

export default { login, logout };
