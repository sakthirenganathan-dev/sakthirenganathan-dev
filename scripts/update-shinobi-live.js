import fs from 'fs';
import path from 'path';

const USERNAME = 'sakthirenganathan-dev';

async function fetchGitHubData() {
  console.log(`Fetching live GitHub data for ${USERNAME}...`);
  
  const headers = {
    'User-Agent': 'Shinobi-Profile-Updater',
  };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${USERNAME}`, { headers }),
    fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`, { headers }),
  ]);

  if (!userRes.ok) {
    throw new Error(`Failed to fetch user data: ${userRes.status} ${userRes.statusText}`);
  }

  const user = await userRes.json();
  const repos = reposRes.ok ? await reposRes.json() : [];

  let totalStars = 0;
  let totalForks = 0;
  const langMap = {};

  repos.forEach((r) => {
    totalStars += r.stargazers_count || 0;
    totalForks += r.forks_count || 0;
    if (r.language) {
      langMap[r.language] = (langMap[r.language] || 0) + 1;
    }
  });

  const sortedLangs = Object.entries(langMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([l]) => l);

  const latestRepo = repos.length > 0 ? repos[0] : null;
  const latestRepoName = latestRepo ? latestRepo.name : 'SHINOBI';
  const latestRepoTime = latestRepo ? new Date(latestRepo.pushed_at).toISOString().split('T')[0] : 'Today';

  const now = new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC';

  return {
    publicRepos: user.public_repos || repos.length || 12,
    followers: user.followers || 4,
    totalStars,
    totalForks,
    topLangs: sortedLangs.length > 0 ? sortedLangs : ['JavaScript', 'Python', 'Java', 'HTML'],
    latestRepoName,
    latestRepoTime,
    lastSynced: now,
  };
}

function generateTelemetrySvg(data) {
  const langsStr = data.topLangs.join(' · ');

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
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="5" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <style>
      @keyframes sweepLaser { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      @keyframes blinkBeacon { 0%, 100% { opacity: 0.3; } 50% { opacity: 1; filter: drop-shadow(0 0 8px #22c55e); } }
      .laser { animation: sweepLaser 5s linear infinite; }
      .beacon { animation: blinkBeacon 2s infinite; }
    </style>
  </defs>

  <rect width="1200" height="260" fill="url(#teleBg)"/>

  <!-- Top Floating Header -->
  <g transform="translate(600, 36)" text-anchor="middle">
    <text font-family="monospace" font-size="12" fill="#c084fc" letter-spacing="4" font-weight="700">
      01 // LIVE SHINOBI INTELLIGENCE TELEMETRY · AUTOMATICALLY SYNCHRONIZED
    </text>
  </g>

  <!-- Horizontal Laser Guideline -->
  <line x1="60" y1="130" x2="1140" y2="130" stroke="#3b0764" stroke-width="1.5"/>
  <line x1="60" y1="130" x2="400" y2="130" stroke="url(#laserLine)" stroke-width="2.5" class="laser" filter="url(#glow)"/>

  <!-- Center Leaf Village Headband Plate -->
  <g transform="translate(600, 130)">
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

  <!-- Left Live Telemetry: Repositories & Stars -->
  <g transform="translate(200, 115)" text-anchor="middle" font-family="'Segoe UI', sans-serif">
    <text font-family="monospace" font-size="11" fill="#a78bfa" letter-spacing="2">PUBLIC REPOSITORIES</text>
    <text y="28" font-size="28" font-weight="900" fill="#ffffff">${data.publicRepos}</text>
    <text y="48" font-family="monospace" font-size="11" fill="#38bdf8">EARNED STARS: ${data.totalStars}</text>
  </g>

  <!-- Right Live Telemetry: Latest Commit & Sync Time -->
  <g transform="translate(1000, 115)" text-anchor="middle" font-family="'Segoe UI', sans-serif">
    <circle cx="-80" cy="-6" r="4" fill="#22c55e" class="beacon"/>
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
    const outputPath = path.resolve('assets', 'id-dashboard.svg');
    fs.writeFileSync(outputPath, svg, 'utf8');
    console.log(`Successfully generated and updated ${outputPath}`);
  } catch (err) {
    console.error('Error updating live telemetry:', err);
    process.exit(1);
  }
}

run();

