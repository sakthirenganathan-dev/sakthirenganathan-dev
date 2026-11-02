import fs from 'fs';
import path from 'path';

const USERNAME = 'sakthirenganathan-dev';
const CACHE_FILE = path.resolve('assets', 'telemetry-cache.json');
const OUTPUT_SVG = path.resolve('assets', 'id-dashboard.svg');

async function fetchGitHubData() {
  console.log(`Fetching live GitHub data for ${USERNAME}...`);
  
  const headers = {
    'User-Agent': 'Shinobi-Profile-Updater',
    'Accept': 'application/vnd.github.v3+json',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  let userRes;
  let reposRes;
  try {
    [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${USERNAME}`, { headers }),
      fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`, { headers }),
    ]);
  } catch (netErr) {
    console.warn(`[WARN] Network error fetching GitHub data: ${netErr.message}`);
    return getCachedOrFallbackData('NETWORK_OFFLINE');
  }

  if (userRes.status === 403 || reposRes.status === 403) {
    console.warn('[WARN] GitHub API rate limit reached (HTTP 403). Using cached telemetry data.');
    return getCachedOrFallbackData('RATE_LIMITED');
  }

  if (!userRes.ok) {
    console.warn(`[WARN] Failed to fetch user data: ${userRes.status} ${userRes.statusText}`);
    return getCachedOrFallbackData(`HTTP_${userRes.status}`);
  }

  const user = await userRes.json();
  const repos = reposRes.ok ? await reposRes.json() : [];

  let totalStars = 0;
  let totalForks = 0;
  const langMap = {};

  repos.forEach((r) => {
    totalStars += (r.stargazers_count ?? 0);
    totalForks += (r.forks_count ?? 0);
    if (r.language) {
      langMap[r.language] = (langMap[r.language] || 0) + 1;
    }
  });

  const sortedLangs = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([l]) => l);

  const latestRepo = repos.length > 0 ? repos[0] : null;
  const latestRepoName = latestRepo ? latestRepo.name : 'VisionMate-AI';
  const latestRepoTime = latestRepo ? new Date(latestRepo.pushed_at).toISOString().split('T')[0] : 'Today';

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

  const freshData = {
    publicRepos: typeof user.public_repos === 'number' ? user.public_repos : (repos.length || 26),
    followers: typeof user.followers === 'number' ? user.followers : 0,
    totalStars,
    totalForks,
    topLangs: sortedLangs.length > 0 ? sortedLangs : ['TypeScript', 'JavaScript', 'Python', 'Dart'],
    latestRepoName,
    latestRepoTime,
    lastSynced: now,
    status: 'LIVE_OK',
  };

  // Cache last successful data
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(freshData, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not write cache file:', err.message);
  }

  return freshData;
}

function getCachedOrFallbackData(reason) {
  if (fs.existsSync(CACHE_FILE)) {
    try {
      const cached = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      console.log(`[INFO] Restored telemetry from local cache (${reason})`);
      cached.status = reason;
      return cached;
    } catch (e) {
      // ignore
    }
  }

  return {
    publicRepos: 26,
    followers: 0,
    totalStars: 1,
    totalForks: 0,
    topLangs: ['TypeScript', 'JavaScript', 'Python', 'Dart'],
    latestRepoName: 'sakthirenganathan-dev',
    latestRepoTime: '2026-11-02',
    lastSynced: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
    status: reason,
  };
}

