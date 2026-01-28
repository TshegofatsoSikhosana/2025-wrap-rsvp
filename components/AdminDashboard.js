'use client'
import { useEffect, useState, } from 'react';
import { getAttendees, updateContribution } from '@/lib/RsvpService';
import Link from 'next/link';

export default function AdminDashboard() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    async function fetchAttendees() {
      try {
        const result = await getAttendees();
        if (result.success) {
          // Initialize contribution_amt to 0 if it doesn't exist
          const dataWithDefaults = result.data.map(item => ({
            ...item,
            contribution_amt: item.contribution_amt || 0
          }));
          setAttendees(dataWithDefaults);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAttendees();
    const interval = setInterval(fetchAttendees, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleContributionChange = (id, value) => {
    setAttendees(prev => prev.map(a => 
      a.id === id ? { ...a, contribution_amt: value } : a
    ));
  };

  const handleUpdateContribution = async (id, amount) => {
    setUpdatingId(id);
    try {
      const result = await updateContribution(id, amount);
      if (result.success) {
        // Show a brief success state or just clear the updating state
        console.log("Updated!");
      } else {
        alert("Failed to update: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during update.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-wrapped-bg flex items-center justify-center">
        <div className="text-wrapped-primary animate-pulse text-2xl font-black uppercase tracking-tighter">
          Loading the Guest List...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-wrapped-bg flex items-center justify-center p-6">
        <div className="text-wrapped-pink text-center">
          <h2 className="text-3xl font-black mb-4 uppercase tracking-tighter">Oops!</h2>
          <p className="text-xl font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const attendingCount = attendees.filter(a => a.attending === 'yes').length;
  const totalGuests = attendees.reduce((acc, curr) => acc + (curr.guestCount || 0), 0);
  const totalContributions = attendees.reduce((acc, curr) => acc + (Number(curr.contribution_amt) || 0), 0);

  return (
    <div className="min-h-screen bg-wrapped-bg text-wrapped-white p-6 md:p-12 font-display">
      <header className="mb-12">
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
          Admin <span className="text-wrapped-primary">Dashboard</span>
        </h1>
        <div className="flex flex-wrap gap-4 text-sm font-bold uppercase tracking-widest items-center">
          <div className="bg-wrapped-purple px-4 py-2 rounded-full">
            Total RSVPs: {attendees.length}
          </div>
          <div className="bg-wrapped-blue px-4 py-2 rounded-full">
            Attending: {attendingCount}
          </div>
          <div className="bg-wrapped-orange px-4 py-2 rounded-full text-black">
            Total Heads: {totalGuests}
          </div>
          <div className="bg-wrapped-lime px-4 py-2 rounded-full text-black">
            Total Pot: R {totalContributions}
          </div>
          
          <Link 
            href="/orders" 
            className="ml-auto bg-wrapped-lime text-black px-6 py-2 rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
          >
            <span className="group-hover:animate-bounce">🍽️</span>
            View Menu Orders
          </Link>

          <Link 
            href="/playlist" 
            className="bg-wrapped-primary text-black px-6 py-2 rounded-full hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group"
          >
            <span className="group-hover:animate-bounce">🎵</span>
            View Event Playlist
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {attendees.map((attendee, index) => (
          <div 
            key={attendee.id} 
            className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1 flex items-center gap-2">
                  {attendee.name}
                  <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                    attendee.attending === 'yes' ? 'bg-wrapped-primary text-black' : 'bg-wrapped-pink text-white'
                  }`}>
                    {attendee.attending === 'yes' ? 'Attending' : 'Not Attending'}
                  </span>
                </h3>
                <p className="text-white/60 text-sm">
                   Guest Count: {attendee.guestCount || 0} | Updated: {new Date(attendee.updatedAt).toLocaleDateString()}
                </p>
                
                {attendee.dietaryRestrictions && (
                  <div className="mt-2 text-sm">
                    <span className="text-wrapped-yellow font-bold uppercase text-[10px] tracking-widest block mb-0.5">Dietary Requirements</span>
                    <p className="italic text-white/80">"{attendee.dietaryRestrictions}"</p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:flex-1 justify-end">
                {attendee.songRequests && attendee.songRequests.length > 0 && (
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 sm:max-w-[200px] w-full">
                    <p className="text-xs uppercase tracking-widest text-wrapped-primary font-black mb-2 italic">Song Requests</p>
                    <ul className="text-sm space-y-1">
                      {attendee.songRequests.map((song, i) => (
                        <li key={i} className="truncate">🎵 {song}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col gap-2 min-w-[200px]">
                  <label className="text-xs uppercase tracking-widest text-wrapped-lime font-black">Contribution (R)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      value={attendee.contribution_amt}
                      onChange={(e) => handleContributionChange(attendee.id, e.target.value)}
                      className="bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-sm w-full focus:outline-none focus:border-wrapped-primary transition-colors"
                      placeholder="0"
                    />
                    <button 
                      onClick={() => handleUpdateContribution(attendee.id, attendee.contribution_amt)}
                      disabled={updatingId === attendee.id}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                        updatingId === attendee.id 
                        ? 'bg-white/10 text-white/30' 
                        : 'bg-wrapped-primary text-black hover:scale-105 active:scale-95'
                      }`}
                    >
                      {updatingId === attendee.id ? '...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative index number */}
            <div className="absolute top-0 right-4 text-7xl font-black text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>

      {attendees.length === 0 && (
        <div className="text-center py-20 opacity-50 italic">
          No RSVPs yet. The vibe is still loading...
        </div>
      )}
    </div>
  );
}
