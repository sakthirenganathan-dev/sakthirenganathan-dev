const fs = require('fs');

const avatarUri = fs.readFileSync('scripts/avatar-uri.tmp', 'utf8').trim();

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1280 440" width="1280" height="440" role="img" aria-label="Sakthi Renganathan — Six Paths Shinobi Console">
  <title>Sakthi Renganathan — Six Paths Shinobi Console</title>
  <desc>Futuristic Shinobi developer console featuring interactive terminal on the left and animated Rinnegan neural monitor with Sakthi's portrait on the right.</desc>
  <defs>
    <!-- Background Space Atmosphere -->
    <radialGradient id="spaceAtmosphere" cx="50%" cy="50%" r="75%">
      <stop offset="0%" stop-color="#140628" stop-opacity="0.95"/>
      <stop offset="45%" stop-color="#0a0318" stop-opacity="0.98"/>
      <stop offset="85%" stop-color="#04010a" stop-opacity="1"/>
      <stop offset="100%" stop-color="#020006" stop-opacity="1"/>
    </radialGradient>

    <!-- Glass Panel Gradients -->
    <linearGradient id="termBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#110526" stop-opacity="0.92"/>
      <stop offset="50%" stop-color="#090217" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="#05010e" stop-opacity="0.98"/>
    </linearGradient>

    <linearGradient id="termBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.75"/>
      <stop offset="40%" stop-color="#7c3aed" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="#06b6d4" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#22c55e" stop-opacity="0.6"/>
    </linearGradient>

    <linearGradient id="monBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090217" stop-opacity="0.94"/>
      <stop offset="60%" stop-color="#05010e" stop-opacity="0.97"/>
      <stop offset="100%" stop-color="#020006" stop-opacity="0.99"/>
    </linearGradient>

    <linearGradient id="monBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8"/>
      <stop offset="50%" stop-color="#a855f7" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#c084fc" stop-opacity="0.75"/>
    </linearGradient>

    <!-- Glowing Typography Gradient -->
    <linearGradient id="nameGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="25%" stop-color="#f5f3ff"/>
      <stop offset="60%" stop-color="#c084fc"/>
      <stop offset="85%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#67e8f9"/>
    </linearGradient>

    <!-- Rinnegan Aura Gradients -->
    <radialGradient id="rinneganCoreAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c084fc" stop-opacity="0.7"/>
      <stop offset="35%" stop-color="#7c3aed" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="#06b6d4" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#020006" stop-opacity="0"/>
    </radialGradient>

    <radialGradient id="orbGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="30%" stop-color="#c084fc" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#3b0764" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#05010e" stop-opacity="0"/>
    </radialGradient>

    <linearGradient id="chakraBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="40%" stop-color="#a855f7"/>
      <stop offset="70%" stop-color="#06b6d4"/>
      <stop offset="100%" stop-color="#22c55e"/>
    </linearGradient>

    <!-- Ambient Grid Pattern -->
    <pattern id="cyberGrid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#a855f7" stroke-width="0.5" stroke-opacity="0.08"/>
      <circle cx="0" cy="0" r="1" fill="#67e8f9" fill-opacity="0.2"/>
    </pattern>

    <!-- Filters -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="electricGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="6" result="blur1"/>
      <feGaussianBlur stdDeviation="2" result="blur2"/>
      <feMerge>
        <feMergeNode in="blur1"/>
        <feMergeNode in="blur2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="avatarGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="10" flood-color="#a855f7" flood-opacity="0.6"/>
    </filter>

    <!-- Circular Avatar Clip -->
    <clipPath id="avatarClip">
      <circle cx="980" cy="205" r="74"/>
    </clipPath>

    <!-- Embedded Keyframe Styles -->
    <style>
      @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
      @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes spinCCW { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
      @keyframes pulseAura { 0%, 100% { transform: scale(1); opacity: 0.75; } 50% { transform: scale(1.06); opacity: 0.95; } }
      @keyframes pulseBar { 0%, 100% { opacity: 0.85; } 50% { opacity: 1; filter: drop-shadow(0 0 8px #06b6d4); } }

      .cursor-blink { animation: blink 1.1s step-end infinite; }
      .spin-ring-cw { animation: spinCW 42s linear infinite; transform-origin: 980px 205px; }
      .spin-ring-ccw { animation: spinCCW 32s linear infinite; transform-origin: 980px 205px; }
      .pulse-core { animation: pulseAura 4.5s ease-in-out infinite; transform-origin: 980px 205px; }
      .spin-shuriken { animation: spinCW 3.5s linear infinite; transform-origin: 1210px 384px; }
      .pulse-bar { animation: pulseBar 3s ease-in-out infinite; }

      /* Standard Typography */
      .f-mono { font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace; }
      .f-sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    </style>
  </defs>

  <!-- ==================== BACKGROUND CANVAS ==================== -->
  <rect width="1280" height="440" fill="url(#spaceAtmosphere)"/>
  <rect width="1280" height="440" fill="url(#cyberGrid)"/>

  <!-- Giant Japanese Kanji Watermarks -->
  <text x="360" y="270" class="f-sans" font-weight="900" font-size="220" fill="#a855f7" opacity="0.025" text-anchor="middle">六道</text>
  <text x="980" y="270" class="f-sans" font-weight="900" font-size="240" fill="#06b6d4" opacity="0.02" text-anchor="middle">忍</text>

  <!-- Horizontal Energy Streamers -->
  <path d="M 0 110 Q 320 80 640 110 T 1280 110" fill="none" stroke="#7c3aed" stroke-width="1" opacity="0.2"/>
  <path d="M 0 330 Q 360 360 720 330 T 1280 330" fill="none" stroke="#06b6d4" stroke-width="1" opacity="0.15"/>

  <!-- ==================== LEFT PANEL: SHINOBI DEVELOPER TERMINAL ==================== -->
  <g transform="translate(44, 30)">
    <!-- Terminal Glass Card -->
    <rect width="644" height="380" rx="16" fill="url(#termBg)" stroke="url(#termBorder)" stroke-width="1.5" filter="url(#softGlow)"/>

    <!-- Terminal Header Bar -->
    <rect width="644" height="44" rx="16" fill="#140628" fill-opacity="0.8"/>
    <line x1="0" y1="44" x2="644" y2="44" stroke="#a855f7" stroke-opacity="0.25" stroke-width="1"/>

    <!-- Window Dots -->
    <circle cx="28" cy="22" r="5.5" fill="#f43f5e" fill-opacity="0.85"/>
    <circle cx="46" cy="22" r="5.5" fill="#fbbf24" fill-opacity="0.85"/>
    <circle cx="64" cy="22" r="5.5" fill="#22c55e" fill-opacity="0.85"/>

    <!-- Terminal Prompt Pill -->
    <rect x="86" y="11" width="310" height="23" rx="11.5" fill="#1e093b" stroke="#7c3aed" stroke-opacity="0.5" stroke-width="1"/>
    <text x="100" y="27" class="f-mono" font-size="11" font-weight="700" fill="#67e8f9" letter-spacing="1.2">&gt;_ six-paths.shinobi/sakthi | dev</text>
    <rect class="cursor-blink" x="382" y="16" width="6.5" height="13" rx="1.5" fill="#22c55e"/>

    <!-- Top Right Shinobi Village Badge -->
    <text x="620" y="27" class="f-mono" font-size="10.5" font-weight="800" fill="#c084fc" letter-spacing="1.5" text-anchor="end">木ノ葉 // KONOHA.SHINOBI</text>

    <!-- Terminal Body Content -->
    <!-- Greeting -->
    <text x="32" y="86" class="f-mono" font-size="13" font-weight="700" fill="#a855f7" letter-spacing="2">// IDENTITY ARCHIVE · S-07</text>
    <text x="32" y="114" class="f-sans" font-size="16" font-weight="600" fill="#94a3b8" letter-spacing="1">Hi, I'm</text>

    <!-- Main Identity Name -->
    <text x="32" y="164" class="f-sans" font-size="44" font-weight="900" fill="url(#nameGradient)" letter-spacing="0.5" filter="url(#electricGlow)">SAKTHI RENGANATHAN</text>

    <!-- Dynamic Cycling Animated Roles -->
    <g class="f-sans" font-size="20" font-weight="800">
      <!-- Role 1: Full-Stack Developer (Static Fallback Default = Visible) -->
      <text x="32" y="206" fill="#38bdf8" opacity="1">
        ⚡ Full-Stack Developer (React 19 · TS · Vite)
        <animate attributeName="opacity" values="1;1;0;0;0;0;0;0;1" keyTimes="0;0.21;0.25;0.50;0.71;0.75;0.96;0.99;1" dur="12s" repeatCount="indefinite" />
        <animate attributeName="y" values="206;206;200;212;212;212;212;212;206" keyTimes="0;0.21;0.25;0.50;0.71;0.75;0.96;0.99;1" dur="12s" repeatCount="indefinite" />
      </text>

      <!-- Role 2: AI Application Developer -->
      <text x="32" y="206" fill="#c084fc" opacity="0">
        🤖 AI Application Developer &amp; Systems Builder
        <animate attributeName="opacity" values="0;0;1;1;0;0;0;0;0" keyTimes="0;0.245;0.27;0.46;0.50;0.75;0.96;0.99;1" dur="12s" repeatCount="indefinite" />
        <animate attributeName="y" values="212;212;206;206;200;212;212;212;212" keyTimes="0;0.245;0.27;0.46;0.50;0.75;0.96;0.99;1" dur="12s" repeatCount="indefinite" />
      </text>

      <!-- Role 3: Computer Vision Developer -->
      <text x="32" y="206" fill="#34d399" opacity="0">
        👁️ Computer Vision &amp; Assistive Tech Developer
        <animate attributeName="opacity" values="0;0;0;0;1;1;0;0;0" keyTimes="0;0.25;0.495;0.52;0.71;0.75;0.96;0.99;1" dur="12s" repeatCount="indefinite" />
        <animate attributeName="y" values="212;212;212;212;206;206;200;212;212" keyTimes="0;0.25;0.495;0.52;0.71;0.75;0.96;0.99;1" dur="12s" repeatCount="indefinite" />
      </text>

      <!-- Role 4: Creative Frontend Developer -->
      <text x="32" y="206" fill="#f43f5e" opacity="0">
        🌀 Creative Frontend &amp; Shinobi UI Craftsman
        <animate attributeName="opacity" values="0;0;0;0;0;0;1;1;0" keyTimes="0;0.25;0.50;0.745;0.77;0.96;0.99;1;1" dur="12s" repeatCount="indefinite" />
        <animate attributeName="y" values="212;212;212;212;212;212;206;206;200" keyTimes="0;0.25;0.50;0.745;0.77;0.96;0.99;1;1" dur="12s" repeatCount="indefinite" />
      </text>
    </g>

    <!-- Professional Philosophy Sub-tagline -->
    <text x="32" y="242" class="f-sans" font-size="13" fill="#cbd5e1" letter-spacing="0.2">
      Channeling relentless shinobi discipline and precision into modern software craftsmanship.
    </text>
    <text x="32" y="262" class="f-sans" font-size="12.5" fill="#94a3b8" letter-spacing="0.2">
      Architecting modular clean code, edge computer vision, and resilient AI systems.
    </text>

    <!-- Skill / Status Glass Pills (Cleanly Aligned) -->
    <g transform="translate(32, 292)">
      <!-- Pill 1: LIGHTNING / AI -->
      <rect x="0" y="0" width="168" height="34" rx="10" fill="#1a0b38" stroke="#06b6d4" stroke-opacity="0.6" stroke-width="1.2"/>
      <g transform="translate(14, 21)">
        <!-- Lightning Glyph -->
        <path d="M 0 -7 L -4 1 L 0 1 L -2 7 L 4 -1 L 0 -1 Z" fill="#67e8f9"/>
        <text x="14" y="2" class="f-mono" font-size="10.5" font-weight="800" fill="#67e8f9" letter-spacing="1.2">LIGHTNING / AI</text>
      </g>

      <!-- Pill 2: HIDDEN LEAF -->
      <rect x="180" y="0" width="156" height="34" rx="10" fill="#0d2116" stroke="#22c55e" stroke-opacity="0.6" stroke-width="1.2"/>
      <g transform="translate(194, 21)">
        <!-- Leaf / Spiral Glyph -->
        <circle cx="2" cy="0" r="4.5" fill="none" stroke="#4ade80" stroke-width="1.4"/>
        <path d="M 2 -4.5 Q 6 -7 9 -4" fill="none" stroke="#4ade80" stroke-width="1.4"/>
        <text x="14" y="2" class="f-mono" font-size="10.5" font-weight="800" fill="#4ade80" letter-spacing="1.2">HIDDEN LEAF</text>
      </g>

      <!-- Pill 3: SHINOBI BUILDER -->
      <rect x="348" y="0" width="176" height="34" rx="10" fill="#200d3d" stroke="#c084fc" stroke-opacity="0.6" stroke-width="1.2"/>
      <g transform="translate(362, 21)">
        <!-- Kunai/Blade Glyph -->
        <path d="M 0 -7 L 3 0 L 0 7 L -3 0 Z" fill="#c084fc"/>
        <circle cx="0" cy="0" r="1.5" fill="#140628"/>
        <text x="14" y="2" class="f-mono" font-size="10.5" font-weight="800" fill="#e9d5ff" letter-spacing="1.2">SHINOBI BUILDER</text>
      </g>
    </g>

    <!-- Bottom Terminal Status Strip -->
    <g transform="translate(32, 354)">
      <circle cx="4" cy="0" r="3.5" fill="#22c55e"/>
      <text x="15" y="3.5" class="f-mono" font-size="10" font-weight="700" fill="#64748b" letter-spacing="1.2">
        CORE STATUS: 100% OPERATIONAL // REPOS: 26+ PUBLIC // BRANCH: MAIN
      </text>
    </g>
  </g>

  <!-- ==================== RIGHT PANEL: RINNEGAN NEURAL MONITOR ==================== -->
  <g transform="translate(712, 30)">
    <!-- Monitor Glass Card -->
    <rect width="524" height="380" rx="16" fill="url(#monBg)" stroke="url(#monBorder)" stroke-width="1.5" filter="url(#softGlow)"/>

    <!-- Monitor Header Bar -->
    <rect width="524" height="44" rx="16" fill="#0d031c" fill-opacity="0.85"/>
    <line x1="0" y1="44" x2="524" y2="44" stroke="#06b6d4" stroke-opacity="0.3" stroke-width="1"/>

    <!-- Window Dots -->
    <circle cx="28" cy="22" r="5.5" fill="#a855f7" fill-opacity="0.85"/>
    <circle cx="46" cy="22" r="5.5" fill="#06b6d4" fill-opacity="0.85"/>
    <circle cx="64" cy="22" r="5.5" fill="#22c55e" fill-opacity="0.85"/>

    <!-- Monitor Title -->
    <text x="86" y="27" class="f-mono" font-size="11.5" font-weight="800" fill="#f1f5f9" letter-spacing="1.5">
      SYS.CORE // RINNEGAN_HUD.SHINOBI
    </text>

    <!-- FPS / Loop Tag -->
    <text x="498" y="27" class="f-mono" font-size="10" font-weight="700" fill="#67e8f9" letter-spacing="1.2" text-anchor="end">
      60FPS · LIVE
    </text>

    <!-- ==================== CENTRAL RINNEGAN VORTEX & AVATAR ==================== -->
    <!-- Center coordinate inside monitor: cx = 262, cy = 175 -->
    <!-- (Global canvas coordinate: 712 + 262 = 974, 30 + 175 = 205) -->

    <!-- Outer Pulsing Chakra Halo -->
    <circle cx="262" cy="175" r="142" fill="url(#rinneganCoreAura)" class="pulse-core"/>

    <!-- Concentric Rinnegan Ripple Rings (Clockwise & Counter-Clockwise Rotations) -->
    <g>
      <!-- Ring 1: Outermost Dashed Ring -->
      <circle cx="262" cy="175" r="130" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="14 10" opacity="0.45" class="spin-ring-cw"/>

      <!-- Ring 2: Continuous Flow Ring -->
      <circle cx="262" cy="175" r="112" fill="none" stroke="#06b6d4" stroke-width="2" opacity="0.65" class="spin-ring-ccw"/>

      <!-- Ring 3: Concentric Purple Wave -->
      <circle cx="262" cy="175" r="95" fill="none" stroke="#c084fc" stroke-width="2.5" opacity="0.85"/>

      <!-- Ring 4: Inner Cyan Collar -->
      <circle cx="262" cy="175" r="80" fill="none" stroke="#67e8f9" stroke-width="3" filter="url(#electricGlow)"/>
    </g>

    <!-- 4 Orbiting Truth-Seeking Orbs (Gudōdama) around Ring (r = 112) -->
    <g class="spin-ring-cw">
      <!-- Orb 1 (Top) -->
      <circle cx="262" cy="63" r="8.5" fill="#0c0418" stroke="#c084fc" stroke-width="2.2" filter="url(#softGlow)"/>
      <circle cx="262" cy="63" r="3" fill="#67e8f9"/>

      <!-- Orb 2 (Right) -->
      <circle cx="374" cy="175" r="8.5" fill="#0c0418" stroke="#06b6d4" stroke-width="2.2" filter="url(#softGlow)"/>
      <circle cx="374" cy="175" r="3" fill="#c084fc"/>

      <!-- Orb 3 (Bottom) -->
      <circle cx="262" cy="287" r="8.5" fill="#0c0418" stroke="#c084fc" stroke-width="2.2" filter="url(#softGlow)"/>
      <circle cx="262" cy="287" r="3" fill="#67e8f9"/>

      <!-- Orb 4 (Left) -->
      <circle cx="150" cy="175" r="8.5" fill="#0c0418" stroke="#06b6d4" stroke-width="2.2" filter="url(#softGlow)"/>
      <circle cx="150" cy="175" r="3" fill="#c084fc"/>
    </g>

    <!-- FUSED AUTHENTIC SHINOBI AVATAR (CENTERED INSIDE RINNEGAN) -->
    <g filter="url(#avatarGlow)">
      <!-- Avatar Clip Definition for Monitor coordinates -->
      <clipPath id="monitorAvatarClip">
        <circle cx="262" cy="175" r="74"/>
      </clipPath>
      <image href="${avatarUri}" x="188" y="101" width="148" height="148" clip-path="url(#monitorAvatarClip)" preserveAspectRatio="xMidYMid slice"/>
    </g>

    <!-- Avatar Inner Rim Light -->
    <circle cx="262" cy="175" r="74" fill="none" stroke="#67e8f9" stroke-width="2.5" opacity="0.9" filter="url(#electricGlow)"/>

    <!-- ==================== LOWER HUD TELEMETRY & PROGRESS ==================== -->
    <g transform="translate(28, 318)">
      <!-- Chakra Resonance Header Line -->
      <text x="0" y="11" class="f-mono" font-size="11" font-weight="700" fill="#c084fc" letter-spacing="1.4">CHAKRA RESONANCE</text>
      <text x="468" y="11" class="f-mono" font-size="11" font-weight="800" fill="#22c55e" letter-spacing="1.2" text-anchor="end">100% SYNCHRONIZED</text>

      <!-- Animated Chakra Frequency Scrubber Bar -->
      <rect x="0" y="20" width="468" height="6.5" rx="3.25" fill="#190a33" stroke="#7c3aed" stroke-opacity="0.4" stroke-width="1"/>
      <rect class="pulse-bar" x="0" y="20" width="468" height="6.5" rx="3.25" fill="url(#chakraBarGrad)">
        <animate attributeName="width" values="180;468;468;180" keyTimes="0;0.52;0.92;1" dur="7.5s" repeatCount="indefinite"/>
      </rect>

      <!-- Sub-Bar Metadata & Spinning Shuriken -->
      <g transform="translate(0, 48)">
        <text x="0" y="0" class="f-mono" font-size="10" font-weight="600" fill="#64748b" letter-spacing="1.2">
          FREQ: 432.8 THz // TELEMETRY: REAL-TIME GITHUB API
        </text>

        <!-- Spinning 4-Point Shuriken Graphic in Bottom Right -->
        <g transform="translate(458, -4)">
          <g class="spin-shuriken">
            <path d="M 0 -9 L 2.8 -2.8 L 9 0 L 2.8 2.8 L 0 9 L -2.8 2.8 L -9 0 L -2.8 -2.8 Z" fill="#c084fc" stroke="#67e8f9" stroke-width="1"/>
            <circle r="2" fill="#0a0218" stroke="#67e8f9" stroke-width="0.8"/>
            <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="4s" repeatCount="indefinite"/>
          </g>
        </g>
      </g>
    </g>
  </g>
</svg>
`;

fs.writeFileSync('assets/hero.svg', svgContent, 'utf8');
console.log('Successfully generated assets/hero.svg! Total size:', svgContent.length);