function generateTelemetrySvg(data) {
  const langsStr = data.topLangs.join(' · ');
  const statusLabel = data.status === 'LIVE_OK' 
    ? 'AUTOMATICALLY SYNCHRONIZED' 
    : `CACHED (${data.status})`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="260" viewBox="0 0 1200 260" role="img" aria-label="Shinobi Live Holographic Telemetry">
  <defs>
    <radialGradient id="teleBg" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="#180a36" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#0a0317" stop-opacity="0.98"/>
      <stop offset="100%" stop-color="#030008" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="headbandPlate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#475569"/><stop offset="25%" stop-color="#94a3b8"/><stop offset="50%" stop-color="#cbd5e1"/><stop offset="75%" stop-color="#64748b"/><stop offset="100%" stop-color="#334155"/>
    </linearGradient>
    <linearGradient id="laserLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#67e8f9" stop-opacity="0"/>
      <stop offset="50%" stop-color="#a855f7" stop-opacity="1"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="scanBeamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0"/>
      <stop offset="30%" stop-color="#67e8f9" stop-opacity="0.35"/>
      <stop offset="70%" stop-color="#a855f7" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#7c3aed" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="chakraPlateGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#c084fc" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#22c55e" stop-opacity="0.6"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="plateAura" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      @keyframes sweepLaser { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      @keyframes blinkBeacon { 0%, 100% { opacity: 0.35; transform: scale(0.9); } 50% { opacity: 1; transform: scale(1.15); filter: drop-shadow(0 0 8px #22c55e); } }
      @keyframes scanSweep {
        0% { transform: translateX(60px); opacity: 0; }
        15% { opacity: 0.45; }
        85% { opacity: 0.45; }
        100% { transform: translateX(1100px); opacity: 0; }
      }
      @keyframes chakraBreathe {
        0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 3px #a855f7); }
        50% { opacity: 0.9; filter: drop-shadow(0 0 10px #06b6d4); }
      }
      @keyframes pipPulse1 { 0%, 100% { opacity: 0.3; } 33% { opacity: 1; } }
      @keyframes pipPulse2 { 0%, 100% { opacity: 0.3; } 66% { opacity: 1; } }
      @keyframes pipPulse3 { 0%, 100% { opacity: 0.3; } 99% { opacity: 1; } }

      .laser { animation: sweepLaser 5s linear infinite; }
      .beacon { animation: blinkBeacon 2.2s ease-in-out infinite; transform-origin: 920px 109px; }
      .scan-line { animation: scanSweep 6s ease-in-out infinite; }
      .chakra-plate { animation: chakraBreathe 4s ease-in-out infinite; }
      .pip-1 { animation: pipPulse1 2s infinite; }
      .pip-2 { animation: pipPulse2 2s infinite; }
      .pip-3 { animation: pipPulse3 2s infinite; }

      @media (prefers-reduced-motion: reduce) {
        .laser, .beacon, .scan-line, .chakra-plate, .pip-1, .pip-2, .pip-3 {
          animation: none !important;
        }
      }
    </style>
  </defs>

  <rect width="1200" height="260" fill="url(#teleBg)"/>

  <!-- Subtle Cyan Scanning Line (Radar Sweep) -->
  <rect x="0" y="20" width="3" height="220" fill="url(#scanBeamGrad)" class="scan-line" opacity="0.4"/>

  <!-- Top Floating Header -->
  <g transform="translate(600, 36)" text-anchor="middle">
    <text font-family="monospace" font-size="12" fill="#c084fc" letter-spacing="4" font-weight="700">
      01 // LIVE SHINOBI INTELLIGENCE TELEMETRY · ${statusLabel}
    </text>
  </g>

  <!-- Horizontal Laser Guideline -->
  <line x1="60" y1="130" x2="1140" y2="130" stroke="#3b0764" stroke-width="1.5"/>
  <line x1="60" y1="130" x2="400" y2="130" stroke="url(#laserLine)" stroke-width="2.5" class="laser" filter="url(#glow)"/>

  <!-- Center Leaf Village Headband Plate with Subtle Chakra Pulse -->
  <g transform="translate(600, 130)">
    <!-- Breathing Chakra Aura behind Headband -->
    <rect x="-143" y="-27" width="286" height="54" rx="10" fill="none" stroke="url(#chakraPlateGlow)" stroke-width="1.5" class="chakra-plate"/>

    <g transform="translate(-140, -24)">
      <rect width="280" height="48" rx="8" fill="url(#headbandPlate)" stroke="#1e293b" stroke-width="2"/>
      <circle cx="10" cy="14" r="2.2" fill="#1e293b"/>
      <circle cx="10" cy="34" r="2.2" fill="#1e293b"/>
      <circle cx="270" cy="14" r="2.2" fill="#1e293b"/>
      <circle cx="270" cy="34" r="2.2" fill="#1e293b"/>
      <path d="M 140 18 C 133 20 129 26 133 32 C 137 37 145 35 147 30 C 148 26 143 24 140 27 C 138 29 141 31 143 30 M 147 33 L 155 37" fill="none" stroke="#0f172a" stroke-width="2.2" stroke-linecap="round"/>
    </g>
    <text y="46" font-family="'Segoe UI', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle" letter-spacing="2">
      SAKTHI RENGANATHAN · S-RANK
    </text>
    <text y="64" font-family="monospace" font-size="10" fill="#67e8f9" text-anchor="middle" letter-spacing="1">
      TOP CHAKRA: ${langsStr}
    </text>
  </g>

  <!-- Left Live Telemetry: Repositories & Stars & Followers -->
  <g transform="translate(200, 115)" text-anchor="middle" font-family="'Segoe UI', sans-serif">
    <!-- Subtle Chakra Activity Indicators -->
    <g transform="translate(-80, -14)">
      <circle cx="0" cy="0" r="2" fill="#06b6d4" class="pip-1"/>
      <circle cx="6" cy="0" r="2" fill="#a855f7" class="pip-2"/>
      <circle cx="12" cy="0" r="2" fill="#22c55e" class="pip-3"/>
    </g>
    <text font-family="monospace" font-size="11" fill="#a78bfa" letter-spacing="2">PUBLIC REPOSITORIES</text>
    <text y="28" font-size="28" font-weight="900" fill="#ffffff">${data.publicRepos}</text>
    <text y="48" font-family="monospace" font-size="11" fill="#38bdf8">EARNED STARS: ${data.totalStars} · FOLLOWERS: ${data.followers}</text>
  </g>

  <!-- Right Live Telemetry: Latest Commit & Sync Time -->
  <g transform="translate(1000, 115)" text-anchor="middle" font-family="'Segoe UI', sans-serif">
    <circle cx="-80" cy="-6" r="4.5" fill="#22c55e" class="beacon"/>
    <text font-family="monospace" font-size="11" fill="#86efac" letter-spacing="2">LATEST ACTIVE SCROLL</text>
    <text y="24" font-size="17" font-weight="900" fill="#ffffff">${data.latestRepoName}</text>
    <text y="44" font-family="monospace" font-size="11" fill="#cbd5e1">PUSHED: ${data.latestRepoTime}</text>
  </g>

  <!-- Bottom Live Broadcast Telemetry Timestamp -->
  <g transform="translate(600, 235)" text-anchor="middle">
    <text font-family="monospace" font-size="11" fill="#64748b" letter-spacing="2">
      LAST TELEMETRY SYNC: <tspan fill="#a855f7">${data.lastSynced}</tspan> // LIVE GITHUB ACTION DISPATCH
    </text>
  </g>
</svg>`;
}

async function run() {
  try {
    const data = await fetchGitHubData();
    console.log('GitHub Data:', data);
    const svg = generateTelemetrySvg(data);
    fs.writeFileSync(OUTPUT_SVG, svg, 'utf8');
    console.log(`Successfully generated and updated ${OUTPUT_SVG}`);
  } catch (err) {
    console.error('Error updating live telemetry:', err);
    process.exit(1);
  }
}

run();
