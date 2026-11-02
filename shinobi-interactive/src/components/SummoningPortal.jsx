import React, { useState } from 'react';
import { Zap, Github, Linkedin, Globe, CheckCircle2 } from 'lucide-react';

export default function SummoningPortal() {
  const [isSummoned, setIsSummoned] = useState(false);

  const handleSummon = () => {
    setIsSummoned(true);
  };

  return (
    <section className="relative py-28 px-4 max-w-5xl mx-auto z-10 text-center">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-xs tracking-widest uppercase mb-3">
          <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
          <span>KUCHIYOSE NO JUTSU · 口寄せの術</span>
        </div>
        <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white uppercase tracking-wider text-glow-purple">
          SUMMONING PORTAL
        </h2>
        <p className="font-mono text-xs text-slate-400 tracking-widest mt-2">
          {isSummoned
            ? 'ALLIANCE SEAL ACTIVATED — SUMMONING CHANNELS READY'
            : 'CLICK THE SUMMONING SEAL BELOW TO INITIATE ALLIANCE'}
        </p>
      </div>

      {/* Interactive Rotating Summoning Seal Array */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 mx-auto mb-12 flex items-center justify-center">
        {/* Outer Rotating Runes */}
        <div className={`absolute inset-0 rounded-full border-2 border-purple-500/50 border-dashed ${isSummoned ? 'animate-spin-slow' : ''}`} />
        <div className={`absolute inset-4 rounded-full border border-cyan-500/40 ${isSummoned ? 'animate-spin-reverse' : ''}`} />

        {/* Central Blood Seal / Button */}
        <button
          onClick={handleSummon}
          className={`relative z-20 w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center transition-all duration-500 border-2 ${
            isSummoned
              ? 'bg-purple-900/90 border-cyan-400 shadow-[0_0_60px_rgba(6,182,212,0.8)] scale-105'
              : 'bg-black/90 border-purple-600 hover:border-purple-400 hover:scale-105 shadow-[0_0_35px_rgba(168,85,247,0.5)]'
          }`}
        >
          <span className="font-cinzel text-2xl md:text-3xl font-black text-purple-200">
            {isSummoned ? '契約' : '召喚'}
          </span>
          <span className="font-mono text-[10px] md:text-xs text-cyan-300 font-bold uppercase mt-1 tracking-widest">
            {isSummoned ? 'SEAL ACTIVE' : 'PRESS TO SUMMON'}
          </span>
        </button>
      </div>

      {/* Alliance Channels (Revealed or highlighted on Summon) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <a
          href="https://github.com/sakthirenganathan-dev"
          target="_blank"
          rel="noreferrer"
          className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black/80 border border-purple-800/50 hover:border-purple-400 transition-all duration-300 flex flex-col items-center group shadow-[0_0_20px_rgba(147,51,234,0.15)]"
        >
          <Github className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-sm font-bold text-white mb-1">GITHUB PORTAL</span>
          <span className="font-mono text-xs text-purple-300">@sakthirenganathan-dev ↗</span>
        </a>

        <a
          href="https://linkedin.com/in/sakthi-renganathan-k"
          target="_blank"
          rel="noreferrer"
          className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black/80 border border-purple-800/50 hover:border-cyan-400 transition-all duration-300 flex flex-col items-center group shadow-[0_0_20px_rgba(6,182,212,0.15)]"
        >
          <Linkedin className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-sm font-bold text-white mb-1">LINKEDIN NETWORK</span>
          <span className="font-mono text-xs text-cyan-300">sakthi-renganathan-k ↗</span>
        </a>

        <a
          href="https://sakthirenganathan.vercel.app"
          target="_blank"
          rel="noreferrer"
          className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black/80 border border-purple-800/50 hover:border-pink-400 transition-all duration-300 flex flex-col items-center group shadow-[0_0_20px_rgba(244,63,94,0.15)]"
        >
          <Globe className="w-8 h-8 text-pink-400 mb-3 group-hover:scale-110 transition-transform" />
          <span className="font-mono text-sm font-bold text-white mb-1">LIVE PORTFOLIO</span>
          <span className="font-mono text-xs text-pink-300">sakthirenganathan.vercel.app ↗</span>
        </a>
      </div>

      <div className="mt-16 text-center text-xs font-mono text-slate-500">
        “A shinobi never gives up on the code they believe in.” · SAKTHI RENGANATHAN
      </div>
    </section>
  );
}

