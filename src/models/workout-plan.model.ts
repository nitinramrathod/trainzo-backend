import { Schema, model } from "mongoose";
import TWorkoutPlan from "../types/workout-plan.type";

// Sub-schema for exercises
const ExerciseSchema = new Schema(
  {
    workout_id: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
      required: true,
    },
    sets: { type: String, required: true },
    gap: { type: String, required: true },
    repetition: { type: String, required: true },
  },
  { _id: false } // prevent _id for subdocs if not needed
);

// Sub-schema for workout days
const WorkoutDaySchema = new Schema(
  {
    day: { type: Number, required: true },
    exercises: {
      type: [ExerciseSchema],
      required: true,
      validate: {
        validator: Array.isArray,
        message: "Exercises must be an array",
      },
    },
  },
  { _id: false }
);

// Main workout plan schema
const workoutPlanSchema = new Schema<TWorkoutPlan>(
  {
    name: { type: String, required: true },
    description: { type: String },
    days: { type: Number, required: true },
    workouts: {
      type: [WorkoutDaySchema],
      required: true,
      validate: {
        validator: Array.isArray,
        message: "Workouts must be an array",
      },
    },
  },
  { timestamps: true }
);

const WorkoutPlanModel = model<TWorkoutPlan>("workoutPlan", workoutPlanSchema);

export default WorkoutPlanModel;