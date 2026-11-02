import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Eye, Zap, Compass, ArrowDown } from 'lucide-react';

export default function HeroScene() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const avatarRef = useRef(null);
  const ringsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Cinematic Entrance Timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        ringsRef.current,
        { scale: 0.4, opacity: 0, rotate: -60 },
        { scale: 1, opacity: 1, rotate: 0, duration: 2.2 }
      )
        .fromTo(
          avatarRef.current,
          { scale: 0.6, opacity: 0, y: 40 },
          { scale: 1, opacity: 1, y: 0, duration: 1.8 },
          '-=1.4'
        )
        .fromTo(
          titleRef.current,
          { opacity: 0, y: 30, letterSpacing: '2px' },
          { opacity: 1, y: 0, letterSpacing: '8px', duration: 1.6 },
          '-=1.0'
        )
        .fromTo(
          subtitleRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2 },
          '-=0.8'
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 overflow-hidden pt-16 pb-12 z-10"
    >
      {/* Background Atmosphere Glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[140px] pointer-events-none -top-20" />
      <div className="absolute w-[400px] h-[400px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none bottom-10" />

      {/* Center Giant Rinnegan Vortex behind character */}
      <div 
        ref={ringsRef}
        className="relative flex items-center justify-center w-[380px] h-[380px] md:w-[500px] md:h-[500px] mb-8"
      >
        {/* Animated Concentric SVG Rinnegan Rings */}
        <svg 
          viewBox="0 0 500 500" 
          className="absolute inset-0 w-full h-full animate-rinnegan pointer-events-none"
        >
          <defs>
            <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
              <stop offset="25%" stop-color="#c084fc" stop-opacity="0.7"/>
              <stop offset="65%" stop-color="#9333ea" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="#3b0764" stop-opacity="0"/>
            </radialGradient>
            <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d8b4fe"/>
              <stop offset="50%" stop-color="#9333ea"/>
              <stop offset="100%" stop-color="#06b6d4"/>
            </linearGradient>
          </defs>
          <circle cx="250" cy="250" r="220" fill="url(#eyeGlow)" />
          <circle cx="250" cy="250" r="210" fill="none" stroke="url(#ringStroke)" stroke-width="2.5" stroke-dasharray="14 10" opacity="0.4" />
          <circle cx="250" cy="250" r="170" fill="none" stroke="#c084fc" stroke-width="3" opacity="0.65" />
          <circle cx="250" cy="250" r="130" fill="none" stroke="#a855f7" stroke-width="3" opacity="0.8" />
          <circle cx="250" cy="250" r="90" fill="none" stroke="#e9d5ff" stroke-width="3.5" opacity="0.95" />
          <circle cx="250" cy="250" r="50" fill="none" stroke="#ffffff" stroke-width="3" />
        </svg>

        {/* Rotating Outer Tomoe Ring */}
        <div className="absolute inset-0 flex items-center justify-center animate-spin-slow pointer-events-none">
          <div className="w-[340px] h-[340px] rounded-full border border-purple-500/30 flex items-center justify-center relative">
            <span className="absolute top-0 text-white text-xs">▲</span>
            <span className="absolute bottom-0 text-white text-xs">▼</span>
            <span className="absolute left-0 text-white text-xs">◀</span>
            <span className="absolute right-0 text-white text-xs">▶</span>
          </div>
        </div>

        {/* Central Character Avatar */}
        <div 
          ref={avatarRef}
          className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full p-1.5 bg-gradient-to-tr from-purple-600 via-cyan-400 to-purple-800 shadow-[0_0_50px_rgba(168,85,247,0.8)]"
        >
          <img 
            src="./avatar.png" 
            alt="Sakthi Renganathan — Six Paths Shinobi" 
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.src = 'https://github.com/sakthirenganathan-dev.png';
            }}
          />
        </div>
      </div>

      {/* Shinobi Banner Category */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-xs tracking-widest uppercase mb-4 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
        <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
        <span>影 · SIX PATHS CHRONICLES · 忍</span>
      </div>

      {/* Main Title Reveal */}
      <h1 
        ref={titleRef}
        className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black text-center text-white uppercase text-glow-purple tracking-widest mb-3"
      >
        SAKTHI RENGANATHAN
      </h1>

      {/* Animated Subtitle */}
      <p 
        ref={subtitleRef}
        className="font-mono text-xs sm:text-sm md:text-base tracking-[0.25em] md:tracking-[0.4em] text-cyan-300 uppercase text-center font-bold mb-6 text-glow-cyan"
      >
        FULL-STACK DEVELOPER · AI BUILDER · SHINOBI
      </p>

      {/* Philosophy Statement */}
      <p className="max-w-2xl text-center text-slate-300 text-sm md:text-base leading-relaxed font-light mb-8 px-4">
        Channeling creative chakra into full-stack systems, autonomous AI agents, and immersive web experiences. 
        “A shinobi never gives up on the code they believe in.”
      </p>

      {/* Action Navigation Badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono tracking-wider">
        <a 
          href="#telemetry" 
          className="px-6 py-2.5 rounded-full bg-purple-900/40 border border-purple-500/60 hover:bg-purple-800/60 hover:border-cyan-400 text-slate-100 transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.3)] flex items-center gap-2"
        >
          <Compass className="w-4 h-4 text-cyan-400" />
          <span>EXPLORE REPERTOIRE</span>
        </a>
        <a 
          href="https://github.com/sakthirenganathan-dev" 
          target="_blank" 
          rel="noreferrer"
          className="px-6 py-2.5 rounded-full bg-cyan-950/40 border border-cyan-500/50 hover:bg-cyan-900/60 text-cyan-200 transition-all duration-300 flex items-center gap-2"
        >
          <Eye className="w-4 h-4 text-purple-400" />
          <span>GITHUB OVERVIEW</span>
        </a>
      </div>

      {/* Scroll Down Indicator */}
      <div className="mt-14 flex flex-col items-center gap-2 text-slate-400 text-xs font-mono animate-bounce">
        <span>SCROLL TO ENTER REALM</span>
        <ArrowDown className="w-4 h-4 text-purple-400" />
      </div>
    </section>
  );
}

