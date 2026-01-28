'use client';

import React, { useState, useRef } from 'react';
import WrappedSlide from '@/components/WrappedSlide';
import RsvpForm from '@/components/RsvpForm';
import PlaylistView from '@/components/PlaylistView';
import MenuCarousel from '@/components/MenuCarousel';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartY = useRef(0);

  const slides = [
    {
      id: "intro",
      title: "The Grand Finale",
      content: "Tree of Life Community Karaoke Farewell 🎤",
      bgColor: "bg-wrapped-bg",
      textColor: "text-wrapped-white",
      doodle: (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="doodle doodle-star" style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 15 + 5}px`,
              height: `${Math.random() * 15 + 5}px`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
              opacity: Math.random() * 0.5 + 0.3
            }} />
          ))}
        </div>
      ),
      gif: '/wow-groot.gif'
    },
    {
      id: "stat1",
      title: "A Superstar Send-off",
      content: "Join the Tree of Life community for a Karaoke Farewell in true superstar style!",
      bgColor: "bg-wrapped-purple",
      textColor: "text-wrapped-yellow",
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
      ),
      gif: '/lil-yatchty.gif'
    },
    {
      id: "stat2",
      title: "Memories Into Melodies",
      content: "Whether it's Beyoncé-level confidence or a MJ moonwalk—the mic is yours! 🎶",
      bgColor: "bg-wrapped-lime",
      textColor: "text-black",
      doodle: (
        <>
          <div className="doodle doodle-blob top-0 right-0 delay-100" />
          <div className="doodle doodle-blob bottom-0 left-0 bg-white delay-700 h-100 w-100" />
        </>
      ),
      gif: '/girl-singing.gif'
    },
    {
      id: "invite",
      title: "The Lowdown",
      content: `${`
        <p>It’s time to sing our hearts out!</p>
        </br>
        <p><strong>📍 Location </strong> </p>
        <a target="_blank" style="font-style:italic;text-decoration: underline;color: blue" href="https://www.google.com/maps/search/?api=1&query=Beer+Park+Sandton+24+Central+6+Gwen+Lane+Sandown+Sandton+2196">
        Beer Park Sandton (24 Central, 6 Gwen Lane, Sandown, Sandton)
        </a>
        </br>
        </br>
        <p><strong>🕒 Showtime </strong> <p>Friday, 30 Jan 2026, 13:00 – 17:00</p></p>
        `}`,
      isStatic: true,
      bgColor: "bg-white",
      textColor: "text-black",     
      gif: '/party.gif'
    },
        {
      id: "questions",
      title: "Show Notes",
      content: `${`
        
        <ul>
        <li>
          🍽️ Dinner will be served, so come hungry and ready to celebrate!
        </li>
        <li>
          🥂 Dress code: Come as you are — bonus points for big energy and good vibes
        </li>
        <li>
          🎶 Choose a song that screams YOU and let’s make some memories!
        </li>
        <li>
          📞 Reach out to the team with any questions!
        </li>
        </ul>
        `}`,
      isStatic: true,
      bgColor: "bg-wrapped-orange",
      textColor: "text-black",     
      gif: '/ready-wwe.gif'
    },
    {
      id: "menu",
      title: "The Main Act",
      content: "A feast fit for a superstar! Check out what's on the menu 🍽️",
      bgColor: "bg-wrapped-purple",
      textColor: "text-white",
      isStatic: true,
      component: <MenuCarousel />,
      gif: ''
    },
    {
      id: "rsvp",
      title: "Join the Setlist",
      content: "Don't miss the party.",
      bgColor: "bg-wrapped-bg",
      textColor: "text-white",
      isStatic: true,
      component: <RsvpForm />
    },
    {
      id: "playlist",
      title: "",
      content: "The tracks that will set the stage 🎵",
      bgColor: "bg-wrapped-blue",
      textColor: "text-wrapped-green",
      isStatic: true,
      component: <PlaylistView showScoreboard={false} />,
      gif: '/doof.gif'
    },
     {
      id: "last",
      title: "",
      content: "",
      bgColor: "bg-wrapped-bg",
      textColor: "text-wrapped-green",
      isStatic: true,
      component: <></>,
      gif: '/entertained.gif'
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
            gif={slide.gif}
          >
            {slide.doodle}
            <div onClick={(e) => e.stopPropagation()}>
               {slide.component && React.cloneElement(slide.component, { onNext: nextSlide, onPrev: prevSlide })}
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
