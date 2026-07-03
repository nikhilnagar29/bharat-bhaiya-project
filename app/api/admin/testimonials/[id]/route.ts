import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Testimonial from '@/lib/models/Testimonial';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  const body = await request.json();
  const t = await Testimonial.findByIdAndUpdate(id, body, { new: true });
  if (!t) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(t);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  await dbConnect();
  await Testimonial.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
