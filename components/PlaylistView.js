'use client';

import { useEffect, useState } from 'react';
import { getAttendees } from '@/lib/RsvpService';

export default function PlaylistView() {
  const [songs, setSongs] = useState([]);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const result = await getAttendees();
        if (result.success) {
          const allSongs = result.data.flatMap(attendee => 
            (attendee.songRequests || [])
              .filter(song => song && song.trim() !== '')
              .map(song => ({
                title: song,
                requestedBy: attendee.name,
                id: `${attendee.id}-${song}`
              }))
          );
          setSongs(allSongs);
          
          // Count attendees with attending === 'yes'
          const confirmedCount = result.data.filter(a => a.attending === 'yes').length;
          setAttendeeCount(confirmedCount);
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

    fetchSongs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-wrapped-bg flex items-center justify-center">
        <div className="text-wrapped-primary animate-pulse text-2xl font-black uppercase tracking-tighter">
          Curating the ultimate playlist...
        </div>
      </div>
    );
  }

  return (
    <div className="text-wrapped-white font-display p-4 md:p-8 scrollbar-hide flex flex-col items-center">
      <div className="max-w-4xl w-full mx-auto">
        {/* Attendee Stats Card */}
        <div className="mb-8 p-6 bg-black/40 backdrop-blur-xl rounded-3xl border border-wrapped-lime/30 shadow-[0_0_20px_rgba(190,242,100,0.1)] flex items-center justify-between group hover:border-wrapped-lime transition-all duration-500">
          <div>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-wrapped-lime opacity-80">Confirmed Headliners</p>
          </div>
          <div className="text-right flex items-center gap-3">
            <div className="text-4xl md:text-5xl font-black text-wrapped-lime group-hover:scale-110 transition-transform duration-500">{attendeeCount}</div>
            <p className="text-[10px] uppercase font-bold opacity-40">Attending</p>
          </div>
        </div>

        <header className="flex items-center gap-6 mb-4 mt-4">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-black rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden group shrink-0 border border-white/10">
            <span className="text-5xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_8px_rgba(190,242,100,0.8)]">🎵</span>
            <div className="absolute inset-0 bg-transparent group-hover:bg-wrapped-lime/5 transition-colors"></div>
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 opacity-60">Playlist</p>
            <h1 className="text-3xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-2 truncate">
              The <span className="text-wrapped-lime">Event</span> Mix
            </h1>
            <div className="flex items-center gap-2 text-xs md:text-sm font-bold">
              <span className="text-wrapped-lime">KARAOKE FAREWELL</span>
              <span className="opacity-40">•</span>
              <span className="opacity-80">{songs.length} tracks</span>
            </div>
          </div>
        </header>

        <div className="flex justify-center md:justify-start md:ml-[144px] mb-8">
          <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-3 bg-wrapped-lime text-black font-black text-sm uppercase tracking-widest rounded-full hover:scale-105 transition-transform shadow-lg shadow-wrapped-lime/20"
          >
            View Tracks
          </button>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <div className="relative bg-wrapped-bg border border-white/20 w-full max-w-2xl max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">The Event Mix</h2>
                  <p className="text-xs font-bold text-wrapped-lime uppercase tracking-widest opacity-80">{songs.length} tracks requested</p>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-2xl leading-none"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                <div className="grid grid-cols-[1fr_1fr] gap-4 px-4 py-2 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  <div>Title</div>
                  <div>Requested By</div>
                </div>

                <div className="space-y-1">
                  {songs.map((song) => (
                    <div 
                      key={song.id} 
                      className="grid grid-cols-[1fr_1fr] gap-4 px-4 py-3 rounded-lg hover:bg-white/10 transition-all group items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-black border border-white/10 rounded flex items-center justify-center text-base group-hover:bg-wrapped-lime group-hover:text-black transition-all shrink-0 text-wrapped-lime">
                          💿
                        </div>
                        <div>
                          <div className="font-bold text-sm md:text-base group-hover:text-wrapped-primary transition-colors leading-tight">
                            {song.title}
                          </div>
                        </div>
                      </div>
                      <div className="text-white/60 text-xs md:text-sm font-medium">
                        {song.requestedBy}
                      </div>
                    </div>
                  ))}
                </div>

                {songs.length === 0 && (
                  <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/20">
                    <div className="text-4xl mb-2 opacity-20">📭</div>
                    <p className="text-lg font-bold opacity-50 uppercase tracking-tighter">No tracks yet!</p>
                    <p className="text-xs opacity-30 mt-1">RSVP to add yours to the setlist.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
