// rsvpService.js

// Import the necessary Firestore functions
import { getFirestore, doc, setDoc } from 'firebase/firestore';
// Import your initialized Firebase app instance
// Make sure firebaseConfig.js (or similar) initializes and exports 'app'
import app from '../firebase/firebaseConfig'; 

// Get a reference to the Firestore database
const db = getFirestore(app);

/**
 * Saves RSVP data for a given user to the 'attendees' collection in Firestore.
 * Each user's RSVP will be stored under their unique userId as the document ID.
 * 
 * @param {string} userId The unique ID of the authenticated user.
 * @param {object} rsvpData An object containing the RSVP details.
 * @param {string} rsvpData.name The name of the person RSVPing.
 * @param {string} rsvpData.attending Whether the person is attending ('yes' or 'no').
 * @param {boolean} rsvpData.plusOne Indicates if they are bringing a plus one.
 * @param {number} rsvpData.guestCount The total number of guests, including themselves.
 * @param {string} rsvpData.plusOneName The name of the plus one, if applicable.
 * @param {string[]} rsvpData.songRequests An array of song requests.
 * @param {string} rsvpData.dietaryRestrictions Any dietary restrictions.
 * @returns {Promise<object>} A promise that resolves with a success status or rejects with an error.
 */
export const saveRsvp = async (userId, rsvpData) => {
  if (!userId) {
    throw new Error("A user ID is required to save RSVP data.");
  }

  // Create a document reference in the 'attendees' collection using the userId
  const userRsvpRef = doc(db, 'attendees', rsvpData.name.trim().replace(" ", "_"));

  try {
    // Set the document with the provided RSVP data
    await setDoc(userRsvpRef, rsvpData);
    console.log("RSVP data successfully saved for user:", userId);
    return { success: true, message: "RSVP saved successfully!" };
  } catch (error) {
    console.error("Error saving RSVP data:", error);
    return { success: false, message: error.message || "Failed to save RSVP." };
  }
};
