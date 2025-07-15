type TWorkout = {
  day: number;
  exercises: Exercise[];
};

type Exercise = {
  workout_id: string;
  sets: string;
  repetition: string;
  gaps: string;
};

type TWorkoutPlan = {
  name: string;
  description?: string;
  days: number;
  workouts: TWorkout[];
};

export default TWorkoutPlan;
