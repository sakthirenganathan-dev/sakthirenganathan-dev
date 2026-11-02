import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Sparkles, Orbit, Layers } from 'lucide-react';

const TECH_NODES = [
  { id: 'react', name: 'React', category: 'Frontend', color: '#06b6d4', icon: '⚛️', desc: 'Component architecture, hooks, state machines, and dynamic SPA rendering.' },
  { id: 'js', name: 'JavaScript', category: 'Core Web', color: '#facc15', icon: 'JS', desc: 'Modern ES6+, async architecture, closures, event-driven reactive logic.' },
  { id: 'three', name: 'Three.js', category: 'Creative 3D', color: '#c084fc', icon: '▲', desc: 'WebGL 3D scene graphing, shader pipelines, particle vortexes, and cameras.' },
  { id: 'gsap', name: 'GSAP', category: 'Motion Design', color: '#22c55e', icon: '⚡', desc: 'High-performance timelines, ScrollTrigger, cinematic choreographies.' },
  { id: 'java', name: 'Java', category: 'Backend / OOP', color: '#f97316', icon: '☕', desc: 'Object-oriented programming, data structures, robust enterprise logic.' },
  { id: 'flutter', name: 'Flutter', category: 'Cross-Platform Mobile', color: '#38bdf8', icon: '📱', desc: 'Dart-powered native mobile apps for iOS and Android with unified UI.' },
  { id: 'ai', name: 'AI Engineering', category: 'Intelligence', color: '#ec4899', icon: '🧠', desc: 'Local quantized LLMs, agent workflows, PyTorch, computer-vision models.' },
  { id: 'git', name: 'Git & GitHub', category: 'DevOps / CI/CD', color: '#f43f5e', icon: '🐙', desc: 'Version control, automated GitHub Actions, CI/CD deployment pipelines.' },
  { id: 'html', name: 'HTML5', category: 'Semantic Web', color: '#fb7185', icon: '🌐', desc: 'Semantic markup, accessibility, modern Web APIs, canvas integration.' },
  { id: 'css', name: 'CSS3 / Tailwind', category: 'Styling & FX', color: '#60a5fa', icon: '🎨', desc: 'Modern CSS Grid, Flexbox, custom design systems, keyframe animations.' },
];

export default function ChakraOrbit() {
  const [activeNode, setActiveNode] = useState(TECH_NODES[0]);
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const requestRef = useRef();

  // Continuous orbital rotation
  useEffect(() => {
    const animate = () => {
      if (!isPaused) {
        setOrbitAngle((prev) => (prev + 0.35) % 360);
      }
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPaused]);

  return (
    <section className="relative py-24 px-4 max-w-6xl mx-auto z-10">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-xs tracking-widest uppercase mb-3">
          <Orbit className="w-3.5 h-3.5 text-cyan-400" />
          <span>CONTINUOUS CHAKRA MOTION</span>
        </div>
        <h2 className="font-cinzel text-3xl md:text-5xl font-black text-white uppercase tracking-wider text-glow-purple">
          LIVING CHAKRA TECH ORBIT
        </h2>
        <p className="font-mono text-xs text-slate-400 tracking-widest mt-2">
          HOVER OR TAP ANY CELESTIAL NODE TO CHANNEL ITS JUTSU DATA
        </p>
      </div>

      {/* Orbit Visualization Container */}
      <div className="relative w-full aspect-square max-w-[650px] mx-auto flex items-center justify-center">
        {/* Orbital Track Rings */}
        <div className="absolute w-[360px] h-[360px] md:w-[480px] md:h-[480px] rounded-full border border-purple-500/20 border-dashed animate-spin-slow pointer-events-none" />
        <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] rounded-full border border-cyan-500/20 border-dashed animate-spin-reverse pointer-events-none" />

        {/* Central Rinnegan Eye Core */}
        <div 
          onClick={() => setIsPaused(!isPaused)}
          className="relative z-20 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-purple-950 via-slate-900 to-black border-2 border-purple-400/80 flex flex-col items-center justify-center cursor-pointer shadow-[0_0_50px_rgba(168,85,247,0.7)] hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-purple-400/50 flex items-center justify-center">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black border border-white flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </div>
          <span className="font-mono text-[9px] text-purple-300 font-bold uppercase mt-1 tracking-wider">
            {isPaused ? 'RESUME' : 'PAUSE'}
          </span>
        </div>

        {/* Orbiting Technology Planetary Nodes */}
        {TECH_NODES.map((node, index) => {
          // Inner vs Outer orbit distribution
          const isInner = index < 4;
          const radius = isInner ? 140 : 220; // Radius in pixels (scaled on mobile via CSS)
          const angleOffset = (index / (isInner ? 4 : 6)) * (Math.PI * 2);
          const currentRad = (orbitAngle * (Math.PI / 180) * (isInner ? 1 : -0.7)) + angleOffset;

          const x = Math.cos(currentRad) * radius;
          const y = Math.sin(currentRad) * radius;

          const isSelected = activeNode.id === node.id;

          return (
            <div
              key={node.id}
              onClick={() => setActiveNode(node)}
              onMouseEnter={() => {
                setActiveNode(node);
                setIsPaused(true);
              }}
              onMouseLeave={() => setIsPaused(false)}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                borderColor: node.color,
                boxShadow: isSelected ? `0 0 30px ${node.color}` : 'none',
              }}
              className={`absolute z-30 cursor-pointer flex items-center justify-center rounded-full transition-all duration-300 ${
                isSelected
                  ? 'w-14 h-14 md:w-16 md:h-16 bg-slate-900 border-2 scale-125'
                  : 'w-10 h-10 md:w-12 md:h-12 bg-black/80 border border-slate-700/60 hover:scale-110'
              }`}
            >
              <span className="text-sm md:text-base font-bold select-none">{node.icon}</span>
              {isSelected && (
                <span 
                  className="absolute -bottom-6 text-[10px] md:text-xs font-mono font-bold whitespace-nowrap px-2 py-0.5 rounded-full bg-black/90 border"
                  style={{ color: node.color, borderColor: node.color }}
                >
                  {node.name}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Node Telemetry Display (Cardless flowing telemetry) */}
      <div className="mt-12 max-w-2xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-black/80 to-slate-950/50 border border-purple-800/60 backdrop-blur-md shadow-[0_0_40px_rgba(168,85,247,0.2)]">
        <div className="flex items-center justify-between mb-3 border-b border-purple-900/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeNode.icon}</span>
            <div>
              <h3 className="text-lg font-black text-white">{activeNode.name}</h3>
              <span className="font-mono text-xs text-purple-300">{activeNode.category}</span>
            </div>
          </div>
          <span 
            className="px-3 py-1 rounded-full text-xs font-mono font-bold border"
            style={{ color: activeNode.color, borderColor: activeNode.color }}
          >
            AFFINITY: ACTIVE
          </span>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed font-light">
          {activeNode.desc}
        </p>
      </div>
    </section>
  );
}

