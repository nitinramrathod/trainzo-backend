import UserModel from "../models/user.model";
import { FastifyRequest, FastifyReply } from "fastify";
import { validateUser } from "../validation-schema/user.validation";
import bodyParser from "../helper/common/bodyParser";
import { formatHumanDate } from "../helper/formatHumanDate";
import { successResponse } from "../helper/response";
import getPaginationMeta from "../helper/metaPagination";
import addMonths from "../helper/dates/addMonths";

async function getAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const {
      limit = 10,
      page = 1,
      name,
    } = request.query as {
      limit?: number;
      page?: number;
      name?: string;
    };

    let filter:any = {};

    if(name){
      filter.name = {$regex: name, $options: 'i'}
    }

    const users = await UserModel.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .populate("gym_package", "name discount_price duration")
      .sort({ createdAt: -1 });

    const transformedUsers = users.map((user: any) => {
      const userObj = user.toObject();
      const discount_price = userObj?.gym_package?.discount_price;
      const paid_fees = userObj?.paid_fees;

      const joiningDate = new Date(userObj?.joining_date || new Date());
      const durationInMonth = userObj?.gym_package?.duration || 0

      const expiry_date = addMonths(joiningDate, durationInMonth);
      const is_active = expiry_date > new Date();

      return {
        ...userObj,
        joining_date: {
          raw: joiningDate,
          formatted: formatHumanDate(joiningDate, "fullDateTime"),
        },
        dob: {
          raw: user.dob,
          formatted: formatHumanDate(user.dob, "fullDateTime"),
        },
        remaining_fees: (discount_price || 0) - (paid_fees || 0),
        expiry_date:{
          raw : expiry_date,
          formatted: formatHumanDate(expiry_date, "fullDateTime"),
        },
        is_active
      };
    });

    const meta = await getPaginationMeta(UserModel, filter, page, limit);

    successResponse("User fetch successfully.", transformedUsers, reply, meta, 200);
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
      role,
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
      role,
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

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
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
      },
      {
        new: true,
        runValidators: true,
      }
    );

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
