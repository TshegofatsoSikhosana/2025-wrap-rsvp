import dbConnect from '@/lib/mongodb';
import Rsvp from '@/models/Rsvp';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const rsvp = await Rsvp.create(body);
    return NextResponse.json({ success: true, data: rsvp }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
