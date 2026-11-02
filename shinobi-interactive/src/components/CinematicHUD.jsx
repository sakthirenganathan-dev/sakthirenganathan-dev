import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Orbit, 
  Users, 
  Scroll, 
  Activity, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Github,
  Linkedin,
  Globe
} from 'lucide-react';

const STAGES = [
  { id: 'awakening', label: '01 // AWAKENING' },
  { id: 'tech', label: '02 // TECH ORBIT' },
  { id: 'characters', label: '03 // CHARACTER REALM' },
  { id: 'missions', label: '04 // S-RANK MISSIONS' },
  { id: 'telemetry', label: '05 // LIVE TELEMETRY' },
  { id: 'summoning', label: '06 // SUMMONING SEAL' },
];

export default function CinematicHUD({ stage, setStage }) {
  // Live GitHub state
  const [ghData, setGhData] = useState(null);
  const [loadingGh, setLoadingGh] = useState(false);

  useEffect(() => {
    if (stage === 4 && !ghData) {
      setLoadingGh(true);
      fetch('https://api.github.com/users/sakthirenganathan-dev')
        .then((res) => res.json())
        .then((data) => {
          setGhData(data);
          setLoadingGh(false);
        })
        .catch(() => {
          setLoadingGh(false);
        });
    }
  }, [stage, ghData]);

  const nextStage = () => setStage((prev) => (prev + 1) % STAGES.length);
  const prevStage = () => setStage((prev) => (prev - 1 + STAGES.length) % STAGES.length);

  return (
    <div className="relative z-10 min-h-screen w-full flex flex-col justify-between p-6 md:p-12 pointer-events-none select-none">
      {/* Top Floating Stage Continuum Bar */}
      <div className="w-full flex items-center justify-between border-b border-purple-900/30 pb-4 pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-cinzel text-lg font-black tracking-widest text-white">
            影 · SHINOBI UNIVERSE
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6 font-mono text-xs text-slate-400">
          {STAGES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setStage(idx)}
              className={`transition-all duration-300 ${
                stage === idx
                  ? 'text-cyan-300 font-bold scale-110 drop-shadow-[0_0_10px_#06b6d4]'
                  : 'hover:text-purple-300 opacity-60'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <span className="font-mono text-xs text-purple-300 tracking-wider">
          STAGE {stage + 1} / {STAGES.length}
        </span>
      </div>

      {/* Center Cinematic Stage Overlays (Pure Floating Typography - Zero Cards) */}
      <div className="my-auto max-w-4xl mx-auto w-full pointer-events-auto transition-all duration-500 text-center">
        {/* STAGE 0: AWAKENING */}
        {stage === 0 && (
          <div className="flex flex-col items-center animate-fade-in">
            <span className="font-mono text-xs tracking-[0.4em] text-purple-400 uppercase mb-3">
              ✦ · 六道 CHRONICLES · 忍 · ✦
            </span>
            <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-widest text-glow-purple mb-4">
              SAKTHI
            </h1>
            <p className="font-mono text-sm sm:text-lg tracking-[0.3em] text-cyan-300 font-bold mb-6 text-glow-cyan">
              FULL-STACK DEVELOPER · AI BUILDER · SHINOBI
            </p>
            <p className="max-w-xl text-slate-300 text-sm md:text-base font-light leading-relaxed mb-8">
              Welcome to the living chakra universe. A seamless 3D spatial developer experience 
              powered by Three.js, GSAP motion, and live GitHub intelligence.
            </p>
            <button
              onClick={nextStage}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-900 via-indigo-900 to-cyan-950 border border-purple-500 hover:border-cyan-400 text-white font-mono text-xs tracking-widest transition-all duration-300 shadow-[0_0_35px_rgba(168,85,247,0.5)]"
            >
              TRAVERSE REALM ➔
            </button>
          </div>
        )}

        {/* STAGE 1: LIVING TECH ORBIT */}
        {stage === 1 && (
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase mb-2">
              CELESTIAL CHAKRA ARSENAL
            </span>
            <h2 className="font-cinzel text-4xl sm:text-6xl font-black text-white uppercase tracking-wide text-glow-purple mb-6">
              PLANETARY TECH ORBIT
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl font-light mb-8 leading-relaxed">
              Planetary disciplines revolving in real-time 3D coordinate space around the central Rinnegan core.
            </p>
            <div className="flex flex-wrap justify-center gap-3 font-mono text-xs">
              {['React', 'JavaScript', 'Three.js', 'GSAP', 'Java', 'Flutter', 'AI Engineering', 'Git/GitHub', 'HTML5/CSS3'].map((t) => (
                <span key={t} className="px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-600/60 text-cyan-200">
                  ⚡ {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* STAGE 2: CHARACTER CONTINUUM */}
        {stage === 2 && (
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs tracking-widest text-purple-400 uppercase mb-2">
              THE FIVE GREAT NATIONS
            </span>
            <h2 className="font-cinzel text-4xl sm:text-6xl font-black text-white uppercase tracking-wide text-glow-purple mb-6">
              LEGENDARY CHAKRA RIVER
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-3xl">
              <div className="border-l-2 border-orange-500 pl-4">
                <span className="font-mono text-xs text-orange-400 font-bold">TEAM 7 &amp; MENTORS</span>
                <p className="text-sm font-bold text-white">Naruto · Sasuke · Sakura · Kakashi</p>
                <p className="text-xs text-slate-400 font-light">The Unbreakable Will of Fire</p>
              </div>
              <div className="border-l-2 border-purple-500 pl-4">
                <span className="font-mono text-xs text-purple-400 font-bold">UCHIHA CLAN</span>
                <p className="text-sm font-bold text-white">Madara · Itachi · Obito · Shisui</p>
                <p className="text-xs text-slate-400 font-light">Mangekyo &amp; Perfect Susanoo</p>
              </div>
              <div className="border-l-2 border-red-500 pl-4">
                <span className="font-mono text-xs text-red-400 font-bold">AKATSUKI ORDER</span>
                <p className="text-sm font-bold text-white">Pain · Konan · Kisame · Deidara</p>
                <p className="text-xs text-slate-400 font-light">Crimson Cloud Justice</p>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: S-RANK MISSIONS */}
        {stage === 3 && (
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase mb-2">
              AUTHENTIC CODE REPERTOIRE
            </span>
            <h2 className="font-cinzel text-4xl sm:text-6xl font-black text-white uppercase tracking-wide text-glow-purple mb-6">
              SECRET PROJECT SCROLLS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left max-w-3xl font-mono">
              <a href="https://github.com/sakthirenganathan-dev/VisionMate-AI" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-cyan-500/40 hover:border-cyan-400 transition-colors">
                <span className="text-[10px] text-cyan-400 font-bold">S-RANK // AI</span>
                <h4 className="text-sm font-bold text-white">VisionMate AI ↗</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">Computer-vision assistive platform.</p>
              </a>
              <a href="https://github.com/sakthirenganathan-dev/safeMedesAi" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-green-500/40 hover:border-green-400 transition-colors">
                <span className="text-[10px] text-green-400 font-bold">A-RANK // HEALTH</span>
                <h4 className="text-sm font-bold text-white">SafeMeds AI ↗</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">Drug safety &amp; interaction intelligence.</p>
              </a>
              <a href="https://github.com/sakthirenganathan-dev/isl-healthcare" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-orange-500/40 hover:border-orange-400 transition-colors">
                <span className="text-[10px] text-orange-400 font-bold">S-RANK // INCLUSION</span>
                <h4 className="text-sm font-bold text-white">ISL Healthcare ↗</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">Sign-language medical bridge.</p>
              </a>
              <a href="https://github.com/sakthirenganathan-dev/RYVEN" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-purple-500/40 hover:border-purple-400 transition-colors">
                <span className="text-[10px] text-purple-400 font-bold">S-RANK // AGENT</span>
                <h4 className="text-sm font-bold text-white">RYVEN ↗</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">Local privacy-first AI desktop engine.</p>
              </a>
              <a href="https://github.com/sakthirenganathan-dev/StudyGenAi" target="_blank" rel="noreferrer" className="p-4 rounded-xl border border-yellow-500/40 hover:border-yellow-400 transition-colors">
                <span className="text-[10px] text-yellow-400 font-bold">A-RANK // EDTECH</span>
                <h4 className="text-sm font-bold text-white">StudyGen AI ↗</h4>
                <p className="text-xs text-slate-400 mt-1 font-sans">Adaptive learning roadmap copilot.</p>
              </a>
            </div>
          </div>
        )}

        {/* STAGE 4: LIVE TELEMETRY */}
        {stage === 4 && (
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs tracking-widest text-green-400 uppercase mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              LIVE GITHUB REST API STREAM
            </span>
            <h2 className="font-cinzel text-4xl sm:text-6xl font-black text-white uppercase tracking-wide text-glow-purple mb-6">
              HOLOGRAPHIC TELEMETRY
            </h2>
            <div className="flex justify-center gap-8 font-mono mb-6">
              <div className="text-center">
                <span className="text-4xl sm:text-6xl font-black text-white block">
                  {loadingGh ? '...' : ghData?.public_repos ?? '26'}
                </span>
                <span className="text-xs text-purple-300">PUBLIC REPOSITORIES</span>
              </div>
              <div className="text-center border-l border-purple-900/50 pl-8">
                <span className="text-4xl sm:text-6xl font-black text-cyan-300 block">
                  {loadingGh ? '...' : ghData?.followers ?? '4'}
                </span>
                <span className="text-xs text-purple-300">SHINOBI FOLLOWERS</span>
              </div>
              <div className="text-center border-l border-purple-900/50 pl-8">
                <span className="text-4xl sm:text-6xl font-black text-green-400 block">
                  S-RANK
                </span>
                <span className="text-xs text-purple-300">VILLAGE CLEARANCE</span>
              </div>
            </div>
            <p className="font-mono text-xs text-slate-400">
              CHANNEL: @sakthirenganathan-dev // DIRECT CLIENT-SIDE REST FETCH
            </p>
          </div>
        )}

        {/* STAGE 5: SUMMONING SEAL */}
        {stage === 5 && (
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs tracking-widest text-yellow-400 uppercase mb-2">
              KUCHIYOSE NO JUTSU
            </span>
            <h2 className="font-cinzel text-4xl sm:text-6xl font-black text-white uppercase tracking-wide text-glow-purple mb-6">
              SUMMONING SEAL
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light mb-8 max-w-xl">
              “A shinobi never gives up on the code they believe in.”
            </p>
            <div className="flex items-center justify-center gap-6 font-mono text-xs">
              <a href="https://github.com/sakthirenganathan-dev" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-900/40 border border-purple-500 hover:border-cyan-400 text-white transition-all">
                <Github className="w-4 h-4 text-purple-300" />
                <span>GITHUB</span>
              </a>
              <a href="https://linkedin.com/in/sakthi-renganathan-k" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-900/40 border border-cyan-500 hover:border-white text-white transition-all">
                <Linkedin className="w-4 h-4 text-cyan-300" />
                <span>LINKEDIN</span>
              </a>
              <a href="https://sakthirenganathan.vercel.app" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-900/40 border border-pink-500 hover:border-white text-white transition-all">
                <Globe className="w-4 h-4 text-pink-300" />
                <span>PORTFOLIO</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Timeline Controls */}
      <div className="w-full flex items-center justify-between border-t border-purple-900/30 pt-4 pointer-events-auto">
        <button
          onClick={prevStage}
          className="flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREVIOUS REALM</span>
        </button>

        <div className="flex items-center gap-2">
          {STAGES.map((_, i) => (
            <div
              key={i}
              onClick={() => setStage(i)}
              className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                stage === i ? 'w-8 bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'w-2 bg-purple-900 hover:bg-purple-600'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextStage}
          className="flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <span>NEXT REALM</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

