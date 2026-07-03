import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import CreditCardApplication from '@/lib/models/CreditCardApplication';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const applications = await CreditCardApplication.find({}).sort({ createdAt: -1 });
  return NextResponse.json(applications);
}
