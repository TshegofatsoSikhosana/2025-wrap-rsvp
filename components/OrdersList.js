'use client';
import { useEffect, useState } from 'react';
import { getAttendees } from '@/lib/RsvpService';
import Link from 'next/link';

export default function OrdersList() {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const result = await getAttendees();
        if (result.success) {
          // Filter for attendees who have actually placed an order
          const withOrders = result.data.filter(a => a.menuOrder && a.menuOrder.trim() !== '');
          setAttendees(withOrders);
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

    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-wrapped-bg flex items-center justify-center">
        <div className="text-wrapped-primary animate-pulse text-2xl font-black uppercase tracking-tighter">
          Fetching the Menu Orders...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-wrapped-bg text-wrapped-white p-6 md:p-12 font-display">
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-4">
            Guest <span className="text-wrapped-lime">Orders</span>
          </h1>
          <p className="text-xl opacity-70 font-medium">The setlist for the kitchen! 🍳</p>
        </div>
        
        <div className="flex gap-4">
          <Link 
            href="/admin" 
            className="bg-white/10 text-white px-6 py-3 rounded-full hover:bg-white/20 transition-all font-bold uppercase tracking-widest text-xs border border-white/10"
          >
            Back to Admin
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {attendees.map((attendee) => (
          <div 
            key={attendee.id} 
            className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all hover:scale-[1.02] group relative overflow-hidden"
          >
            <div className="relative z-10 text-center space-y-4">
              <div className="w-16 h-16 bg-wrapped-lime/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform">
                <span className="text-3xl">🍽️</span>
              </div>
              
              <h3 className="text-2xl font-black uppercase tracking-tighter text-wrapped-lime">
                {attendee.name}
              </h3>
              
              <div className="bg-black/30 p-6 rounded-2xl border border-white/5 min-h-[100px] flex items-center justify-center">
                <p className="text-lg font-bold italic leading-tight text-white/90">
                  "{attendee.menuOrder}"
                </p>
              </div>

              <div className="text-[10px] uppercase tracking-[0.2em] font-black opacity-30 pt-4">
                 Order Logged: {new Date(attendee.updatedAt).toLocaleDateString()}
              </div>
            </div>

            {/* Decorative background element */}
            <div className="absolute -bottom-10 -right-10 text-9xl font-black text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
              ?
            </div>
          </div>
        ))}
      </div>

      {attendees.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
          <p className="text-2xl opacity-50 italic">No orders logged yet. Everyone's still deciding... 🤔</p>
          <Link href="/" className="inline-block mt-8 text-wrapped-primary font-black uppercase tracking-widest hover:underline">
            Go tell them to choose!
          </Link>
        </div>
      )}
    </div>
  );
}
