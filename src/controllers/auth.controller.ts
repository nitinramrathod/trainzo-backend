import UserModel from "../models/user.model";
import { FastifyRequest, FastifyReply } from "fastify";
import { validateUser } from "../validation-schema/user.validation";
import bodyParser from "../helper/common/bodyParser";
import { formatHumanDate } from "../helper/formatHumanDate";
import { successResponse } from "../helper/response";
import getPaginationMeta from "../helper/metaPagination";
import addMonths from "../helper/dates/addMonths";
import { IUserResponse } from "../types/user.interface";
import bcrypt from "bcryptjs";

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

    if (!email || !password) {
      return reply
        .status(400)
        .send({ error: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });

    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      return reply
        .status(404)
        .send({ error: "Email or password is incorrect" });
    }

    // Generate JWT token
    const token = await reply.jwtSign(
      { userId: user._id, email: user.email },
      { expiresIn: "48h" }
    );

    reply.status(200).send({
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
  const { id } = request.params;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    const userRaw = user.toObject();

    const userObj: IUserResponse = {
      ...userRaw,
      _id: (userRaw._id as string | { toString(): string }).toString(),
      dob: userRaw.dob
        ? formatHumanDate(userRaw.dob, "numericDash")
        : undefined,
      joining_date: userRaw.joining_date
        ? formatHumanDate(userRaw.joining_date, "numericDash")
        : undefined,
      expiry_date: userRaw.expiry_date
        ? formatHumanDate(userRaw.expiry_date, "numericDash")
        : undefined,
    };

    reply.status(200).send({ data: userObj });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch user", details: err });
  }
}

export default { login, logout };
