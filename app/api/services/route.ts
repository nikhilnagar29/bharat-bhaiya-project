import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/lib/models/Service';

export async function GET() {
  await dbConnect();
  const services = await Service.find({ isActive: true }).sort({ order: 1 });
  return NextResponse.json(services);
}
