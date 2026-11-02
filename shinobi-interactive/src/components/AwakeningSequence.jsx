import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { getDeviceProfile } from '../utils/deviceProfiler.js';
import { chakraAudio } from '../audio/ChakraSynth.js';
import { Volume2, VolumeX, FastForward } from 'lucide-react';

export default function AwakeningSequence({ onComplete }) {
  const mountRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const subtitle2Ref = useRef(null);
  const overlayRef = useRef(null);

  const [audioEnabled, setAudioEnabled] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const [currentSceneText, setCurrentSceneText] = useState('THE VOID');

  const timelineRef = useRef(null);
  const animFrameRef = useRef(null);

  const device = getDeviceProfile();

  // Handle Skip Intro
  const handleSkip = () => {
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    sessionStorage.setItem('shinobi_intro_seen', 'true');
    onComplete();
  };

  // Keyboard shortcut ESC to skip
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleSkip();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Audio Toggle (Autoplay compliant: starts muted, user gesture required)
  const toggleAudio = (e) => {
    e.stopPropagation();
    const isNowActive = chakraAudio.toggle();
    setAudioEnabled(isNowActive);
  };

  useEffect(() => {
    // If reduced-motion preferred or intro already seen in this session, skip smoothly
    if (device.reducedMotion || sessionStorage.getItem('shinobi_intro_seen') === 'true') {
      handleSkip();
      return;
    }

    if (!mountRef.current) return;

    // Detect WebGL capability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch (e) {
      setWebglSupported(false);
      return;
    }

    // ==================== THREE.JS AWAKENING SCENE ====================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030008, 0.008);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 95);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(device.maxPixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mountRef.current.appendChild(renderer.domElement);

    // ==================== 1. CHAKRA PARTICLE VOID (Adaptive Count) ====================
    const count = device.particleCount;
    const particleGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const originalPos = new Float32Array(count * 3);

    const purplePalette = [
      new THREE.Color('#9333ea'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#6b21a8'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#e9d5ff'),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 15 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const z = (Math.random() - 0.5) * 250;

      pos[i * 3] = Math.cos(theta) * radius;
      pos[i * 3 + 1] = Math.sin(theta) * radius;
      pos[i * 3 + 2] = z;

      originalPos[i * 3] = pos[i * 3];
      originalPos[i * 3 + 1] = pos[i * 3 + 1];
      originalPos[i * 3 + 2] = pos[i * 3 + 2];

      const c = purplePalette[Math.floor(Math.random() * purplePalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.1, // Starts nearly invisible in The Void
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==================== 2. PROCEDURAL RINNEGAN ENTITY ====================
    const eyeGroup = new THREE.Group();
    eyeGroup.position.set(0, 0, 0);
    eyeGroup.scale.set(0.001, 0.001, 0.001); // Starts dormant

    // Pupil Core
    const pupilGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x030008 });
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    eyeGroup.add(pupil);

    // Inner Glowing Core
    const coreGlowGeo = new THREE.RingGeometry(3.5, 4.2, 64);
    const coreGlowMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const coreGlow = new THREE.Mesh(coreGlowGeo, coreGlowMat);
    eyeGroup.add(coreGlow);

    // 5 Concentric Torus Rings (Procedural Rinnegan Ripple)
    const ringRadii = [8, 14, 21, 29, 38];
    const ringMeshes = [];
    ringRadii.forEach((r, idx) => {
      const rGeo = new THREE.TorusGeometry(r, 0.22, 8, 64);
      const rMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xc084fc : 0x9333ea,
        wireframe: true,
        transparent: true,
        opacity: 0.8 - idx * 0.1,
      });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.z = -idx * 0.8;
      eyeGroup.add(rMesh);
      ringMeshes.push(rMesh);
    });

    // 6 Procedural Tomoe Spheres along Ring 3 (radius 21)
    const tomoeRing = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const tGeo = new THREE.SphereGeometry(1.1, 16, 16);
      const tMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const tMesh = new THREE.Mesh(tGeo, tMat);
      tMesh.position.set(Math.cos(angle) * 21, Math.sin(angle) * 21, 0);
      tomoeRing.add(tMesh);
    }
    eyeGroup.add(tomoeRing);

    // Energy Pulse Shockwave Ring
    const pulseRingGeo = new THREE.RingGeometry(1, 2, 64);
    const pulseRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const pulseRing = new THREE.Mesh(pulseRingGeo, pulseRingMat);
    eyeGroup.add(pulseRing);

    scene.add(eyeGroup);

    // ==================== 3. CHIDORI LIGHTNING ARCS ====================
    const lightningCount = 18;
    const lightningGeo = new THREE.BufferGeometry();
    const lightningPositions = new Float32Array(lightningCount * 6);
    lightningGeo.setAttribute('position', new THREE.BufferAttribute(lightningPositions, 3));
    const lightningMat = new THREE.LineBasicMaterial({
      color: 0x67e8f9,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const lightningLines = new THREE.LineSegments(lightningGeo, lightningMat);
    scene.add(lightningLines);

    // ==================== GSAP CINEMATIC TIMELINE ====================
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        sessionStorage.setItem('shinobi_intro_seen', 'true');
        onComplete();
      },
    });
    timelineRef.current = tl;

    // Scene 1: The Void (0s - 2.2s)
    tl.to(particleMat, {
      opacity: 0.85,
      duration: 2.2,
      onStart: () => setCurrentSceneText('SCENE 1: THE VOID'),
    })
      .to(camera.position, { z: 75, duration: 2.2 }, 0);

    // Scene 2: Chakra Awakening (2.2s - 4.5s)
    tl.to(
      eyeGroup.scale,
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 2.0,
        ease: 'elastic.out(1, 0.75)',
        onStart: () => {
          setCurrentSceneText('SCENE 2: CHAKRA AWAKENING');
          chakraAudio.playJutsuChime(216);
        },
      },
      2.2
    ).to(camera.position, { z: 58, duration: 2.0 }, 2.2);

    // Scene 3: Eye Activation (4.5s - 6.5s)
    tl.to(
      lightningMat,
      {
        opacity: 0.9,
        duration: 0.4,
        repeat: 3,
        yoyo: true,
        onStart: () => {
          setCurrentSceneText('SCENE 3: EYE ACTIVATION');
          chakraAudio.playJutsuChime(432);
        },
      },
      4.5
    )
      .to(pulseRingMat, { opacity: 0.8, duration: 0.4 }, 5.2)
      .to(pulseRing.scale, { x: 35, y: 35, duration: 1.2, ease: 'power3.out' }, 5.2)
      .to(pulseRingMat, { opacity: 0, duration: 0.6 }, 5.8);

    // Scene 4: Identity Reveal (6.5s - 8.8s)
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 25, letterSpacing: '4px' },
      {
        opacity: 1,
        y: 0,
        letterSpacing: '10px',
        duration: 1.2,
        onStart: () => setCurrentSceneText('SCENE 4: IDENTITY REVEAL'),
      },
      6.5
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.8 },
        7.3
      )
      .fromTo(
        subtitle2Ref.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        7.8
      );

    // Scene 5: World Transition - Diving into the Eye (8.8s - 10.2s)
    tl.to(
      camera.position,
      {
        z: -25, // Dive through the center of the pupil into the world!
        duration: 1.4,
        ease: 'power3.in',
        onStart: () => {
          setCurrentSceneText('SCENE 5: WORLD TRANSITION');
          chakraAudio.playJutsuChime(540);
        },
      },
      8.8
    )
      .to(overlayRef.current, { opacity: 0, duration: 0.6 }, 9.2);

    // ==================== ANIMATION RENDER LOOP ====================
    let clock = new THREE.Clock();

    const render = () => {
      animFrameRef.current = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();

      // Swirl particles into center
      particles.rotation.z = elapsed * 0.08;

      // Rotate Rinnegan concentric rings at alternating differential speeds
      ringMeshes.forEach((mesh, idx) => {
        mesh.rotation.z = elapsed * (idx % 2 === 0 ? 0.12 : -0.09) * (idx + 1) * 0.4;
      });

      // Orbit Tomoe
      tomoeRing.rotation.z = elapsed * 0.45;

      // Randomize Lightning Arcs when active
      if (lightningMat.opacity > 0.05) {
        const lp = lightningGeo.attributes.position.array;
        for (let i = 0; i < lightningCount; i++) {
          const a = Math.random() * Math.PI * 2;
          const r1 = 4;
          const r2 = 18 + Math.random() * 15;
          lp[i * 6] = Math.cos(a) * r1;
          lp[i * 6 + 1] = Math.sin(a) * r1;
          lp[i * 6 + 2] = (Math.random() - 0.5) * 4;

          lp[i * 6 + 3] = Math.cos(a) * r2;
          lp[i * 6 + 4] = Math.sin(a) * r2;
          lp[i * 6 + 5] = (Math.random() - 0.5) * 4;
        }
        lightningGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    render();

    // Resize Handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', onResize);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#030008] text-white overflow-hidden select-none">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* WebGL Fallback if canvas context fails */}
      {!webglSupported && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
          <span className="font-mono text-xs text-purple-400 tracking-widest uppercase mb-2">
            ✦ · 六道 CHRONICLES · 忍 · ✦
          </span>
          <h1 className="font-cinzel text-5xl font-black text-white uppercase tracking-widest text-glow-purple mb-4">
            SAKTHI RENGANATHAN
          </h1>
          <p className="font-mono text-sm tracking-widest text-cyan-300 font-bold mb-8">
            FULL-STACK DEVELOPER · AI BUILDER · SHINOBI
          </p>
          <button
            onClick={handleSkip}
            className="px-6 py-2.5 rounded-full bg-purple-900 border border-purple-500 text-white font-mono text-xs"
          >
            ENTER UNIVERSE
          </button>
        </div>
      )}

      {/* Floating HUD Controls during Awakening */}
      <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between text-xs font-mono text-slate-400 pointer-events-auto">
        {/* Current Cinematic Scene Telemetry Indicator */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span className="tracking-widest text-purple-300 font-bold">{currentSceneText}</span>
        </div>

        {/* Audio Toggle & Skip Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAudio}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-purple-800/60 hover:border-cyan-400 text-purple-200 transition-all duration-200 backdrop-blur-md"
            title="Toggle Ambient Sound (Muted by default)"
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden sm:inline">{audioEnabled ? 'SOUND ON' : 'SOUND OFF'}</span>
          </button>

          <button
            onClick={handleSkip}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-600/70 hover:border-cyan-400 text-cyan-200 transition-all duration-200 backdrop-blur-md font-bold tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.3)]"
          >
            <span>SKIP INTRO</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Typography Reveal (Scene 4) */}
      <div
        ref={overlayRef}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none"
      >
        <h1
          ref={titleRef}
          className="font-cinzel text-4xl sm:text-6xl md:text-8xl font-black text-white uppercase tracking-widest text-glow-purple mb-4 opacity-0"
        >
          SAKTHI RENGANATHAN
        </h1>

        <div
          ref={subtitleRef}
          className="font-mono text-xs sm:text-base md:text-lg tracking-[0.3em] text-cyan-300 font-bold mb-2 text-glow-cyan opacity-0"
        >
          FULL-STACK DEVELOPER · AI BUILDER · SHINOBI
        </div>

        <p
          ref={subtitle2Ref}
          className="font-mono text-xs sm:text-sm tracking-widest text-slate-400 uppercase opacity-0"
        >
          THE SIX PATHS DEVELOPER CHRONICLES
        </p>
      </div>

      {/* Bottom Keyboard Hint */}
      <div className="absolute bottom-6 left-0 right-0 z-20 text-center font-mono text-[10px] text-slate-500 tracking-widest">
        PRESS [ESC] TO SKIP INTRO
      </div>
    </div>
  );
}

