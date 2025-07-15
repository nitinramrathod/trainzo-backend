import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  contact: string;
  dob?: string;
  address: string;
  gender: string;
  role: string;
  photo?: string;
  password?: string;
  gym_package?: string;
  workout_package?: string;
  paid_fees?: number;
  joining_date?: Date;
  expiry_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}