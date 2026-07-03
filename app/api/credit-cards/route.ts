import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CreditCard from '@/lib/models/CreditCard';

export async function GET() {
  await dbConnect();
  const cards = await CreditCard.find({ isActive: true }).sort({ order: 1 });
  return NextResponse.json(cards);
}
