const fs = require('fs');

const content = fs.readFileSync('assets/hero.svg', 'utf8');

// Check key elements
const requiredElements = [
  'viewBox="0 0 1280 440"',
  'SAKTHI RENGANATHAN',
  'six-paths.shinobi/sakthi | dev',
  'Full-Stack Developer',
  'AI Application Developer',
  'Computer Vision',
  'Creative Frontend',
  'LIGHTNING / AI',
  'HIDDEN LEAF',
  'SHINOBI BUILDER',
  'SYS.CORE // RINNEGAN_HUD.SHINOBI',
  'CHAKRA RESONANCE',
  'data:image/jpeg;base64'
];

for (const req of requiredElements) {
  if (content.includes(req)) {
    console.log(`✓ Required element present: ${req.substring(0, 40)}`);
  } else {
    console.error(`✗ Missing required element: ${req}`);
    process.exit(1);
  }
}

console.log('\n>>> HERO.SVG VALIDATION PASSED COMPLETELY! <<<');
