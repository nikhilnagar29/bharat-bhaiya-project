import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  designation?: string;
  city?: string;
  text: string;
  rating?: number;
  imageUrl?: string; // base64 data URL or external URL
  isActive: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>({
  clientName: { type: String, required: true },
  designation: { type: String },
  city: { type: String },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  imageUrl: { type: String }, // stores base64 data URL
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
