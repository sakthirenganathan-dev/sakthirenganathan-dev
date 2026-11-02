import React, { useState, useEffect, useRef } from 'react';
import AwakeningSequence from './components/AwakeningSequence.jsx';
import ShinobiWorld from './world/ShinobiWorld.jsx';
import ShinobiHUD from './components/ShinobiHUD.jsx';
import { chakraAudio } from './audio/ChakraSynth.js';
import { Volume2, VolumeX, RotateCcw } from 'lucide-react';

export default function App() {
  const [introCompleted, setIntroCompleted] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('skipIntro') === 'true' || window.location.hash === '#world') return true;
      return sessionStorage.getItem('shinobi_intro_seen') === 'true';
    }
    return false;
  });

  const [stage, setStage] = useState(0);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [audioActive, setAudioActive] = useState(false);
  const [shockwaveActive, setShockwaveActive] = useState(false);

  // Toggle audio engine
  const handleToggleAudio = () => {
    const isNowActive = chakraAudio.toggle();
    setAudioActive(isNowActive);
  };

  // Replay intro sequence on demand
  const handleReplayIntro = () => {
    sessionStorage.removeItem('shinobi_intro_seen');
    setIntroCompleted(false);
  };

  // Wheel listener to glide camera smoothly between 3D realms
  useEffect(() => {
    if (!introCompleted) return; // Do not intercept scroll while intro is playing

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
  }, [introCompleted]);

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    if (project.url) {
      window.open(project.url, '_blank');
    }
  };

  const handleShockwave = () => {
    setShockwaveActive(true);
    chakraAudio.playJutsuChime(324);
    setTimeout(() => setShockwaveActive(false), 2000);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05020c] text-white">
      {/* PHASE 1: THE AWAKENING CINEMATIC INTRO */}
      {!introCompleted && (
        <AwakeningSequence onComplete={() => setIntroCompleted(true)} />
      )}

      {/* PHASE 2: LIVING 3D SHINOBI WORLD */}
      <ShinobiWorld
        currentStage={stage}
        setStage={setStage}
        hoveredNode={hoveredNode}
        setHoveredNode={setHoveredNode}
        onSelectProject={handleSelectProject}
        triggerShockwave={handleShockwave}
      />

      {/* Floating Global Utility Controls (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        {introCompleted && (
          <button
            onClick={handleReplayIntro}
            className="p-3 rounded-full bg-black/60 border border-purple-700/60 hover:border-cyan-400 text-purple-200 transition-all duration-300 backdrop-blur-md"
            title="Replay Cinematic Awakening"
          >
            <RotateCcw className="w-4 h-4 text-purple-300" />
          </button>
        )}

        <button
          onClick={handleToggleAudio}
          className="p-3 rounded-full bg-black/60 border border-purple-700/60 hover:border-cyan-400 text-purple-200 transition-all duration-300 backdrop-blur-md"
          title="Toggle Chakra Ambiance (Muted by default)"
        >
          {audioActive ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
        </button>
      </div>

      {/* Futuristic Cinematic Anime HUD */}
      {introCompleted && (
        <ShinobiHUD
          currentStage={stage}
          setStage={setStage}
          hoveredNode={hoveredNode}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          shockwaveActive={shockwaveActive}
        />
      )}
    </div>
  );
}
