import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteContent extends Document {
  key: string;
  value: string;
  updatedAt: Date;
}

const SiteContentSchema = new Schema<ISiteContent>({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.SiteContent || mongoose.model<ISiteContent>('SiteContent', SiteContentSchema);
