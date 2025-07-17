import { FastifyRequest, FastifyReply } from "fastify";
import bodyParser from "../helper/common/bodyParser";
import WorkoutModel from "../models/workout.model";
import { validateMembership } from "../validation-schema/membership.validation";
import { validateWorkout } from "../validation-schema/workout.validation";

async function getAll(request: FastifyRequest, reply: FastifyReply) {
  try {
    const workouts = await WorkoutModel.find().sort({ createdAt: -1 }); // newest first
    reply.send({ data:workouts });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch workouts", details: err });
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
      description,
      video_iframe
    } = fields;

    let isValid = await validateWorkout(fields, reply);

    if (isValid) {
      return;
    } 

    const existing = await WorkoutModel.findOne({ name });
    if (existing) {
      return reply
        .status(409)
        .send({ error: "workout with this name already exists" });
    }

    const user = await WorkoutModel.create({
      name,
      description,
      video_iframe
    });

    reply.status(201).send({
      message: "workout created successfully",
      user,
    });
  } catch (error) {
    reply.status(500).send({ error: "Failed to get workout " + error });
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
      description,
      video_iframe
    } = fields;

    let isValid = await validateWorkout(fields, reply);

    if (isValid) {
      return;
    }

    const { id } = request.params;

    const updatedWorkout = await WorkoutModel.findByIdAndUpdate(id, {
      name,
      description,
      video_iframe
    }, {
      new: true,
      runValidators: true,
    });

    if (!updatedWorkout) {
      return reply.status(404).send({ error: "Workout not found" });
    }

    reply.status(200).send({
      message: "Workout updated successfully",
      workout: updatedWorkout,
    });
  } catch (err) {
    reply.status(500).send({ error: "Failed to update workout", details: err });
  }
}

async function remove(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const deletedWorkout = await WorkoutModel.findByIdAndDelete(id);

    if (!deletedWorkout) {
      return reply.status(404).send({ error: "Workout not found" });
    }

    reply.status(200).send({
      message: "Workout deleted successfully",
      user: deletedWorkout,
    });
  } catch (err) {
    reply.status(500).send({ error: "Failed to delete workout", details: err });
  }
}

async function getById(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  const { id } = request.params;

  try {
    const workout = await WorkoutModel.findById(id);

    if (!workout) {
      return reply.status(404).send({ error: "Workout not found" });
    }

    reply.status(200).send({ workout });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch workout", details: err });
  }
}

export default { create, remove, update, getAll, getById };
