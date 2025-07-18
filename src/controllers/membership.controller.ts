import { FastifyRequest, FastifyReply } from "fastify";
import bodyParser from "../helper/common/bodyParser";
import MembershipModel from "../models/membership.model";
import { validateMembership } from "../validation-schema/membership.validation";
import getPaginationMeta from "../helper/metaPagination";
import { successResponse } from "../helper/response";

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

    let filter: any = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const memberships = await MembershipModel.find(filter)
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // newest first


    const meta = await getPaginationMeta(MembershipModel, filter, page, limit);
    successResponse("Membership fetched successfully.", memberships, reply, meta, 200);
  
  } catch (err) {
    reply
      .status(500)
      .send({ error: "Failed to fetch membership", details: err });
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

    const { name, description, duration, price, discount_price } = fields;

    let isValid = await validateMembership(fields, reply);

    if (isValid) {
      return;
    }

    if (!name || !duration || !price) {
      return reply
        .status(400)
        .send({ error: "name, duration, and price are required" });
    }

    const existing = await MembershipModel.findOne({ name });
    if (existing) {
      return reply
        .status(409)
        .send({ error: "Membership with this name already exists" });
    }

    const user = await MembershipModel.create({
      name,
      description,
      duration,
      price,
      discount_price,
    });

    reply.status(201).send({
      message: "Membership created successfully",
      user,
    });
  } catch (error) {
    reply.status(500).send({ error: "Failed to get membership " + error });
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

    const { name, description, duration, price, discount_price } = fields;

    let isValid = await validateMembership(fields, reply);

    if (isValid) {
      return;
    }

    const { id } = request.params;

    const updatedMembership = await MembershipModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        duration,
        price,
        discount_price,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMembership) {
      return reply.status(404).send({ error: "Membership not found" });
    }

    reply.status(200).send({
      message: "Membership updated successfully",
      membership: updatedMembership,
    });
  } catch (err) {
    reply
      .status(500)
      .send({ error: "Failed to update membership", details: err });
  }
}

async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const deletedMembership = await MembershipModel.findByIdAndDelete(id);

    if (!deletedMembership) {
      return reply.status(404).send({ error: "Membership not found" });
    }

    reply.status(200).send({
      message: "Membership deleted successfully",
      user: deletedMembership,
    });
  } catch (err) {
    reply
      .status(500)
      .send({ error: "Failed to delete membership", details: err });
  }
}

async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const membership = await MembershipModel.findById(id);

    if (!membership) {
      return reply.status(404).send({ error: "membership not found" });
    }

    reply.status(200).send({ membership });
  } catch (err) {
    reply
      .status(500)
      .send({ error: "Failed to fetch membership", details: err });
  }
}

export default { create, remove, update, getAll, getById };
