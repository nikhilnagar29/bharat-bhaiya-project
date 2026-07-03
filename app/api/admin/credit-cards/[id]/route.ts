import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import CreditCard from '@/lib/models/CreditCard';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await request.json();
  const card = await CreditCard.findByIdAndUpdate(params.id, body, { new: true });
  if (!card) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(card);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  await CreditCard.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}
