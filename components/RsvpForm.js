'use client';

import { useState } from 'react';

export default function RsvpForm() {
  const [formData, setFormData] = useState({
    name: '',
    attending: '',
    plusOne: false,
    guestCount: 1,
    plusOneName: '',
    songRequests: ['', '', ''],
    dietaryRestrictions: '',
  });

  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [message, setMessage] = useState('');

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'songRequests') {
      const newSongs = [...formData.songRequests];
      newSongs[index] = value;
      setFormData((prev) => ({ ...prev, songRequests: newSongs }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setMessage('');

     const myRsvpData = {

      name: 'Jane Doe',

      attending: 'yes',

      plusOne: true,

      guestCount: 2,

      plusOneName: 'John Smith',

      songRequests: ['Bohemian Rhapsody', 'Sweet Caroline', 'Dancing Queen'],

      dietaryRestrictions: 'None'

    };

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(myRsvpData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setMessage('Thanks for RSVPing! See you there!');
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(error.message);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center p-8 bg-wrapped-purple/20 rounded-xl border border-wrapped-purple animate-pulse">
        <h3 className="text-2xl font-bold mb-4">Confirmed!</h3>
        <p className="text-xl">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4 text-left p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
      <div>
        <label className="block text-sm font-bold mb-1 ml-1" htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-wrapped-pink focus:outline-none transition-colors"
          placeholder="Your full name"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 ml-1">Attending?</label>
        <div className="flex gap-4">
          {['yes', 'no', 'maybe'].map((option) => (
            <label key={option} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 flex-1 justify-center transition-colors">
              <input
                type="radio"
                name="attending"
                value={option}
                checked={formData.attending === option}
                onChange={handleChange}
                className="accent-wrapped-pink w-5 h-5"
                required
              />
              <span className="capitalize">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {formData.attending === 'yes' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
           <label className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer">
            <input
              type="checkbox"
              name="plusOne"
              checked={formData.plusOne}
              onChange={handleChange}
              className="accent-wrapped-pink w-5 h-5"
            />
            <span className="font-bold">Bringing Guests?</span>
          </label>

          {formData.plusOne && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1 ml-1" htmlFor="guestCount">How many guests?</label>
                <input
                  type="number"
                  id="guestCount"
                  name="guestCount"
                  min="1"
                  max="10"
                  value={formData.guestCount}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-wrapped-pink focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-1 ml-1" htmlFor="plusOneName">Guest Name(s)</label>
                <p className="text-xs text-white/60 mb-2 ml-1">Separate multiple names with commas</p>
                <input
                  type="text"
                  id="plusOneName"
                  name="plusOneName"
                  value={formData.plusOneName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-wrapped-pink focus:outline-none"
                  placeholder="Their names"
                />
              </div>
            </div>
          )}

          <div>
             <label className="block text-sm font-bold mb-1 ml-1" htmlFor="dietaryRestrictions">Dietary Restrictions</label>
             <input
              type="text"
              id="dietaryRestrictions"
              name="dietaryRestrictions"
              value={formData.dietaryRestrictions}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-wrapped-pink focus:outline-none"
              placeholder="Allergies, etc."
            />
          </div>

          <div>
             <label className="block text-sm font-bold mb-1 ml-1">Top 3 Song Requests</label>
             <div className="space-y-2">
               {formData.songRequests.map((song, index) => (
                 <input
                  key={index}
                  type="text"
                  name="songRequests"
                  value={song}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-wrapped-pink focus:outline-none placeholder:text-white/30"
                  placeholder={`Song #${index + 1}`}
                />
               ))}
             </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-wrapped-pink to-wrapped-orange font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg shadow-wrapped-pink/20"
      >
        {status === 'submitting' ? 'Sending...' : 'SEND IT'}
      </button>
      
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center mt-2">{message}</p>
      )}
    </form>
  );
}
