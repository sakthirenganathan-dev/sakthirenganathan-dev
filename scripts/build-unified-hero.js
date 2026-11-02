import fs from 'fs';
import path from 'path';

const base64Data = fs.readFileSync(path.resolve('assets', 'avatar-base64.txt'), 'utf8').trim();

const heroSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="540" viewBox="0 0 1200 540" role="img" aria-label="SHINOBI: The Six Paths — Sakthi Renganathan">
  <defs>
    <!-- Background Atmospheric Gradient -->
    <radialGradient id="nebulaCore" cx="50%" cy="45%" r="70%">
      <stop offset="0%" stop-color="#240c4a" stop-opacity="0.95"/>
      <stop offset="35%" stop-color="#14062b" stop-opacity="0.9"/>
      <stop offset="70%" stop-color="#080214" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#030008" stop-opacity="1"/>
    </radialGradient>

    <!-- Rinnegan Aura Gradients -->
    <radialGradient id="eyeAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.8"/>
      <stop offset="25%" stop-color="#c084fc" stop-opacity="0.6"/>
      <stop offset="65%" stop-color="#9333ea" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#1e0538" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cyanChakra" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#083344" stop-opacity="0"/>
    </radialGradient>

    <!-- Linear Flow -->
    <linearGradient id="violetBeam" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0"/>
      <stop offset="30%" stop-color="#c084fc" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="70%" stop-color="#06b6d4" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </linearGradient>

    <!-- Filters -->
    <filter id="highGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" result="b1"/>
      <feGaussianBlur stdDeviation="3" result="b2"/>
      <feMerge><feMergeNode in="b1"/><feMergeNode in="b2"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="avatarShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="15" flood-color="#a855f7" flood-opacity="0.9"/>
    </filter>

    <!-- Circular Avatar Clip -->
    <clipPath id="avatarClip">
      <circle cx="600" cy="220" r="92" />
    </clipPath>

    <!-- Tomoe Mark -->
    <g id="tomoe">
      <path d="M 0 -11 C 7 -11 11 -7 11 0 C 11 8 4 13 -3 13 C -10 13 -14 7 -14 0 C -14 -7 -8 -9 -4 -9 C -3 -9 -1 -7 -1 -5 C -1 -3 -3 0 -5 1 C -3 0 -1 -2 -1 -5 C -1 -9 -6 -12 -10 -12 C -1 -13 0 -11 0 -11 Z" fill="#ffffff" filter="url(#softGlow)"/>
      <circle cx="0" cy="0" r="3.5" fill="#f5f3ff"/>
    </g>

    <style>
      @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes spinCCW { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      @keyframes rinneganPulse {
        0%, 100% { transform: scale(1); filter: drop-shadow(0 0 25px #9333ea); }
        50% { transform: scale(1.04); filter: drop-shadow(0 0 45px #06b6d4); }
      }
      @keyframes lightningFlicker {
        0%, 91%, 95%, 100% { opacity: 0; }
        92%, 94% { opacity: 0.95; }
        93% { opacity: 1; }
      }
      @keyframes emberFloat1 {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        30% { opacity: 0.9; }
        80% { opacity: 0.7; }
        100% { transform: translateY(-120px) translateX(35px); opacity: 0; }
      }
      @keyframes emberFloat2 {
        0% { transform: translateY(0) translateX(0); opacity: 0; }
        35% { opacity: 0.85; }
        80% { opacity: 0.6; }
        100% { transform: translateY(-130px) translateX(-40px); opacity: 0; }
      }
      @keyframes textShimmer {
        0%, 100% { filter: drop-shadow(0 0 10px rgba(168, 85, 247, 0.4)); }
        50% { filter: drop-shadow(0 0 25px rgba(103, 232, 249, 0.8)); }
      }
      .spin-slow { animation: spinCW 55s linear infinite; transform-origin: 600px 220px; }
      .spin-reverse { animation: spinCCW 40s linear infinite; transform-origin: 600px 220px; }
      .eye-pulse { animation: rinneganPulse 4.5s ease-in-out infinite; transform-origin: 600px 220px; }
      .lightning-fx { animation: lightningFlicker 5s infinite; }
      .e1 { animation: emberFloat1 5s ease-out infinite; }
      .e2 { animation: emberFloat2 6s ease-out infinite 1.5s; }
      .e3 { animation: emberFloat1 5.5s ease-out infinite 2.8s; }
      .title-shimmer { animation: textShimmer 4s ease-in-out infinite; }
    </style>
  </defs>

  <!-- Seamless Canvas -->
  <rect width="1200" height="540" fill="url(#nebulaCore)"/>

  <!-- Fluid Horizontal Energy Rays -->
  <g opacity="0.35">
    <path d="M 0 220 Q 300 160 600 220 T 1200 220" fill="none" stroke="url(#violetBeam)" stroke-width="3" filter="url(#highGlow)"/>
    <path d="M 0 240 Q 350 300 600 240 T 1200 240" fill="none" stroke="#67e8f9" stroke-width="1.5" opacity="0.4"/>
  </g>

  <!-- Giant Japanese Kanji Watermarks -->
  <text x="600" y="290" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="280" fill="#a855f7" opacity="0.04" text-anchor="middle">六道</text>
  <text x="180" y="320" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="230" fill="#06b6d4" opacity="0.03" text-anchor="middle">忍</text>
  <text x="1020" y="320" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="230" fill="#ec4899" opacity="0.03" text-anchor="middle">影</text>

  <!-- ==================== CENTRAL RINNEGAN CHAKRA VORTEX ==================== -->
  <g class="eye-pulse">
    <!-- Outer Chakra Field -->
    <circle cx="600" cy="220" r="235" fill="url(#eyeAura)" opacity="0.6"/>
    <circle cx="600" cy="220" r="170" fill="url(#cyanChakra)" opacity="0.5"/>

    <!-- Concentric Rinnegan Ripple Rings -->
    <g fill="none" stroke="#c084fc" stroke-linecap="round" filter="url(#softGlow)">
      <circle cx="600" cy="220" r="220" stroke-width="2" opacity="0.35" stroke-dasharray="16 12"/>
      <circle cx="600" cy="220" r="180" stroke-width="2.5" opacity="0.65"/>
      <circle cx="600" cy="220" r="145" stroke-width="3" opacity="0.8"/>
      <circle cx="600" cy="220" r="115" stroke-width="3.5" opacity="0.95"/>
    </g>

    <!-- Portrait Border Aura -->
    <circle cx="600" cy="220" r="95" fill="none" stroke="#67e8f9" stroke-width="3.5" filter="url(#highGlow)"/>
  </g>

  <!-- FUSED SHINOBI AVATAR (CENTERED INSIDE RINNEGAN) -->
  <g filter="url(#avatarShadow)">
    <image href="data:image/jpeg;base64,${base64Data}" x="508" y="128" width="184" height="184" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
  </g>

  <!-- Rotating Six Paths Tomoe (Orbiting Avatar Head) -->
  <g class="spin-slow">
    <g transform="translate(600 75)"><use href="#tomoe"/></g>
    <g transform="translate(725 148) rotate(60)"><use href="#tomoe"/></g>
    <g transform="translate(725 292) rotate(120)"><use href="#tomoe"/></g>
    <g transform="translate(600 365) rotate(180)"><use href="#tomoe"/></g>
    <g transform="translate(475 292) rotate(240)"><use href="#tomoe"/></g>
    <g transform="translate(475 148) rotate(300)"><use href="#tomoe"/></g>
  </g>

  <!-- Inner Counter-Rotating Tomoe Ring -->
  <g class="spin-reverse">
    <g transform="translate(600 105)"><use href="#tomoe"/></g>
    <g transform="translate(700 270) rotate(120)"><use href="#tomoe"/></g>
    <g transform="translate(500 270) rotate(240)"><use href="#tomoe"/></g>
  </g>

  <!-- Chidori Lightning Discharges over the Aura -->
  <g class="lightning-fx" stroke="#67e8f9" stroke-width="2.5" fill="none" filter="url(#highGlow)" opacity="0.95">
    <path d="M 460 170 L 510 195 L 490 220 L 545 230 L 600 220"/>
    <path d="M 740 160 L 690 190 L 715 215 L 655 228 L 600 220"/>
    <path d="M 640 330 L 615 285 L 635 260 L 600 220"/>
  </g>

  <!-- Floating Chakra Embers -->
  <g filter="url(#softGlow)">
    <circle cx="510" cy="280" r="3.5" fill="#67e8f9" class="e1"/>
    <circle cx="690" cy="300" r="3" fill="#d8b4fe" class="e2"/>
    <circle cx="580" cy="120" r="3.2" fill="#c084fc" class="e3"/>
    <circle cx="740" cy="200" r="2.5" fill="#38bdf8" class="e1"/>
    <circle cx="450" cy="220" r="3" fill="#f472b6" class="e2"/>
    <circle cx="650" cy="350" r="3.8" fill="#a855f7" class="e3"/>
  </g>

  <!-- ==================== LEFT WING TELEMETRY ==================== -->
  <g transform="translate(200, 200)" text-anchor="middle" font-family="'Segoe UI', sans-serif">
    <text font-family="monospace" font-size="11" fill="#c084fc" letter-spacing="3" font-weight="700">CHAKRA AFFINITY</text>
    <text y="28" font-size="22" font-weight="900" fill="#67e8f9">⚡ LIGHTNING / AI</text>
    <text y="48" font-size="12" fill="#94a3b8">Autonomous Agents &amp; 3D Web</text>
  </g>

  <!-- ==================== RIGHT WING TELEMETRY ==================== -->
  <g transform="translate(1000, 200)" text-anchor="middle" font-family="'Segoe UI', sans-serif">
    <text font-family="monospace" font-size="11" fill="#c084fc" letter-spacing="3" font-weight="700">SHINOBI CLASSIFICATION</text>
    <text y="28" font-size="22" font-weight="900" fill="#ffffff">🔱 S-RANK BUILDER</text>
    <text y="48" font-size="12" fill="#94a3b8">Leaf Village · 26 Public Repos</text>
  </g>

  <!-- ==================== BOTTOM CINEMATIC IDENTITY ==================== -->
  <!-- Top Category Chip -->
  <g transform="translate(600, 42)" text-anchor="middle">
    <text font-family="'Segoe UI', Roboto, monospace" font-size="13" font-weight="900" letter-spacing="8" fill="#c084fc">
      ✦ · 影 · THE SIX PATHS CHRONICLES · 忍 · ✦
    </text>
  </g>

  <!-- Main Hero Title -->
  <g transform="translate(600, 425)" text-anchor="middle" class="title-shimmer">
    <text font-family="'Segoe UI', -apple-system, sans-serif" font-weight="900" font-size="48" letter-spacing="5" fill="#ffffff">
      SAKTHI RENGANATHAN
    </text>
  </g>

  <!-- Subtitle -->
  <g transform="translate(600, 465)" text-anchor="middle">
    <text font-family="'Segoe UI', monospace, sans-serif" font-weight="800" font-size="14" letter-spacing="5" fill="#67e8f9">
      FULL-STACK DEVELOPER · AI BUILDER · SHINOBI
    </text>
  </g>

  <!-- Narrative Statement -->
  <g transform="translate(600, 498)" text-anchor="middle">
    <text font-family="'Segoe UI', -apple-system, sans-serif" font-size="13" fill="#cbd5e1" letter-spacing="2">
      CHANNELING CHAKRA INTO INTELLIGENT SYSTEMS, AUTONOMOUS AGENTS &amp; 3D EXPERIENCES
    </text>
  </g>
</svg>`;

fs.writeFileSync(path.resolve('assets', 'hero.svg'), heroSvg, 'utf8');
console.log('Successfully generated unified assets/hero.svg with integrated avatar!');

