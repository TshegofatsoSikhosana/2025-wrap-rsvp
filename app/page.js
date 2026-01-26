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
      title: "The Grand Finale",
      content: "Tree of Life Karaoke Farewell Party 🎤",
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
      title: "Tree of Life Community...",
      content: "We've built something beautiful, but it's time for one last song.",
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
      gif: '/nod.gif'
    },
    {
      id: "stat2",
      title: "One Last Encore...",
      content: "Grab the mic and let's celebrate the journey together!",
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
      title: "The Playbill",
      content: `${`
        <p>It's time for the final performance!</p>
        </br>
        <p><strong>Stage Location </strong> </p>
        <a target="_blank" style="font-style:italic;text-decoration: underline;color: blue" href="https://www.google.com/maps/place/Beer+Park+Sandton/@-26.1022864,28.0470854,3784m/data=!3m2!1e3!4b1!4m6!3m5!1s0x1e957396aac80cdf:0xa7828f6fe172b80b!8m2!3d-26.102306!4d28.0573851!16s%2Fg%2F11y5tlw7zh?entry=ttu&g_ep=EgoyMDI2MDEyMS4wIKXMDSoKLDEwMDc5MjA3MUgBUAM%3D">
        Beer Park Sandton
        </a>
        </br>
        </br>
        <p><strong>Showtime </strong> <p>30 Jan 2026, 13:00 - 17:00</p></p>
        </br>
        </br>
        `}`,
      bgColor: "bg-white",
      textColor: "text-black",     
      gif: '/mj.gif'
    },
        {
      id: "questions",
      title: "Show Notes",
      content: `${`
        <ul>
        <li>
          Dress to impress (or just your best karaoke outfit!)
        </li>
        <li>
          Bring your own beverages (BYOB) to lubricate those vocal cords 🥳 
        </li>
        <li>
          Plenty of parking for the crew
        </li>
        <li>
          Keep the vibes high and the noise respectful for the neighbors
        </li>
        <li>
          Reach out to the <a target="_blank" style="font-style:italic;text-decoration: underline;color: blue" href="mailto:ts98sikhosana@gmail.com">Director</a> with any questions
        </li>
        </ul>
        `}`,
      bgColor: "bg-wrapped-orange",
      textColor: "text-black",     
      gif: '/braai.gif'
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
      id: "attendees",
      title: "The Headliners",
      content: "See who's taking the main stage!",
      bgColor: "bg-wrapped-blue",
      textColor: "text-wrapped-green",
      component: <AttendeesList />,
      gif: '/dance_bob.gif'
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
