import { Schema, model } from 'mongoose';
import TMembership from '../types/membership.type';

const membershipSchema = new Schema<TMembership>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    discount_price: { type: String}
  },
  { timestamps: true }
);

const MembershipModel = model<TMembership>('membership', membershipSchema);

export default MembershipModel;