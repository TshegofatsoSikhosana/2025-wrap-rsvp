'use client';

import { useState, useRef } from 'react';
import WrappedSlide from '@/components/WrappedSlide';
import RsvpForm from '@/components/RsvpForm';
import AttendeesList from '@/components/AttendeesList';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartY = useRef(0);

  const slides = [
    {
      id: "intro",
      title: "It's That Time of Year",
      content: "Let's wrap up 2025 together!",
      bgColor: "bg-wrapped-bg",
      textColor: "text-wrapped-pink",
      doodle: <div className="doodle doodle-sunburst top-1/4 left-1/4" />
    },
    {
      id: "stat1",
      title: "You Spent...",
      content: "365 days working hard.",
      bgColor: "bg-wrapped-purple",
      textColor: "text-wrapped-yellow",
      doodle: (
        <>
          <div className="doodle doodle-blob top-10 right-10 delay-100" />
          <div className="doodle doodle-blob bottom-20 left-20 bg-wrapped-pink delay-700" />
        </>
      )
    },
    {
      id: "stat2",
      title: "Your Top Genre Was...",
      content: "Software Engineering & Chaos Management.",
      bgColor: "bg-wrapped-orange",
      textColor: "text-black",
      doodle: <div className="doodle doodle-zigzag top-1/2 left-0 rotate-12" />
    },
    {
      id: "invite",
      title: "You belong in...",
      content: "The night sky because you are a star!",
      bgColor: "bg-wrapped-lime",
      textColor: "text-black",
      doodle: (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {[...Array(20)].map((_, i) => (
             <div key={i} className="doodle doodle-confetti" style={{
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
               animationDelay: `${Math.random()}s`,
               backgroundColor: ['#d6006f', '#8e44ad', '#f1c40f'][Math.floor(Math.random() * 3)]
             }} />
           ))}
        </div>
      )
    },
    {
      id: "rsvp",
      title: "RSVP Now",
      content: "Don't miss the party.",
      bgColor: "bg-wrapped-bg",
      textColor: "text-white",
      isStatic: true,
      component: <RsvpForm />
    },
    {
      id: "attendees",
      title: "The Guest List",
      content: "Who's bringing the vibes?",
      bgColor: "bg-wrapped-purple",
      textColor: "text-wrapped-green",
      isStatic: true,
      component: <AttendeesList />
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
  };

  const handleWheel = (e) => {
     if (e.deltaY > 50) {
        nextSlide();
     } else if (e.deltaY < -50) {
        prevSlide();
     }
  }

  return (
    <main 
      className="h-screen w-full overflow-hidden relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      onClick={nextSlide}
    >
      {slides.map((slide, index) => (
        <div 
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out`}
          style={{ transform: `translateY(${(index - currentSlide) * 100}%)` }}
        >
          <WrappedSlide 
            title={slide.title} 
            content={slide.content}
            bgColor={slide.bgColor}
            textColor={slide.textColor}
            isStatic={slide.isStatic}
          >
            {slide.doodle}
            <div onClick={(e) => e.stopPropagation()}>
               {slide.component}
            </div>
          </WrappedSlide>
        </div>
      ))}

      {/* Progress Bars */}
      <div className="absolute top-4 left-0 w-full flex gap-2 px-4 z-50">
        {slides.map((_, index) => (
          <div key={index} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
             <div 
               className={`h-full bg-white transition-all duration-500 ${index <= currentSlide ? 'w-full' : 'w-0'}`}
             />
          </div>
        ))}
      </div>
      
      <div className="absolute bottom-8 left-0 w-full text-center text-white/50 text-sm animate-pulse z-40 pointer-events-none">
        Tap or Scroll were you born in a barn?
      </div>
    </main>
  );
}
