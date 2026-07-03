import mongoose, { Schema, Document } from 'mongoose';

export interface ICreditCard extends Document {
  name: string;
  bank: string;
  imageUrl?: string;
  features: string[];
  annualFee: string;
  eligibility: string;
  isActive: boolean;
  order: number;
}

const CreditCardSchema = new Schema<ICreditCard>({
  name: { type: String, required: true },
  bank: { type: String, required: true },
  imageUrl: { type: String },
  features: [{ type: String }],
  annualFee: { type: String, required: true },
  eligibility: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.CreditCard || mongoose.model<ICreditCard>('CreditCard', CreditCardSchema);
