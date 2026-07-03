import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import SiteContent from '@/lib/models/SiteContent';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const items = await SiteContent.find({});
  const content: Record<string, string> = {};
  items.forEach((item) => {
    content[item.key] = item.value;
  });
  return NextResponse.json(content);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const body = await request.json();

  const updates = await Promise.all(
    Object.entries(body).map(([key, value]) =>
      SiteContent.findOneAndUpdate(
        { key },
        { key, value: value as string, updatedAt: new Date() },
        { upsert: true, new: true }
      )
    )
  );

  return NextResponse.json({ success: true, updated: updates.length });
}
