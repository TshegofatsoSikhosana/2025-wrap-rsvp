'use client';

import { useEffect, useState } from 'react';
import { getAttendees } from '@/lib/RsvpService';

export default function PlaylistView() {
  const [songs, setSongs] = useState([]);
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
    <div className="min-h-screen bg-wrapped-bg text-wrapped-white font-display p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row items-end gap-6 mb-12">
          <div className="w-48 h-48 md:w-64 md:h-64 bg-linear-to-br from-wrapped-purple to-wrapped-pink rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden group">
            <span className="text-9xl group-hover:scale-110 transition-transform duration-500">🎵</span>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
          </div>
          
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-widest mb-2">Playlist</p>
            <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              The <span className="text-wrapped-primary">Event</span> Mix
            </h1>
            <div className="flex items-center gap-2 text-sm font-bold opacity-80">
              <span className="text-wrapped-lime">2025 WRAP</span>
              <span>•</span>
              <span>{songs.length} songs requested</span>
              <span>•</span>
              <span className="text-wrapped-primary italic">Handpicked by the squad</span>
            </div>
          </div>
        </header>

        <div className="mt-8">
          <div className="grid grid-cols-[auto_1fr_1fr] gap-4 px-4 py-2 border-b border-white/10 text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
            <div className="w-8">#</div>
            <div>Title</div>
            <div>Requested By</div>
          </div>

          <div className="space-y-1">
            {songs.map((song, index) => (
              <div 
                key={song.id} 
                className="grid grid-cols-[auto_1fr_1fr] gap-4 px-4 py-4 rounded-lg hover:bg-white/10 transition-all group items-center"
              >
                <div className="w-8 text-white/40 font-medium group-hover:text-wrapped-primary">
                  {index + 1}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/5 rounded flex items-center justify-center text-lg group-hover:bg-wrapped-primary/20 transition-colors">
                    💿
                  </div>
                  <div>
                    <div className="font-bold text-base md:text-lg group-hover:text-wrapped-primary transition-colors">
                      {song.title}
                    </div>
                  </div>
                </div>
                <div className="text-white/60 text-sm md:text-base font-medium">
                  {song.requestedBy}
                </div>
              </div>
            ))}
          </div>

          {songs.length === 0 && (
            <div className="text-center py-20 bg-white/5 rounded-2xl border border-dashed border-white/20">
              <div className="text-6xl mb-4 opacity-20">📭</div>
              <p className="text-xl font-bold opacity-50 uppercase tracking-tighter">No one's requested any songs yet!</p>
              <p className="text-sm opacity-30 mt-2">Go nag some people to RSVP with their tracks.</p>
            </div>
          )}
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-wrapped-purple/30 rounded-full blur-[120px] animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-wrapped-pink/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: '-2s' }}></div>
      </div>
    </div>
  );
}
