import Rsvp from '@/models/Rsvp';
import { saveRsvp } from '@/lib/RsvpService'; // Adjust path as needed

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // await dbConnect();
    const body = await request.json();
    const rsvp = await Rsvp.create(body);
     const response = await saveRsvp(userId, rsvp);

          if (response.success) {

            alert(response.message);

            // Handle success, e.g., clear form, show confirmation

          } else {

            alert(`Error: ${response.message}`);

            // Handle error

          }
    return NextResponse.json({ success: true, data: rsvp }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}


    // Example in a Next.js component or API route


    import { getAuth } from 'firebase/auth'; // If using Firebase Authentication for user ID


    // Assuming 'app' is initialized and available

    // For client-side, getAuth(app) can be used after app is initialized

    const auth = getAuth(app); // Get the Auth instance


    const handleSubmit = async (rsvpFormData) => {

      // Get the current user's UID (assuming the user is authenticated)

      const userId = auth.currentUser?.uid; 


      if (userId) {

        try {

          const response = await saveRsvp(userId, rsvpFormData);

          if (response.success) {

            alert(response.message);

            // Handle success, e.g., clear form, show confirmation

          } else {

            alert(`Error: ${response.message}`);

            // Handle error

          }

        } catch (error) {

          console.error("Submission error:", error);

          alert("An unexpected error occurred during submission.");

        }

      } else {

        alert("Please sign in to submit your RSVP.");

      }

    };


    // Example RSVP data from a form

    const myRsvpData = {

      name: 'Jane Doe',

      attending: 'yes',

      plusOne: true,

      guestCount: 2,

      plusOneName: 'John Smith',

      songRequests: ['Bohemian Rhapsody', 'Sweet Caroline', 'Dancing Queen'],

      dietaryRestrictions: 'None'

    };


    // Call this function when the user submits their RSVP form

    // handleSubmit(myRsvpData); 