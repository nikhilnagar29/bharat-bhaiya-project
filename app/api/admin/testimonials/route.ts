import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const testimonials = await Testimonial.find({}).sort({ createdAt: -1 });
  return NextResponse.json(testimonials);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await request.json();
  const testimonial = await Testimonial.create(body);
  return NextResponse.json(testimonial, { status: 201 });
}
