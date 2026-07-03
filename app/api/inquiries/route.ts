import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Inquiry from '@/lib/models/Inquiry';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { name, phone, email, service, message } = body;

    if (!name || !phone || !email || !service) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const inquiry = await Inquiry.create({ name, phone, email, service, message });
    return NextResponse.json({ success: true, id: inquiry._id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
