'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';

const MenuCarousel = ({ onNext }) => {
  const { userName, setUserName, menuOrder, setMenuOrder } = useAppContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menuItems = [
    { id: 1, image: '/menu/page-2.png' },
    { id: 2, image: '/menu/page-3.png' },
    { id: 3, image: '/menu/page-1.png' },
    { id: 4, image: '/menu/page-4.png' },
  ];

  const nextMenuSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % menuItems.length);
  };

  const prevMenuSlide = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + menuItems.length) % menuItems.length);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-6 mt-4">
      {/* Interaction Card */}
      <div className="w-full bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl space-y-6">
        <div className="space-y-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-4 bg-wrapped-primary text-black font-black uppercase tracking-tighter rounded-2xl hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
          >
            <span>View Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-70">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Who's ordering?"
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-wrapped-primary transition-colors placeholder:text-white/20"
            />
          </div>
          <div>
            <label className="block text-xs font-black uppercase tracking-widest mb-2 opacity-70">Your Order</label>
            <input
              type="text"
              value={menuOrder}
              onChange={(e) => setMenuOrder(e.target.value)}
              placeholder="What are you craving?"
              className="w-full bg-white/5 border border-white/10 p-3 rounded-xl focus:outline-none focus:border-wrapped-primary transition-colors placeholder:text-white/20"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="group flex items-center gap-2 text-white font-bold opacity-70 hover:opacity-100 transition-opacity"
      >
        <span>Next Steps</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in zoom-in duration-300"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white/5 rounded-3xl overflow-hidden border border-white/10 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full relative flex items-center justify-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-black uppercase tracking-widest text-white">Menu</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white backdrop-blur-md transition-colors border border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            {/* Carousel Container */}
            <div className="relative aspect-[3/4] w-full max-h-[70vh] flex items-center justify-center overflow-hidden">
              {menuItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`absolute inset-0 transition-transform duration-500 ease-in-out flex items-center justify-center ${
                    index === currentIndex ? 'translate-x-0' : index < currentIndex ? '-translate-x-full' : 'translate-x-full'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={`Menu Page ${item.id}`}
                    className="max-w-full max-h-full object-contain shadow-2xl"
                  />
                </div>
              ))}
            </div>

            {/* Controls at the Bottom */}
            <div className="w-full flex items-center justify-between p-6 bg-black/20">
              <button
                onClick={prevMenuSlide}
                className="bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md transition-all text-white border border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </button>

              {/* Indicators */}
              <div className="flex gap-2">
                {menuItems.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentIndex ? 'w-8 bg-wrapped-primary' : 'w-2 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextMenuSlide}
                className="bg-white/10 hover:bg-white/20 p-4 rounded-full backdrop-blur-md transition-all text-white border border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
            
            <div className="pb-8 px-6 text-center">
               <p className="text-white/60 text-sm font-medium italic">Click outside the images to close</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuCarousel;
