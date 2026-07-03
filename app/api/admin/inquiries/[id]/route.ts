import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/lib/models/Inquiry';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await request.json();
  const inquiry = await Inquiry.findByIdAndUpdate(params.id, body, { new: true });
  if (!inquiry) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(inquiry);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  await Inquiry.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
