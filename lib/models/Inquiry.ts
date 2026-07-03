import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email: string;
  service: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Closed';
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  message: { type: String },
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
