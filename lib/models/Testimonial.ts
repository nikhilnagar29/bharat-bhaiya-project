import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  designation?: string;
  city?: string;
  text: string;
  rating?: number;
  isActive: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  clientName: { type: String, required: true },
  designation: { type: String },
  city: { type: String },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
