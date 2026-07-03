import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SiteContent from '@/lib/models/SiteContent';

export async function GET() {
  await dbConnect();
  const items = await SiteContent.find({});
  const content: Record<string, string> = {};
  items.forEach((item) => {
    content[item.key] = item.value;
  });
  return NextResponse.json(content);
}
