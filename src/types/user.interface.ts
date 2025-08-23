import { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email?: string;
  contact: string;
  dob?: Date;
  address: string;
  gender: string;
  role: string;
  photo?: string;
  password?: string;
  gym_package?: string;
  workout_package?: string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  paid_fees?: number;
  joining_date?: Date;
  expiry_date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserResponse {
  name: string;
  email?: string;
  _id?: string;
  contact: string;
  dob?: string;
  address: string;
  gender: string;
  role: string;
  photo?: string;
  gym_package?: string;
  workout_package?: string;
  paid_fees?: number;
  joining_date?: string;
  expiry_date?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export {
  IUserResponse
}