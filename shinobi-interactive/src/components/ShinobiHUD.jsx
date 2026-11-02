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
  Globe,
  RefreshCw,
  Eye
} from 'lucide-react';

const REALMS = [
  { id: 'awakening', name: '01 // AWAKENING', title: 'THE SIX PATHS RINNEGAN', desc: 'Central Rinnegan vortex and avatar identity' },
  { id: 'tech', name: '02 // TECH ORBIT', title: 'PLANETARY JUTSU ARSENAL', desc: 'React, Three.js, GSAP, Java, Flutter, AI, Git' },
  { id: 'characters', name: '03 // CHARACTERS', title: 'FIVE NATIONS CONTINUUM', desc: 'Team 7, Uchiha, Akatsuki, Hokage, Allied Forces' },
  { id: 'missions', name: '04 // MISSIONS', title: 'S-RANK SECRET SCROLLS', desc: 'VisionMate, SafeMeds, ISL, RYVEN, StudyGen' },
  { id: 'telemetry', name: '05 // TELEMETRY', title: 'LIVE GITHUB INTELLIGENCE', desc: 'Authentic real-time API query & classification' },
  { id: 'summoning', name: '06 // SUMMONING', title: 'KUCHIYOSE NO JUTSU', desc: 'Interactive alliance summoning seal array' },
];

