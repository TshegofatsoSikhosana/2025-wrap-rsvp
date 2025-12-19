import { saveRsvp } from '@/lib/RsvpService';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.attending) {
      return NextResponse.json(
        { success: false, error: 'Name and attending status are required' },
        { status: 400 }
      );
    }

    // In a real app, you might extract userId from the request (e.g., via session or token)
    // For now, we'll pass null to use the name-based ID generation in the service
    const userId = null; 

    const response = await saveRsvp(userId, body);

    if (response.success) {
      return NextResponse.json({ success: true, message: response.message }, { status: 201 });
    } else {
      return NextResponse.json({ success: false, error: response.message }, { status: 500 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 