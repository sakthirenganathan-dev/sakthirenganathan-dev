import React, { useState } from 'react';
import { Scroll, ExternalLink, Code2, Sparkles, Compass } from 'lucide-react';

const CHRONICLES = [
  {
    chapter: 'CHAPTER 01',
    title: 'VisionMate AI',
    tagline: 'Assistive Computer Vision & Auditory Perception Suite',
    rank: 'S-RANK MISSION',
    rankColor: '#06b6d4',
    repoUrl: 'https://github.com/sakthirenganathan-dev/VisionMate-AI',
    stack: ['Python', 'Computer Vision', 'PyTorch', 'Audio Synthesis'],
    story:
      'Engineered to empower visually impaired individuals with real-time spatial awareness. Processes live camera feeds to identify environmental obstacles, objects, and facial expressions, converting visual stimuli into spatial auditory guidance.',
  },
  {
    chapter: 'CHAPTER 02',
    title: 'SafeMeds AI',
    tagline: 'Intelligent Pharmaceutical Safety & Drug Interaction Engine',
    rank: 'A-RANK MISSION',
    rankColor: '#10b981',
    repoUrl: 'https://github.com/sakthirenganathan-dev/safeMedesAi',
    stack: ['React', 'Node.js', 'Medical APIs', 'AI Safety Engine'],
    story:
      'Created to mitigate dangerous prescription errors and drug-to-drug interactions. Patients and clinicians can cross-verify multiple medications, identify hazardous chemical conflicts, and verify safe dosage schedules through an intelligent safety engine.',
  },
  {
    chapter: 'CHAPTER 03',
    title: 'ISL Healthcare Connect',
    tagline: 'Indian Sign Language Real-Time Translation Bridge',
    rank: 'S-RANK MISSION',
    rankColor: '#f97316',
    repoUrl: 'https://github.com/sakthirenganathan-dev/isl-healthcare',
    stack: ['Flutter', 'TensorFlow', 'Mobile Architecture', 'Gesture ML'],
    story:
      'Bridges a critical healthcare accessibility divide in India. Translates Indian Sign Language gestures in real-time into doctor-readable text and speech, allowing deaf and mute patients to communicate accurately with healthcare specialists without delays.',
  },
  {
    chapter: 'CHAPTER 04',
    title: 'RYVEN',
    tagline: 'Autonomous Privacy-First Local Desktop Intelligence Assistant',
    rank: 'S-RANK MISSION',
    rankColor: '#a855f7',
    repoUrl: 'https://github.com/sakthirenganathan-dev/RYVEN',
    stack: ['Python', 'Local LLMs', 'Agentic Architecture', 'Desktop Engine'],
    story:
      'An autonomous AI assistant engineered to run entirely on local offline machine hardware. Executes desktop system orchestration, codebase refactoring, and multi-step tasks without exposing sensitive personal data to external cloud APIs.',
  },
  {
    chapter: 'CHAPTER 05',
    title: 'StudyGen AI',
    tagline: 'Generative AI Academic Copilot & Adaptive Learning Architect',
    rank: 'A-RANK MISSION',
    rankColor: '#f59e0b',
    repoUrl: 'https://github.com/sakthirenganathan-dev/StudyGenAi',
    stack: ['JavaScript', 'React', 'Generative AI APIs', 'Adaptive Learning'],
    story:
      'Synthesizes complex technical textbooks and lectures into structured visual roadmaps, automated flashcard generation, and adaptive retention quizzes, tailoring study workflows to the student’s learning velocity.',
  },
];

export default function ProjectChronicles() {
  const [activeChapter, setActiveChapter] = useState(0);
  const proj = CHRONICLES[activeChapter];

  return (
    <section className="relative py-24 px-4 max-w-6xl mx-auto z-10">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 font-mono text-xs tracking-widest uppercase mb-3">
          <Scroll className="w-3.5 h-3.5" />
          <span>CINEMATIC NARRATIVE CHAPTERS</span>
        </div>
        <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white uppercase tracking-wider text-glow-purple">
          PROJECTS AS A STORY
        </h2>
        <p className="font-mono text-xs text-slate-400 tracking-widest mt-2">
          JOURNEY THROUGH THE FIVE S-RANK MISSIONS OF SAKTHI'S DEVELOPER PATH
        </p>
      </div>

      {/* Chapter Selection Ribbon (Flowing line) */}
      <div className="flex items-center justify-between overflow-x-auto gap-4 mb-12 border-b border-purple-900/40 pb-4">
        {CHRONICLES.map((c, i) => (
          <button
            key={c.title}
            onClick={() => setActiveChapter(i)}
            className={`flex flex-col items-start gap-1 font-mono text-xs transition-all duration-300 min-w-[140px] ${
              activeChapter === i ? 'opacity-100 scale-105' : 'opacity-40 hover:opacity-75'
            }`}
          >
            <span 
              className="text-[10px] font-bold tracking-widest"
              style={{ color: activeChapter === i ? c.rankColor : '#94a3b8' }}
            >
              {c.chapter}
            </span>
            <span className="font-bold text-white text-sm">{c.title}</span>
            <div 
              className="w-full h-1 rounded-full mt-1"
              style={{ backgroundColor: activeChapter === i ? c.rankColor : 'transparent' }}
            />
          </button>
        ))}
      </div>

      {/* Cinematic Chapter Scene (Cardless full-width storytelling) */}
      <div className="relative p-8 md:p-14 rounded-3xl bg-gradient-to-r from-purple-950/40 via-black/90 to-slate-950/60 border border-purple-800/50 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-purple-900/40 pb-6">
          <div>
            <span 
              className="text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full border mb-3 inline-block"
              style={{ color: proj.rankColor, borderColor: proj.rankColor }}
            >
              {proj.chapter} // {proj.rank}
            </span>
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
              {proj.title}
            </h3>
            <p className="text-sm font-mono text-cyan-300 mt-1">
              {proj.tagline}
            </p>
          </div>

          <a
            href={proj.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-mono text-xs font-bold tracking-wider text-white transition-all duration-300 hover:scale-105 shadow-[0_0_25px_rgba(168,85,247,0.4)]"
            style={{ backgroundColor: proj.rankColor }}
          >
            <span>OPEN REPOSITORY SCROLL</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Narrative Description */}
        <div className="mb-10">
          <span className="font-mono text-xs text-purple-300 tracking-widest uppercase block mb-2">
            MISSION SCRIPT &amp; PHILOSOPHY:
          </span>
          <p className="text-slate-200 text-base md:text-lg leading-relaxed font-light max-w-4xl">
            {proj.story}
          </p>
        </div>

        {/* Technology Arsenal */}
        <div>
          <span className="font-mono text-xs text-purple-300 tracking-widest uppercase block mb-3">
            TECHNICAL ARSENAL EMPLOYED:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {proj.stack.map((tech) => (
              <span
                key={tech}
                className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-slate-900 border border-purple-700/60 text-slate-200 flex items-center gap-1.5"
              >
                <Code2 className="w-3 h-3 text-cyan-400" />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