export default function ShinobiHUD({ 
  currentStage, 
  setStage, 
  hoveredNode, 
  selectedProject, 
  setSelectedProject,
  shockwaveActive
}) {
  const [ghData, setGhData] = useState(null);
  const [loadingGh, setLoadingGh] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  const fetchLiveGitHub = () => {
    setLoadingGh(true);
    fetch('https://api.github.com/users/sakthirenganathan-dev')
      .then((res) => res.json())
      .then((data) => {
        setGhData(data);
        setLastSync(new Date().toLocaleTimeString());
        setLoadingGh(false);
      })
      .catch((err) => {
        console.warn('API notice:', err);
        setLoadingGh(false);
      });
  };

  useEffect(() => {
    if (currentStage === 4 && !ghData) {
      fetchLiveGitHub();
    }
  }, [currentStage, ghData]);

  const currentRealm = REALMS[currentStage];

  return (
    <div className="fixed inset-0 z-10 w-full h-full flex flex-col justify-between p-6 md:p-10 pointer-events-none select-none">
      {/* ==================== TOP NAVIGATION TELEMETRY BAR ==================== */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-cinzel text-base md:text-lg font-black tracking-widest text-white">
            影 · SHINOBI WORLD
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-purple-950/70 border border-purple-600/50 text-[10px] font-mono text-purple-300">
            S-RANK CLASSIFICATION
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-5 font-mono text-xs text-slate-400">
          {REALMS.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => setStage(idx)}
              className={`transition-all duration-300 ${
                currentStage === idx
                  ? 'text-cyan-300 font-bold scale-110 drop-shadow-[0_0_10px_#06b6d4]'
                  : 'hover:text-purple-300 opacity-60'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-cyan-400 font-bold">{currentRealm.name}</span>
          <span className="text-slate-500">|</span>
          <span className="text-purple-300">{currentStage + 1} / {REALMS.length}</span>
        </div>
      </div>

      {/* ==================== CENTER HOVER INSPECTOR / STAGE HUD ==================== */}
      <div className="my-auto max-w-4xl mx-auto w-full text-center pointer-events-auto transition-all duration-500">
        
        {/* Hover Inspector for 3D Objects */}
        {hoveredNode && (
          <div className="mb-8 inline-block p-4 px-6 rounded-2xl bg-black/85 border border-cyan-400/80 backdrop-blur-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-fade-in">
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest block mb-1">
              3D SPATIAL TELEMETRY LOCK // {hoveredNode.type.toUpperCase()}
            </span>
            <h4 className="text-xl font-black text-white">
              {hoveredNode.name || hoveredNode.title}
            </h4>
            <p className="font-mono text-xs text-purple-300 mt-1">
              {hoveredNode.category || hoveredNode.rank || hoveredNode.roster}
            </p>
            {hoverNodeActionText(hoveredNode)}
          </div>
        )}

        {/* STAGE 0: THE AWAKENING */}
        {currentStage === 0 && !hoveredNode && (
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs tracking-[0.4em] text-purple-400 uppercase mb-2">
              ✦ · 六道 CHRONICLES · 忍 · ✦
            </span>
            <h1 className="font-cinzel text-5xl sm:text-7xl md:text-8xl font-black text-white uppercase tracking-widest text-glow-purple mb-3">
              SAKTHI
            </h1>
            <p className="font-mono text-xs sm:text-sm md:text-base tracking-[0.3em] text-cyan-300 font-bold mb-6 text-glow-cyan">
              FULL-STACK DEVELOPER · AI BUILDER · SHINOBI
            </p>
            <p className="max-w-xl text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-6">
              Welcome to the living 3D Shinobi universe. Move your mouse to warp the camera. 
              Scroll or use the timeline below to glide through the 6 realms.
            </p>
          </div>
        )}

        {/* STAGE 4: LIVE GITHUB INTELLIGENCE */}
        {currentStage === 4 && (
          <div className="flex flex-col items-center p-6 rounded-3xl bg-black/75 border border-purple-800/60 backdrop-blur-xl max-w-2xl mx-auto shadow-[0_0_40px_rgba(147,51,234,0.3)]">
            <div className="flex items-center justify-between w-full border-b border-purple-900/50 pb-3 mb-6">
              <span className="font-mono text-xs text-green-400 flex items-center gap-1.5 font-bold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                LIVE GITHUB REST API STREAM
              </span>
              <button
                onClick={fetchLiveGitHub}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-mono"
              >
                <RefreshCw className={`w-3 h-3 ${loadingGh ? 'animate-spin text-cyan-400' : ''}`} />
                <span>REFRESH</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 w-full text-center font-mono mb-4">
              <div>
                <span className="text-3xl sm:text-5xl font-black text-white block">
                  {loadingGh ? '...' : ghData?.public_repos ?? '26'}
                </span>
                <span className="text-[10px] text-purple-300 uppercase">Public Repos</span>
              </div>
              <div>
                <span className="text-3xl sm:text-5xl font-black text-cyan-300 block">
                  {loadingGh ? '...' : ghData?.followers ?? '4'}
                </span>
                <span className="text-[10px] text-purple-300 uppercase">Followers</span>
              </div>
              <div>
                <span className="text-3xl sm:text-5xl font-black text-green-400 block">
                  S-RANK
                </span>
                <span className="text-[10px] text-purple-300 uppercase">Clearance</span>
              </div>
            </div>

            <span className="text-[10px] font-mono text-slate-400">
              TARGET: @sakthirenganathan-dev {lastSync && `· Synced at ${lastSync}`}
            </span>
          </div>
        )}

        {/* STAGE 5: SUMMONING SEAL ALLIANCE */}
        {currentStage === 5 && (
          <div className="flex flex-col items-center">
            <span className="font-mono text-xs tracking-widest text-yellow-400 uppercase mb-2">
              KUCHIYOSE NO JUTSU
            </span>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-black text-white uppercase tracking-wide text-glow-purple mb-4">
              SUMMONING SEAL
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-light mb-8 max-w-md">
              “A shinobi never gives up on the code they believe in.”
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 font-mono text-xs">
              <a
                href="https://github.com/sakthirenganathan-dev"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-900/50 border border-purple-500 hover:border-cyan-400 text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <Github className="w-4 h-4 text-purple-300" />
                <span>GITHUB ↗</span>
              </a>
              <a
                href="https://linkedin.com/in/sakthi-renganathan-k"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-900/50 border border-cyan-500 hover:border-white text-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                <Linkedin className="w-4 h-4 text-cyan-300" />
                <span>LINKEDIN ↗</span>
              </a>
              <a
                href="https://sakthirenganathan.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-900/50 border border-pink-500 hover:border-white text-white transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)]"
              >
                <Globe className="w-4 h-4 text-pink-300" />
                <span>PORTFOLIO ↗</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* ==================== BOTTOM REALM NAVIGATION TIMELINE ==================== */}
      <div className="w-full flex items-center justify-between border-t border-purple-900/30 pt-4 pointer-events-auto">
        <button
          onClick={() => setStage((prev) => (prev > 0 ? prev - 1 : REALMS.length - 1))}
          className="flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">PREVIOUS REALM</span>
        </button>

        {/* Realm Step Pills */}
        <div className="flex items-center gap-2">
          {REALMS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => setStage(i)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                currentStage === i
                  ? 'w-10 bg-cyan-400 shadow-[0_0_12px_#06b6d4]'
                  : 'w-2 bg-purple-950 border border-purple-800 hover:bg-purple-600'
              }`}
              title={r.title}
            />
          ))}
        </div>

        <button
          onClick={() => setStage((prev) => (prev < REALMS.length - 1 ? prev + 1 : 0))}
          className="flex items-center gap-1.5 font-mono text-xs text-slate-400 hover:text-cyan-300 transition-colors"
        >
          <span className="hidden sm:inline">NEXT REALM</span>
          <ChevronRight className="w-4 h-4 text-cyan-400" />
        </button>
      </div>
    </div>
  );
}

function hoverNodeActionText(node) {
  if (node.type === 'project') {
    return (
      <span className="text-[10px] font-mono text-cyan-400 block mt-2">
        CLICK IN 3D SPACE TO OPEN REPOSITORY ↗
      </span>
    );
  }
  if (node.type === 'summoning') {
    return (
      <span className="text-[10px] font-mono text-yellow-400 block mt-2">
        CLICK TO STAMP KUCHIYOSE SUMMONING SEAL
      </span>
    );
  }
  return null;
}

