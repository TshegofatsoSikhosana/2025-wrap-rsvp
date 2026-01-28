'use client';

import { useEffect, useState } from 'react';
import { getAttendees } from '@/lib/RsvpService';
import { useAppContext } from '@/context/AppContext';

export default function PlaylistViewList({ showScoreboard = true }) {
  const { performedSongs, togglePerformed, resetPerformed } = useAppContext();
  const [songs, setSongs] = useState([]);
  const [attendeeCount, setAttendeeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const filteredSongs = songs.filter(song => !performedSongs.includes(song.id));

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
    <div className="text-wrapped-white font-display p-4 md:p-8 flex flex-col items-center w-full max-w-4xl mx-auto h-full overflow-hidden">
      {/* Top Banner: Stats & Reset */}
      {showScoreboard && (
        <div className="w-full mb-6 flex flex-col sm:flex-row gap-4">
          {/* Attendee Stats Card */}
          <div className="flex-1 p-4 bg-black/40 backdrop-blur-xl rounded-2xl border border-wrapped-lime/20 flex items-center justify-between group">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-wrapped-lime opacity-80">Headliners</p>
            </div>
            <div className="text-right flex items-center gap-3">
              <div className="text-2xl font-black text-wrapped-lime">{attendeeCount}</div>
              <p className="text-[8px] uppercase font-bold opacity-40">Attending</p>
            </div>
          </div>

          {/* Live Tracker Card */}
          <div className="flex-1 p-4 bg-wrapped-purple/20 backdrop-blur-xl rounded-2xl border border-wrapped-purple/30 flex items-center justify-between">
            <div className="flex gap-4">
              <div className="text-center">
                 <div className="text-lg font-black text-wrapped-purple">{performedSongs.length}</div>
                 <div className="text-[8px] uppercase font-bold opacity-40">Done</div>
              </div>
              <div className="text-center">
                 <div className="text-lg font-black text-white">{filteredSongs.length}</div>
                 <div className="text-[8px] uppercase font-bold opacity-40">To Go</div>
              </div>
            </div>
            
            <button 
              onClick={resetPerformed}
              disabled={performedSongs.length === 0}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      <header className="w-full flex items-center gap-4 mb-6 shrink-0">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-black rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden group shrink-0 border border-white/10">
          <span className="text-3xl group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_8px_rgba(190,242,100,0.8)]">🎵</span>
          <div className="absolute inset-0 bg-transparent group-hover:bg-wrapped-lime/5 transition-colors"></div>
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-[10px] md:text-xs font-black uppercase tracking-widest mb-1 opacity-60">Playlist</p>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter leading-none mb-1 truncate">
            The <span className="text-wrapped-lime">Event</span> Mix
          </h1>
        </div>
      </header>

      {/* Tracks Container - Scrollable */}
      <div className="w-full flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent space-y-2 pb-10">
        <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30 sticky top-0 bg-wrapped-bg/80 backdrop-blur-md z-10">
          <div className="w-8">Done</div>
          <div>Title</div>
          <div className="text-right">By</div>
        </div>

        <div className="space-y-1">
          {filteredSongs.map((song) => (
            <div 
              key={song.id} 
              className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group items-center animate-in fade-in slide-in-from-left-2 duration-300"
            >
              <div className="flex items-center justify-center w-8">
                <input 
                  type="checkbox"
                  onChange={() => togglePerformed(song.id)}
                  checked={performedSongs.includes(song.id)}
                  className="w-5 h-5 rounded-md bg-white/10 border-white/20 accent-wrapped-lime cursor-pointer hover:border-wrapped-lime transition-all"
                />
              </div>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-black border border-white/10 rounded-lg flex items-center justify-center text-base group-hover:bg-wrapped-lime group-hover:text-black transition-all shrink-0 text-wrapped-lime">
                  💿
                </div>
                <div className="truncate">
                  <div className="font-bold text-sm group-hover:text-wrapped-primary transition-colors leading-tight truncate">
                    {song.title}
                  </div>
                </div>
              </div>
              <div className="text-white/40 text-[10px] font-bold uppercase tracking-wider text-right shrink-0">
                {song.requestedBy}
              </div>
            </div>
          ))}
        </div>

        {filteredSongs.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 opacity-50">
            <div className="text-4xl mb-4">✨</div>
            <p className="text-xl font-bold uppercase tracking-tighter">That's All Folks!</p>
            {songs.length > 0 ? (
              <p className="text-xs opacity-60 mt-2">Every superstar has had their moment.</p>
            ) : (
              <p className="text-xs opacity-60 mt-2">RSVP to add some heat to the mix.</p>
            )}
            {performedSongs.length > 0 && (
              <button 
                onClick={resetPerformed}
                className="mt-6 text-wrapped-lime font-black uppercase tracking-widest hover:underline text-xs"
              >
                Reset for an Encore?
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
