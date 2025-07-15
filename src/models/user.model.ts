import { Schema, model } from 'mongoose';
import { IUser } from '../types/user.interface';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String },
    contact: { type: String, required: true },
    dob: { type: String },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    photo: { type: String },
    joining_date: { type: Date },
    expiry_date: { type: Date },
    gym_package: { type: Date },
    workout_package: { type: Date },
    password:{type: String},
    paid_fees: { type: Number }
  },
  { timestamps: true }
);

const UserModel = model<IUser>('User', userSchema);

export default UserModel;