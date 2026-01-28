'use client';

import { useState, useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';

export default function RsvpForm() {
  const { userName, menuOrder } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    attending: 'yes',
    plusOne: false,
    guestCount: 0,
    plusOneName: '',
    songRequests: ['', '', '', '', ''],
    dietaryRestrictions: '',
    menuOrder: '',
  });

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: userName || prev.name,
      menuOrder: menuOrder || prev.menuOrder
    }));
  }, [userName, menuOrder]);

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

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');

      if(formData.attending === 'no'){
        setMessage("The show must go on, but we'll miss your solo/duet for Sahil & Revlen! Wishing you an awesome end of year!✨");
      }else{
        setMessage("You're on the setlist for Sahil & Revlen's farewell! Now scroll down to see your fellow headliners.");
      }
     
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage(error.message);
    }
  };

  if (status === 'success') {
    if(formData.attending === 'no'){
      return (
            <div className="text-center p-8 bg-wrapped-purple/20 rounded-xl border border-wrapped-purple">
              <h3 className="text-2xl font-bold mb-4">You're Booked!</h3>
              <p className="text-xl">{message}</p>
                <div className="slide-gif-container my-4 flex justify-center">
                  <img src={'./next_time.gif'} alt="Slide visual" className="max-h-48 rounded-lg object-contain" />
                </div>
            </div>
          );
    }
    else{ 
      return (
            <div className="text-center p-8 bg-wrapped-purple/20 rounded-xl border border-wrapped-purple">
              <h3 className="text-2xl font-bold mb-4">You're Booked!</h3>
              <p className="text-xl">{message}</p>
                <div className="slide-gif-container my-4 flex justify-center">
                  <img src={'./bart.gif'} alt="Slide visual" className="max-h-48 rounded-lg object-contain" />
                </div>
            </div>
          );
    }
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
          placeholder="Your name/nickname"
        />
      </div>

      <div>
        <label className="block text-sm font-bold mb-1 ml-1" htmlFor="menuOrder">Your Order</label>
        <input
          type="text"
          id="menuOrder"
          name="menuOrder"
          value={formData.menuOrder}
          onChange={handleChange}
          className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:border-wrapped-pink focus:outline-none transition-colors"
          placeholder="What you're craving"
        />
      </div>

      {/* <div>
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
      </div> */}

      {(formData.attending === 'yes' || formData.attending === 'maybe') && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">

          <div>
             <label className="block text-sm font-bold mb-1 ml-1 text-wrapped-pink uppercase tracking-wider">Turn memories into melodies!(minimum of 2 songs)</label>
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
        {status === 'submitting' ? 'Booking...' : 'SUBMIT TO SETLIST'}
      </button>
      
      {status === 'error' && (
        <p className="text-red-400 text-sm text-center mt-2">{message}</p>
      )}
    </form>
  );
}
