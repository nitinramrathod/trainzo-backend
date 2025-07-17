import UserModel from "../models/user.model";
import { FastifyRequest, FastifyReply } from "fastify";
import { validateUser } from "../validation-schema/user.validation";
import bodyParser from "../helper/common/bodyParser";
import { formatHumanDate } from "../helper/formatHumanDate";

async function getAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const users = await UserModel.find()
      .populate('gym_package', 'name')
      .sort({ createdAt: -1 }); // newest first

    const transformedUsers = users.map((user: any) => ({
      ...user.toObject(),
      joining_date: {
        raw: user.joining_date,
        formatted: formatHumanDate(user.joining_date, 'fullDateTime'),
      },
    }));

    reply.send({ users: transformedUsers });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch users", details: err });
  }
}

async function create(request: FastifyRequest, reply: FastifyReply) {
  try {
    if (!request.isMultipart()) {
      return reply
        .status(422)
        .send({ error: "Request must be multipart/form-data" });
    }
    const fields = await bodyParser(request);

    const {
      name,
      email,
      contact,
      dob,
      address,
      gender,
      photo,
      gym_package,
      workout_package,
      paid_fees,
      joining_date,
      expiry_date,
      role
    } = fields;

    let isValid = await validateUser(fields, reply);

    if (isValid) {
      return;
    }

    if (!name || !email || !contact) {
      return reply
        .status(400)
        .send({ error: "name, email, and contact are required" });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return reply
        .status(409)
        .send({ error: "User with this email already exists" });
    }

    const user = await UserModel.create({
      name,
      email,
      contact,
      dob,
      address,
      gender,
      photo,
      gym_package,
      workout_package,
      paid_fees,
      joining_date,
      expiry_date,
      role
    });

    reply.status(201).send({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    reply.status(500).send({ error: "Failed to get users " + error });
  }
}

async function update(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {

     if (!request.isMultipart()) {
      return reply
        .status(422)
        .send({ error: "Request must be multipart/form-data" });
    }
    const fields = await bodyParser(request);

    const {
      name,
      email,
      contact,
      dob,
      address,
      gender,
      photo,
      gym_package,
      workout_package,
      paid_fees,
      joining_date,
      expiry_date,
    } = fields;

    let isValid = await validateUser(fields, reply);

    if (isValid) {
      return;
    }

    const { id } = request.params;

    const updatedUser = await UserModel.findByIdAndUpdate(id, {
      name,
      email,
      contact,
      dob,
      address,
      gender,
      photo,
      gym_package,
      workout_package,
      paid_fees,
      joining_date,
      expiry_date
    }, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return reply.status(404).send({ error: "User not found" });
    }

    reply.status(200).send({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    reply.status(500).send({ error: "Failed to update user", details: err });
  }
}

async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);

    if (!deletedUser) {
      return reply.status(404).send({ error: "User not found" });
    }

    reply.status(200).send({
      message: "User deleted successfully",
      user: deletedUser,
    });
  } catch (err) {
    reply.status(500).send({ error: "Failed to delete user", details: err });
  }
}

async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const user = await UserModel.findById(id);

    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    reply.status(200).send({ user });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch user", details: err });
  }
}

export default { create, remove, update, getAll, getById };
