import React, { useState, useEffect, useRef } from 'react';
import ShinobiWorld from './world/ShinobiWorld.jsx';
import ShinobiHUD from './components/ShinobiHUD.jsx';
import { Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [audioActive, setAudioActive] = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);

  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);

  // Subtle 108Hz ambient meditative chakra drone via Web Audio API
  const toggleAudio = () => {
    if (!audioActive) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(108, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        oscRef.current = osc;
        setAudioActive(true);
      } catch (e) {
        console.warn('Audio notice:', e);
      }
    } else {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current.disconnect();
      }
      setAudioActive(false);
    }
  };

  // Wheel listener to glide camera smoothly between 3D realms
  useEffect(() => {
    let timeout = false;
    const handleWheel = (e) => {
      if (timeout) return;
      if (Math.abs(e.deltaY) > 40) {
        timeout = true;
        if (e.deltaY > 0) {
          setStage((prev) => (prev < 5 ? prev + 1 : 0));
        } else {
          setStage((prev) => (prev > 0 ? prev - 1 : 5));
        }
        setTimeout(() => {
          timeout = false;
        }, 650);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    if (project.url) {
      window.open(project.url, '_blank');
    }
  };

  const handleShockwave = () => {
    setShockwaveActive(true);
    setTimeout(() => setShockwaveActive(false), 2000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05020c] text-white">
      {/* 3D WebGL Shinobi World */}
      <ShinobiWorld
        currentStage={stage}
        setStage={setStage}
        hoveredNode={hoveredNode}
        setHoveredNode={setHoveredNode}
        onSelectProject={handleSelectProject}
        triggerShockwave={handleShockwave}
      />

      {/* Floating Audio Controller */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/60 border border-purple-700/60 hover:border-cyan-400 text-purple-200 transition-all duration-300 backdrop-blur-md"
        title="Toggle Chakra Ambiance"
      >
        {audioActive ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
      </button>

      {/* Futuristic Cinematic Anime HUD */}
      <ShinobiHUD
        currentStage={stage}
        setStage={setStage}
        hoveredNode={hoveredNode}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        shockwaveActive={shockwaveActive}
      />
    </div>
  );
}
