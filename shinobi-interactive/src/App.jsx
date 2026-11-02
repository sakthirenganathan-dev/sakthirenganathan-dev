import React, { useState, useEffect } from 'react';
import UniverseCanvas from './components/UniverseCanvas.jsx';
import CinematicHUD from './components/CinematicHUD.jsx';
import { Volume2, VolumeX } from 'lucide-react';

export default function App() {
  const [stage, setStage] = useState(0);
  const [audioActive, setAudioActive] = useState(false);
  const audioCtxRef = React.useRef(null);
  const oscRef = React.useRef(null);

  // Subtle 108Hz ambient meditative chakra frequency via Web Audio
  const toggleAudio = () => {
    if (!audioActive) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
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

  // Wheel listener to glide through stages
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
        }, 800);
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#05020c] text-white">
      {/* 3D Three.js Unified Universe Canvas */}
      <UniverseCanvas currentStage={stage} />

      {/* Floating Audio Toggle */}
      <button
        onClick={toggleAudio}
        className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-black/60 border border-purple-700/60 hover:border-cyan-400 text-purple-200 transition-all duration-300 backdrop-blur-md"
        title="Toggle Chakra Ambiance"
      >
        {audioActive ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
      </button>

      {/* Cinematic HUD Overlay */}
      <CinematicHUD stage={stage} setStage={setStage} />
    </div>
  );
}
