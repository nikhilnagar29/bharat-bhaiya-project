import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  title: string;
  description: string;
  subDescription?: string;
  buttonText: string;
  order: number;
  isActive: boolean;
  slug?: string;
  detailHtml?: string; // Custom HTML content for the service detail page
  detailCss?: string;  // Custom CSS for the service detail page
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subDescription: { type: String },
  buttonText: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  slug: { type: String },
  detailHtml: { type: String },
  detailCss: { type: String },
}, { timestamps: true });

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);
