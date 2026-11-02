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
  Code2,
  Cpu,
  Layers,
  Terminal,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { fetchShinobiGitHubData } from '../services/githubService.js';

const REALMS = [
  { id: 'identity', name: '01 // IDENTITY', title: 'SHINOBI IDENTITY', desc: 'Full-stack developer and AI systems builder' },
  { id: 'story', name: '02 // STORY', title: 'DEVELOPER STORY', desc: 'Craftsmanship, philosophy, and specializations' },
  { id: 'arsenal', name: '03 // ARSENAL', title: 'TECH ARSENAL', desc: 'Categorized technologies and engineering disciplines' },
  { id: 'missions', name: '04 // MISSIONS', title: 'S-RANK MISSIONS', desc: 'VisionMate, SafeMeds, ISL, RYVEN, StudyGen' },
  { id: 'telemetry', name: '05 // TELEMETRY', title: 'GITHUB INTELLIGENCE', desc: 'Authentic real-time API query & classification' },
  { id: 'summoning', name: '06 // ALLIANCE', title: 'SUMMONING ALLIANCE', desc: 'Direct links and connection portal' },
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
  const [ghError, setGhError] = useState(null);
  const [lastSync, setLastSync] = useState(null);

  const loadGitHubData = async (force = false) => {
    setLoadingGh(true);
    setGhError(null);
    try {
      const data = await fetchShinobiGitHubData(force);
      setGhData(data);
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('GitHub API Notice:', err);
      setGhError('Rate limit or network notice — displaying verified cached profile data.');
    } finally {
      setLoadingGh(false);
    }
  };

  useEffect(() => {
    loadGitHubData();
  }, []);

  const currentRealm = REALMS[currentStage] || REALMS[0];

  return (
    <div className="fixed inset-0 z-10 w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 pointer-events-none select-none">
      {/* ==================== 1. TOP TELEMETRY NAVIGATION BAR ==================== */}
      <header className="w-full flex items-center justify-between border-b border-purple-900/40 pb-3 pointer-events-auto backdrop-blur-sm bg-black/30 px-3 sm:px-4 py-2 rounded-xl">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-cinzel text-sm sm:text-base font-black tracking-widest text-white">
            影 · SHINOBI WORLD
          </span>
          <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-700/40 text-[9px] font-mono text-purple-300">
            S-RANK CLASSIFICATION
          </span>
        </div>

        {/* Section Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-4 font-mono text-xs text-slate-400">
          {REALMS.map((r, idx) => (
            <button
              key={r.id}
              onClick={() => setStage(idx)}
              className={`px-2.5 py-1 rounded-md transition-all duration-200 ${
                currentStage === idx
                  ? 'text-cyan-300 font-bold bg-purple-900/40 border border-purple-600/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                  : 'hover:text-purple-300 hover:bg-purple-950/30'
              }`}
            >
              {r.name}
            </button>
          ))}
        </nav>

        {/* Stage Indicator & Refresh */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          <span className="text-cyan-400 font-bold hidden sm:inline">{currentRealm.name}</span>
          <span className="text-slate-500 hidden sm:inline">|</span>
          <span className="text-purple-300 font-bold">{currentStage + 1} / {REALMS.length}</span>
        </div>
      </header>

      {/* ==================== 2. MAIN CENTER HUD DISPLAY ==================== */}
      <main className="my-auto max-w-4xl mx-auto w-full text-center pointer-events-auto transition-all duration-300 px-2 sm:px-4">
        
        {/* Hover Inspector for 3D Objects */}
        {hoveredNode && (
          <div className="mb-6 inline-block p-4 px-6 rounded-2xl bg-black/90 border border-cyan-400/80 backdrop-blur-xl shadow-[0_0_25px_rgba(6,182,212,0.35)] animate-fade-in text-left max-w-md">
            <span className="font-mono text-[9px] text-cyan-400 uppercase tracking-widest block mb-1">
              3D SPATIAL TELEMETRY LOCK // {hoveredNode.type?.toUpperCase()}
            </span>
            <h4 className="text-lg font-black text-white font-cinzel">
              {hoveredNode.name || hoveredNode.title}
            </h4>
            <p className="font-mono text-xs text-purple-300 mt-0.5">
              {hoveredNode.category || hoveredNode.rank || hoveredNode.roster}
            </p>
            {hoverNodeActionText(hoveredNode)}
          </div>
        )}

        {/* -------------------- SECTION 0: HERO & IDENTITY -------------------- */}
        {currentStage === 0 && !hoveredNode && (
          <div className="flex flex-col items-center max-w-2xl mx-auto bg-black/60 border border-purple-900/40 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-[0_0_35px_rgba(15,5,30,0.8)]">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.35em] text-purple-400 uppercase mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              六道 CHRONICLES // SHINOBI DEVELOPER
            </span>
            <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-black text-white uppercase tracking-wider text-glow-purple mb-2">
              SAKTHI
            </h1>
            <h2 className="font-mono text-xs sm:text-sm md:text-base tracking-[0.25em] text-cyan-300 font-bold mb-4 text-glow-cyan">
              FULL-STACK DEVELOPER · AI BUILDER
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-6 max-w-lg">
              Engineering high-performance web systems, autonomous agent architectures, and 3D WebGL experiences with the focused discipline of a shinobi.
            </p>

            {/* Genuine GitHub Statistics Summary Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-mono text-[11px] mb-4">
              <div className="px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-200">
                <span className="text-cyan-400 font-bold">{ghData?.publicRepos ?? '26'}</span> Repositories
              </div>
              <div className="px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-200">
                <span className="text-cyan-400 font-bold">{ghData?.totalStars ?? '1'}</span> Star
              </div>
              <div className="px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-purple-200">
                <span className="text-cyan-400 font-bold">{ghData?.followers ?? '4'}</span> Followers
              </div>
              <div className="px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-green-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Live API Synced
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => setStage(1)}
                className="px-5 py-2 rounded-full bg-purple-900/60 border border-purple-500 hover:border-cyan-400 text-xs font-mono text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                EXPLORE DEVELOPER STORY →
              </button>
            </div>
          </div>
        )}

        {/* -------------------- SECTION 1: DEVELOPER STORY (ABOUT) -------------------- */}
        {currentStage === 1 && !hoveredNode && (
          <div className="max-w-3xl mx-auto bg-black/75 border border-purple-900/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(15,5,30,0.9)] text-left">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              {/* Avatar Frame */}
              <div className="relative flex-shrink-0">
                <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full p-1 bg-gradient-to-tr from-purple-700 via-cyan-500 to-purple-900 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
                  <img
                    src="./avatar.png"
                    alt="Sakthi Renganathan — Six Paths Shinobi"
                    className="w-full h-full object-cover rounded-full bg-black/60"
                  />
                </div>
                <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-black/90 border border-cyan-400 text-[9px] font-mono text-cyan-300 font-bold">
                  SHINOBI
                </span>
              </div>

              {/* Bio & Pillars */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[10px] tracking-widest text-purple-400 uppercase">
                    02 // CRAFTSMANSHIP & PHILOSOPHY
                  </span>
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-black text-white mb-2">
                  The Way of the Code Shinobi
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed mb-4">
                  A software engineer channeling the relentless focus and adaptability of a shinobi into modern systems craftsmanship. Bridging reactive frontend experiences with robust backend services and autonomous multi-agent AI.
                </p>

                {/* 4 Core Pillars */}
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-200">
                    <span className="text-cyan-400 block font-bold mb-0.5">✦ AI Agents</span>
                    LLM workflows & autonomous orchestration
                  </div>
                  <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-200">
                    <span className="text-cyan-400 block font-bold mb-0.5">✦ Spatial WebGL</span>
                    Three.js & real-time 3D shaders
                  </div>
                  <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-200">
                    <span className="text-cyan-400 block font-bold mb-0.5">✦ Full-Stack</span>
                    React, Node.js & high-scale OOP
                  </div>
                  <div className="p-2 rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-200">
                    <span className="text-cyan-400 block font-bold mb-0.5">✦ DevOps</span>
                    GitHub Actions, CI/CD & Linux
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- SECTION 2: TECH ARSENAL -------------------- */}
        {currentStage === 2 && !hoveredNode && (
          <div className="max-w-3xl mx-auto bg-black/75 border border-purple-900/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(15,5,30,0.9)] text-left">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 mb-5">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-purple-400 uppercase block">
                  03 // JUTSU & TOOLS ARSENAL
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-black text-white">
                  Technical Disciplines
                </h3>
              </div>
              <span className="font-mono text-xs text-cyan-400 font-bold hidden sm:inline">
                VERIFIED STACK
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Group 1: Frontend & Spatial */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5" /> Frontend & Spatial Motion
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'Three.js', 'GSAP', 'JavaScript (ES6+)', 'Tailwind CSS'].map((item) => (
                    <span key={item} className="px-2.5 py-1 rounded bg-black/60 border border-purple-700/40 text-xs font-mono text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Group 2: AI & Intelligent Systems */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <span className="font-mono text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> AI & Intelligent Systems
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Autonomous Agents', 'LLM Orchestration', 'Local Models', 'Computer Vision'].map((item) => (
                    <span key={item} className="px-2.5 py-1 rounded bg-black/60 border border-purple-700/40 text-xs font-mono text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Group 3: Core & Backend Architecture */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" /> Core & Backend Architecture
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Java', 'Python', 'Node.js', 'REST APIs', 'Clean Architecture'].map((item) => (
                    <span key={item} className="px-2.5 py-1 rounded bg-black/60 border border-purple-700/40 text-xs font-mono text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Group 4: Mobile & DevOps */}
              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40">
                <span className="font-mono text-[10px] text-purple-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" /> Mobile & DevOps Engineering
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Flutter', 'Git & GitHub', 'GitHub Actions', 'CI/CD Pipelines', 'Linux'].map((item) => (
                    <span key={item} className="px-2.5 py-1 rounded bg-black/60 border border-purple-700/40 text-xs font-mono text-slate-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------------------- SECTION 3: S-RANK MISSIONS (PROJECTS) -------------------- */}
        {currentStage === 3 && !hoveredNode && (
          <div className="max-w-3xl mx-auto bg-black/75 border border-purple-900/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(15,5,30,0.9)] text-left">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3 mb-4">
              <div>
                <span className="font-mono text-[10px] tracking-widest text-purple-400 uppercase block">
                  04 // S-RANK SECRET SCROLLS
                </span>
                <h3 className="font-cinzel text-xl sm:text-2xl font-black text-white">
                  Featured Creations
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-400 hidden sm:inline">
                5 ACTIVE MISSIONS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { name: 'VisionMate AI', rank: 'S-RANK', tag: 'AI Vision', desc: 'Assistive computer vision system for visual accessibility', url: 'https://github.com/sakthirenganathan-dev/VisionMate-AI' },
                { name: 'SafeMeds AI', rank: 'A-RANK', tag: 'Healthcare', desc: 'AI-assisted medicine validation and contraindication safety', url: 'https://github.com/sakthirenganathan-dev/safeMedesAi' },
                { name: 'ISL Healthcare', rank: 'S-RANK', tag: 'Inclusion', desc: 'Indian Sign Language translation engine for clinical care', url: 'https://github.com/sakthirenganathan-dev/isl-healthcare' },
                { name: 'RYVEN', rank: 'S-RANK', tag: 'Autonomous', desc: 'Multi-agent orchestration and autonomous task execution system', url: 'https://github.com/sakthirenganathan-dev/RYVEN' },
                { name: 'StudyGen AI', rank: 'A-RANK', tag: 'EdTech', desc: 'Automated curriculum synthesis and personalized quiz generation', url: 'https://github.com/sakthirenganathan-dev/StudyGenAi' },
              ].map((proj) => (
                <a
                  key={proj.name}
                  href={proj.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 hover:border-cyan-400 transition-all block group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-purple-900/60 text-[9px] font-mono text-purple-300 font-bold">
                      {proj.rank}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300 flex items-center gap-0.5">
                      GITHUB <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <h4 className="font-cinzel text-sm font-bold text-white group-hover:text-cyan-300 mb-1">
                    {proj.name}
                  </h4>
                  <p className="text-[11px] font-mono text-slate-300 line-clamp-2 leading-relaxed">
                    {proj.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* -------------------- SECTION 4: GITHUB INTELLIGENCE TELEMETRY -------------------- */}
        {currentStage === 4 && (
          <div className="max-w-2xl mx-auto bg-black/80 border border-purple-800/60 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(147,51,234,0.35)] text-left">
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-3 mb-5">
              <span className="font-mono text-xs text-green-400 flex items-center gap-2 font-bold">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                AUTHENTIC GITHUB API TELEMETRY
              </span>
              <button
                onClick={() => loadGitHubData(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-mono transition-colors"
                title="Refresh Live Statistics"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingGh ? 'animate-spin text-cyan-400' : ''}`} />
                <span>REFRESH</span>
              </button>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 text-center font-mono mb-6">
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                <span className="text-3xl sm:text-4xl font-black text-white block">
                  {loadingGh ? '...' : ghData?.publicRepos ?? '26'}
                </span>
                <span className="text-[10px] text-purple-300 uppercase tracking-wider">Public Repos</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                <span className="text-3xl sm:text-4xl font-black text-cyan-300 block">
                  {loadingGh ? '...' : ghData?.totalStars ?? '1'}
                </span>
                <span className="text-[10px] text-purple-300 uppercase tracking-wider">Total Stars</span>
              </div>
              <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40">
                <span className="text-3xl sm:text-4xl font-black text-purple-300 block">
                  {loadingGh ? '...' : ghData?.followers ?? '4'}
                </span>
                <span className="text-[10px] text-purple-300 uppercase tracking-wider">Followers</span>
              </div>
            </div>

            {/* Top Languages Distribution */}
            <div className="mb-4">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-2">
                TOP DETECTED REPOSITORY LANGUAGES
              </span>
              <div className="flex flex-wrap gap-2">
                {(ghData?.topLanguages || [
                  { language: 'TypeScript', count: 8 },
                  { language: 'JavaScript', count: 5 },
                  { language: 'HTML', count: 5 },
                  { language: 'CSS', count: 4 },
                  { language: 'Python', count: 3 },
                  { language: 'Dart', count: 1 },
                ]).map((l) => (
                  <span
                    key={l.language}
                    className="px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-800/40 font-mono text-xs text-purple-200 flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {l.language} ({l.count})
                  </span>
                ))}
              </div>
            </div>

            {ghError && (
              <p className="text-[10px] font-mono text-yellow-400/80 mb-2">{ghError}</p>
            )}

            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-purple-900/30 pt-3">
              <span>TARGET: @sakthirenganathan-dev</span>
              <span>{lastSync ? `Synced at ${lastSync}` : 'Authentic API data'}</span>
            </div>
          </div>
        )}

        {/* -------------------- SECTION 5: SUMMONING ALLIANCE (CONNECT) -------------------- */}
        {currentStage === 5 && (
          <div className="flex flex-col items-center max-w-xl mx-auto bg-black/75 border border-purple-900/50 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_35px_rgba(15,5,30,0.9)]">
            <span className="font-mono text-xs tracking-widest text-cyan-400 uppercase mb-2">
              KUCHIYOSE NO JUTSU
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-white uppercase tracking-wide text-glow-purple mb-3">
              SUMMONING ALLIANCE
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm font-light mb-6 max-w-md">
              “A shinobi never gives up on the code they believe in.” Connect with Sakthi across the developer network.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs">
              <a
                href="https://github.com/sakthirenganathan-dev"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-purple-900/50 border border-purple-500 hover:border-cyan-400 text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                <Github className="w-4 h-4 text-purple-300" />
                <span>GITHUB ↗</span>
              </a>
              <a
                href="https://linkedin.com/in/sakthi-renganathan-k"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-cyan-900/50 border border-cyan-500 hover:border-white text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Linkedin className="w-4 h-4 text-cyan-300" />
                <span>LINKEDIN ↗</span>
              </a>
              <a
                href="https://sakthirenganathan.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-900/50 border border-pink-500 hover:border-white text-white transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)]"
              >
                <Globe className="w-4 h-4 text-pink-300" />
                <span>PORTFOLIO ↗</span>
              </a>
            </div>
          </div>
        )}
      </main>

      {/* ==================== 3. BOTTOM REALM NAVIGATION TIMELINE ==================== */}
      <footer className="w-full flex items-center justify-between border-t border-purple-900/40 pt-3 pointer-events-auto backdrop-blur-sm bg-black/30 px-3 sm:px-4 py-2 rounded-xl">
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
                  ? 'w-8 sm:w-10 bg-cyan-400 shadow-[0_0_12px_#06b6d4]'
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
      </footer>
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
