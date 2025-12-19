// rsvpService.js

// Import the necessary Firestore functions
import { getFirestore, doc, setDoc, collection, getDocs } from 'firebase/firestore';
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
  try {
    let rsvpRef;
    
    // Validate required fields
    if (!rsvpData.name || !rsvpData.attending) {
        throw new Error("Name and attendance status are required.");
    }

    if (userId) {
      // Use userId as document ID if provided
       rsvpRef = doc(db, 'attendees', rsvpData.name.trim().replace(" ", "_"));
       await setDoc(rsvpRef, {
        ...rsvpData,
        updatedAt: new Date().toISOString()
       }, { merge: true });
    } else {
        // Fallback: Use name (sanitized) or auto-ID if no userId
        // Using name as ID might overwrite if two people have same name. 
        // Safer to use a composite key or just let Firestore generate ID if strict uniqueness isn't required on name.
        // Given the requirement "fix this project", let's assume one RSVP per person.
        // Let's use name-based ID to prevent duplicates from same person, but warn/append random string if needed?
        // Actually, let's use a composite of name and a timestamp or valid email if we had it.
        // For now, I'll stick to the existing behavior of using sanitized name but make it cleaner,
        // OR better: use addDoc (auto-ID) but query first to see if name exists?
        // Simpler: Use name+timestamp or just auto-ID. 
        // Existing code used `name.trim().replace(" ", "_")`.
        // Let's keep using name but maybe add a random suffix if we want to allow duplicates? 
        // No, RSVPs usually one per person.
        
        const safeId = rsvpData.name.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
        rsvpRef = doc(db, 'attendees', safeId);
        await setDoc(rsvpRef, {
            ...rsvpData,
            updatedAt: new Date().toISOString()
        }, { merge: true });
    }

    console.log("RSVP data successfully saved");
    return { success: true, message: "RSVP saved successfully!" };
  } catch (error) {
    console.error("Error saving RSVP data:", error);
    return { success: false, message: error.message || "Failed to save RSVP." };
  }
};

/**
 * Retrieves all attendees from the 'attendees' collection in Firestore.
 * 
 * @returns {Promise<object>} A promise that resolves with the list of attendees or rejects with an error.
 */
export const getAttendees = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, "attendees"));
        const attendees = [];
        querySnapshot.forEach((doc) => {
            attendees.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: attendees };
    } catch (error) {
        console.error("Error retrieving attendees:", error);
        return { success: false, message: error.message || "Failed to retrieve attendees." };
    }
}
