import { Schema, model } from 'mongoose';
import TWorkout from '../types/workout.type';

const workoutSchema = new Schema<TWorkout>(
  {
    name: { type: String, required: true },
    description: { type: String },
    video_iframe: { type: String, required: true }
  },
  { timestamps: true }
);

const WorkoutModel = model<TWorkout>('workout', workoutSchema);

export default WorkoutModel;