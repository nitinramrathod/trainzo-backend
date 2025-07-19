import { FastifyRequest, FastifyReply } from "fastify";
import bodyParser from "../helper/common/bodyParser";
import { validateWorkout } from "../validation-schema/workout.validation";
import WorkoutPlanModel from "../models/workout-plan.model";
import { validateWorkoutPlan } from "../validation-schema/workout-plan.validation";
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

    let filter:any = {};

    if(name){
      filter.name = {$regex: name, $options: 'i'}
    }

    const workoutPlans = await WorkoutPlanModel.find(filter).sort({ createdAt: -1 });
    const meta = await getPaginationMeta(WorkoutPlanModel, filter, page, limit);
    successResponse("Workout Plans fetched successfully.", workoutPlans, reply, meta, 200);
  
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch workout plan", details: err });
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
      days,
    } = fields;

    let isValid = await validateWorkoutPlan(fields, reply);

    if (isValid) {
      return;
    }   

    const user = await WorkoutPlanModel.create({
      name,
      description,
      days,
      workouts: fields.workouts
    });

    reply.status(201).send({
      message: "workout plan created successfully",
      user,
    });
  } catch (error) {
    reply.status(500).send({ error: "Failed to get workout plan" + error });
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

    const updatedWorkout = await WorkoutPlanModel.findByIdAndUpdate(id, {
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
    const deletedWorkout = await WorkoutPlanModel.findByIdAndDelete(id);

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
    const workout = await WorkoutPlanModel.findById(id);

    if (!workout) {
      return reply.status(404).send({ error: "Workout not found" });
    }

    reply.status(200).send({ workout });
  } catch (err) {
    reply.status(500).send({ error: "Failed to fetch workout", details: err });
  }
}

export default { create, remove, update, getAll, getById };
