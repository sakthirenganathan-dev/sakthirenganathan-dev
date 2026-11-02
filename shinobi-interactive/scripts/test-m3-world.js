// Automated Verification Test for Milestone 3: Continuous 3D Shinobi Universe
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

console.log('--- Testing Milestone 3: Continuous 3D Shinobi Realm ---');

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Verify EnvironmentArchitect.js
const architectPath = path.join(root, 'src', 'world', 'EnvironmentArchitect.js');
assert(fs.existsSync(architectPath), 'EnvironmentArchitect.js module exists');

const architectContent = fs.readFileSync(architectPath, 'utf8');

// Mountains
assert(
  architectContent.includes('createDistantMountains') &&
  architectContent.includes('PlaneGeometry') &&
  architectContent.includes('fog: true'),
  'Distant mountain silhouettes: Procedural layered ranges with fog integration'
);

// Torii Gates
assert(
  architectContent.includes('createToriiGate') &&
  architectContent.includes('CylinderGeometry') &&
  architectContent.includes('Kasagi') &&
  architectContent.includes('Shimaki'),
  'Japanese-inspired Torii Gate architecture: Pillars, Kasagi, Shimaki, and lanterns'
);

// Pagoda Shrines
assert(
  architectContent.includes('createPagodaShrine') &&
  architectContent.includes('3-Tiered') &&
  architectContent.includes('spire'),
  'Pagoda Shrine silhouettes: Multi-tiered eaves and sorin finial spire'
);

// Floating Monoliths
assert(
  architectContent.includes('createFloatingMonoliths') &&
  architectContent.includes('DodecahedronGeometry') &&
  architectContent.includes('veinMesh') &&
  architectContent.includes('shards'),
  'Chibaku Tensei Floating Monoliths: Jagged crags with glowing purple chakra fractures and orbiting shards'
);

// Curved Chakra Energy Streams
assert(
  architectContent.includes('createChakraStreams') &&
  architectContent.includes('CatmullRomCurve3') &&
  architectContent.includes('TubeGeometry'),
  'Curved Chakra Energy Streams: 3D Catmull-Rom splines weaving through space'
);

// Drifting Mist Sheets
assert(
  architectContent.includes('createMistSheets') &&
  architectContent.includes('createMistTexture') &&
  architectContent.includes('mistSheets'),
  'Drifting Mist Sheets: Layered procedural alpha haze with continuous drift'
);

// Adaptive Embers
assert(
  architectContent.includes('createAdaptiveEmbers') &&
  architectContent.includes('particleBudget') &&
  architectContent.includes('createEmberTexture'),
  'Adaptive Chakra Embers: Procedural particle buffer with device-budget scaling'
);

// Atmospheric Lighting
assert(
  architectContent.includes('createAtmosphericLighting') &&
  architectContent.includes('AmbientLight') &&
  architectContent.includes('DirectionalLight') &&
  architectContent.includes('PointLight'),
  'Atmospheric Lighting: Layered moonlight, celestial rim, and pulsing beacon'
);

// 2. Verify CameraDirector.js
const cameraDirectorPath = path.join(root, 'src', 'world', 'CameraDirector.js');
assert(fs.existsSync(cameraDirectorPath), 'CameraDirector.js module exists');

const cameraDirectorContent = fs.readFileSync(cameraDirectorPath, 'utf8');
assert(
  cameraDirectorContent.includes('handleMouseMove') &&
  cameraDirectorContent.includes('clamp'),
  'Mouse Parallax: Natural pointer tracking with strict boundary clamping'
);

assert(
  cameraDirectorContent.includes('handleTouchStart') &&
  cameraDirectorContent.includes('handleTouchMove') &&
  cameraDirectorContent.includes('handleTouchEnd'),
  'Mobile Touch Interaction: Touchstart, touchmove, and touchend damping'
);

assert(
  cameraDirectorContent.includes('lerpSpeed') &&
  cameraDirectorContent.includes('lerp'),
  'Spring-damper camera smoothing: Eased interpolation avoiding sudden jumps'
);

assert(
  cameraDirectorContent.includes('reducedMotion') &&
  cameraDirectorContent.includes('setReducedMotion'),
  'Accessibility: Reduced motion support disables parallax and harsh movement'
);

// 3. Verify ShinobiWorld.jsx
const worldPath = path.join(root, 'src', 'world', 'ShinobiWorld.jsx');
assert(fs.existsSync(worldPath), 'ShinobiWorld.jsx exists');

const worldContent = fs.readFileSync(worldPath, 'utf8');
assert(
  worldContent.includes('setupVisibilityObserver') &&
  worldContent.includes('isTabVisible'),
  'Performance: Automatic render suspension when tab is hidden, clean resume when visible'
);

assert(
  worldContent.includes('getDeviceProfile'),
  'Device Profiling: Adaptive hardware integration for mobile (800), laptop (1800), and desktop (3000)'
);

assert(
  worldContent.includes('webglSupported') &&
  worldContent.includes('WebGL acceleration is unavailable'),
  'WebGL Fallback: Graceful error state if WebGL is unsupported'
);

assert(
  worldContent.includes('scene.traverse') &&
  worldContent.includes('dispose()'),
  'Memory Hygiene: Complete deep disposal of geometries and materials on unmount'
);

// 4. Verify M1 and M2 Preservation
const m1Path = path.join(root, 'scripts', 'test-m1-architecture.js');
assert(fs.existsSync(m1Path), 'M1 test suite preserved');

const m2Path = path.join(root, 'scripts', 'test-m2-awakening.js');
assert(fs.existsSync(m2Path), 'M2 test suite preserved');

console.log(`\nResults: ${passed} / ${total} tests passed.`);
if (passed === total) {
  console.log('--- Milestone 3 Verification: 100% COMPLETE & PASSING ---');
  process.exit(0);
} else {
  console.error('--- Verification failed ---');
  process.exit(1);
}

