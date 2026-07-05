import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Service from '@/lib/models/Service';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await dbConnect();
  const service = await Service.findOne({ slug, isActive: true });
  if (!service) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(service);
}
