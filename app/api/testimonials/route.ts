import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

export async function GET() {
  await dbConnect();
  const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
  return NextResponse.json(testimonials);
}
