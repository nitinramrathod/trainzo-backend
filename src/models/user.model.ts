import { Schema, model } from 'mongoose';
import { IUser } from '../types/user.interface';
import bcrypt from 'bcryptjs';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String },
    contact: { type: String, required: true },
    dob: { type: Date },
    address: { type: String },
    gender: { type: String, required: true },
    role: { type: String, required: true },
    photo: { type: String },
    joining_date: { type: Date },
    gym_package: {
      type: Schema.Types.ObjectId,
      ref: "membership",
      required: true,
    },
    workout_package: { 
      type: Schema.Types.ObjectId,
      ref: "workoutPlan"
    },
    password:{type: String},
    paid_fees: { type: Number }
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password as string, salt);
        next();
    } catch (err) {
        next(err as any);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  console.log("Candidate:", candidatePassword);
    console.log("Hashed Password:", this.password);
    return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = model<IUser>('user', userSchema);

export default UserModel;