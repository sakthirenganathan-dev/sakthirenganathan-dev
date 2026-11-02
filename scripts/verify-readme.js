import fs from 'fs';

const content = fs.readFileSync('README.md', 'utf8');

const localAssets = [
  'assets/hero.svg',
  'assets/sakthi-shinobi-avatar.png',
  'assets/id-dashboard.svg',
  'profile-3d-contrib/profile-night-view.svg',
  'assets/connect.svg',
];

console.log('--- Verifying Local Assets Referenced in README.md ---');
let allExist = true;
for (const asset of localAssets) {
  const exists = fs.existsSync(asset);
  console.log(`${exists ? '✓' : '✗'} ${asset}: ${exists ? 'EXISTS' : 'MISSING'}`);
  if (!exists) allExist = false;
  if (!content.includes(asset)) {
    console.warn(`[WARN] Asset ${asset} not referenced in README.md`);
  }
}

console.log('\n--- Section Header Verification ---');
const requiredSections = [
  'assets/hero.svg',
  '影 · SAKTHI RENGANATHAN · 六道 SHINOBI ARCHITECT',
  '## ✦ 01 // ABOUT ME (THE WAY OF THE CODE SHINOBI)',
  '## ⚡ 02 // AUTHENTIC TECHNOLOGY JUTSU ARSENAL',
  '## 📜 03 // SELECTED REAL REPOSITORIES (S-RANK SECRET SCROLLS)',
  '## 📊 04 // DYNAMIC GITHUB INTELLIGENCE TELEMETRY',
  '## 🌃 05 // CONTRIBUTION ACTIVITY (HIDDEN LEAF 3D SKYLINE)',
  '## 🌀 06 // SUMMONING ALLIANCE (KUCHIYOSE NO JUTSU)',
];

for (const sec of requiredSections) {
  const hasSec = content.includes(sec);
  console.log(`${hasSec ? '✓' : '✗'} Section found: ${sec.substring(0, 50)}`);
  if (!hasSec) allExist = false;
}

console.log('\n--- Constraint Verifications ---');
const hasPortfolioLinkInConnect = content.substring(content.indexOf('SUMMONING ALLIANCE')).includes('vercel.app');
console.log(`Portfolio link in Connect section: ${hasPortfolioLinkInConnect ? 'FAIL (still present)' : 'PASS (removed)'}`);

const hasJavaInTech = content.includes('logo=openjdk') || content.includes('badge/Java-');
console.log(`Java in Tech Arsenal: ${hasJavaInTech ? 'FAIL (unverified tech present)' : 'PASS (only verified tech)'}`);

if (allExist && !hasPortfolioLinkInConnect && !hasJavaInTech) {
  console.log('\n>>> ALL VERIFICATION CHECKS PASSED SUCCESSFULLY! <<<');
} else {
  console.error('\n>>> SOME VERIFICATION CHECKS FAILED! <<<');
  process.exit(1);
}

