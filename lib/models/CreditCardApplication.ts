import mongoose, { Schema, Document } from 'mongoose';

export interface ICreditCardApplication extends Document {
  fullName: string;
  mobile: string;
  email: string;
  pincode: string;
  cardId: string;
  cardName: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: Date;
}

const CreditCardApplicationSchema = new Schema<ICreditCardApplication>({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true },
  pincode: { type: String, required: true },
  cardId: { type: String, required: true },
  cardName: { type: String, required: true },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.CreditCardApplication ||
  mongoose.model<ICreditCardApplication>('CreditCardApplication', CreditCardApplicationSchema);
