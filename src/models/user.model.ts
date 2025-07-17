import { Schema, model } from 'mongoose';
import { IUser } from '../types/user.interface';
import { number } from 'joi';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String },
    contact: { type: String, required: true },
    dob: { type: Date },
    address: { type: String, required: true },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    photo: { type: String },
    joining_date: { type: Date },
    expiry_date: { type: Date },
    gym_package: {
      type: Schema.Types.ObjectId,
      ref: "membership",
      required: true,
    },
    workout_package: { type: Date },
    password:{type: String},
    paid_fees: { type: Number }
  },
  { timestamps: true }
);

const UserModel = model<IUser>('user', userSchema);

export default UserModel;