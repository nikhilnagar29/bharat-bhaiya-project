import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import CreditCardApplication from '@/lib/models/CreditCardApplication';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { fullName, mobile, email, pincode, cardId, cardName } = body;

    if (!fullName || !mobile || !email || !pincode || !cardId || !cardName) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const application = await CreditCardApplication.create({
      fullName,
      mobile,
      email,
      pincode,
      cardId,
      cardName,
    });
    return NextResponse.json({ success: true, id: application._id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
