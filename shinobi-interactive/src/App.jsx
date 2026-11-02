import React, { useState } from 'react';
import ChakraBackground from './components/ChakraBackground.jsx';
import HeroScene from './components/HeroScene.jsx';
import LiveTelemetry from './components/LiveTelemetry.jsx';
import ChakraOrbit from './components/ChakraOrbit.jsx';
import CharacterContinuum from './components/CharacterContinuum.jsx';
import ProjectChronicles from './components/ProjectChronicles.jsx';
import SummoningPortal from './components/SummoningPortal.jsx';
import { Volume2, VolumeX, Eye } from 'lucide-react';

export default function App() {
  const [audioActive, setAudioActive] = useState(false);
  const audioContextRef = React.useRef(null);
  const oscRef = React.useRef(null);

  // Web Audio API subtle ambient chakra drone (no external mp3 dependency!)
  const toggleAudio = () => {
    if (!audioActive) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 108Hz meditative chakra frequency (deep A2 harmonic)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(108, ctx.currentTime);

        gain.gain.setValueAtTime(0.015, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        setAudioActive(true);
      } catch (e) {
        console.warn('Audio context init notice:', e);
      }
    } else {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      setAudioActive(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#05020c] text-slate-100 overflow-x-hidden">
      {/* 3D Three.js Background Particle Cosmos */}
      <ChakraBackground />

      {/* Top Floating Control Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-purple-900/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-cinzel text-sm md:text-base font-black tracking-widest text-white">
            影 · SHINOBI
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-950/70 border border-purple-700/60 hover:border-cyan-400 text-xs font-mono text-purple-200 transition-all duration-300"
          >
            {audioActive ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{audioActive ? 'CHAKRA AUDIO ON' : 'AUDIO OFF'}</span>
          </button>

          <a
            href="https://github.com/sakthirenganathan-dev"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-900/80 to-cyan-900/80 border border-purple-500/50 hover:border-cyan-300 text-xs font-mono font-bold text-white transition-all duration-300"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>GITHUB ↗</span>
          </a>
        </div>
      </header>

      {/* Main Continuous Cinematic Scenes */}
      <main className="relative z-10 flex flex-col gap-12">
        <HeroScene />
        <LiveTelemetry />
        <ChakraOrbit />
        <CharacterContinuum />
        <ProjectChronicles />
        <SummoningPortal />
      </main>
    </div>
  );
}

