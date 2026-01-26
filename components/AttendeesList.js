'use client';

import { useEffect, useState } from 'react';
import { getAttendees } from '../lib/RsvpService';

export default function AttendeesList() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendees = async () => {
      const response = await getAttendees();
      if (response.success) {
        setAttendees(response.data);
      }
      setLoading(false);
    };

    fetchAttendees();
  }, []);

  if (loading) {
    return <div className="text-white text-xl animate-pulse">Gathering the choir...</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-hide">
        {attendees.map((attendee, index) => (
          <div 
            key={attendee.id || index}
            className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:border-wrapped-pink transition-all transform hover:scale-105 hover:-rotate-2 animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="font-bold text-lg text-white truncate">{attendee.name}</div>
            <div className="text-sm text-white/70">
              {attendee.attending === 'yes' ? '🎤 Ready to sing!' : attendee.attending === 'no' ? '🚫 Catching the next show' : '🤔 Warming up...'}
            </div>
            {attendee.songRequests && attendee.songRequests.filter(song => song !== '').length > 0 && (
                <div className="text-xs text-wrapped-yellow mt-2 italic truncate">
                  🎵 {attendee.songRequests.filter(song => song !== '').length} songs added to setlist
                </div>
            )}
          </div>
        ))}
      </div>
      
      {attendees.length === 0 && (
          <div className="text-center text-white italic">
             You're the first lead singer! Grab the mic...
             <div className="slide-gif-container my-4 flex justify-center">
              <img src={'./wait.gif'} alt="Slide visual" className="max-h-48 rounded-lg object-contain" />
            </div>
         </div>
         
      )}
    </div>
  );
}
