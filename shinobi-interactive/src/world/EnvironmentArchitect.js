import * as THREE from 'three';

/**
 * Procedural Canvas Texture Generator for Soft Circular Embers and Mist
 * Zero external asset dependencies — guaranteed instantaneous loading.
 */
function createEmberTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(192, 132, 252, 0.85)');
  gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createMistTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Multi-octave radial soft haze
  const gradient = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(88, 28, 135, 0.35)');
  gradient.addColorStop(0.4, 'rgba(30, 8, 56, 0.22)');
  gradient.addColorStop(0.8, 'rgba(10, 3, 23, 0.08)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * 1. Distant Mountain Silhouette Ranges
 * Procedurally generated layered mountain planes at the horizon with vertex elevation waves.
 */
export function createDistantMountains(scene) {
  const mountainGroup = new THREE.Group();
  mountainGroup.name = 'distantMountains';

  const layers = [
    { z: -380, width: 900, height: 160, y: -25, segments: 120, color: 0x16072e, opacity: 0.85, amp: 28 },
    { z: -480, width: 1100, height: 210, y: -15, segments: 140, color: 0x0f0420, opacity: 0.92, amp: 42 },
    { z: -580, width: 1300, height: 260, y: 0, segments: 160, color: 0x070112, opacity: 0.98, amp: 58 },
  ];

  layers.forEach((l, layerIdx) => {
    const geo = new THREE.PlaneGeometry(l.width, l.height, l.segments, 1);
    const pos = geo.attributes.position;

    // Displace upper vertices to form jagged anime peaks
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y > 0) {
        const x = pos.getX(i);
        // Harmonic sum of sine waves for natural mountainous jaggedness
        const peakDisplacement =
          Math.sin(x * 0.015 + layerIdx * 1.7) * (l.amp * 0.6) +
          Math.sin(x * 0.038 - layerIdx * 0.9) * (l.amp * 0.3) +
          Math.sin(x * 0.082 + layerIdx * 2.1) * (l.amp * 0.1);
        pos.setY(i, y + peakDisplacement);
      }
    }
    geo.computeVertexNormals();

    const mat = new THREE.MeshBasicMaterial({
      color: l.color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: l.opacity,
      fog: true,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(0, l.y, l.z);
    mountainGroup.add(mesh);
  });

  scene.add(mountainGroup);
  return mountainGroup;
}

/**
 * 2. Japanese-Inspired Torii Gates (Original Procedural Architecture)
 * Multi-beam sacred gate framing the camera path.
 */
export function createToriiGate(x, y, z, scale = 1.0, color = 0x2e0854, glowColor = 0xc084fc) {
  const torii = new THREE.Group();
  torii.position.set(x, y, z);
  torii.scale.set(scale, scale, scale);

  const pillarMat = new THREE.MeshStandardMaterial({
    color: color,
    roughness: 0.7,
    metalness: 0.2,
  });

  const beamMat = new THREE.MeshStandardMaterial({
    color: 0x1a0433,
    roughness: 0.5,
    metalness: 0.4,
  });

  const glowMat = new THREE.MeshBasicMaterial({
    color: glowColor,
    wireframe: true,
    transparent: true,
    opacity: 0.5,
  });

  // Pillars (slanted inward by 2 degrees for classic Torii posture)
  const pillarGeo = new THREE.CylinderGeometry(0.85, 1.05, 24, 16);
  
  const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
  leftPillar.position.set(-11, 10, 0);
  leftPillar.rotation.z = -0.035;
  torii.add(leftPillar);

  const rightPillar = new THREE.Mesh(pillarGeo, pillarMat);
  rightPillar.position.set(11, 10, 0);
  rightPillar.rotation.z = 0.035;
  torii.add(rightPillar);

  // Pillar Base Stone Pedestals
  const baseGeo = new THREE.CylinderGeometry(1.5, 1.8, 2.5, 12);
  const leftBase = new THREE.Mesh(baseGeo, beamMat);
  leftBase.position.set(-11, 0, 0);
  torii.add(leftBase);

  const rightBase = new THREE.Mesh(baseGeo, beamMat);
  rightBase.position.set(11, 0, 0);
  torii.add(rightBase);

  // Kasagi (Top Curved Upper Beam)
  const kasagiGeo = new THREE.BoxGeometry(32, 1.6, 2.4);
  const kasagi = new THREE.Mesh(kasagiGeo, beamMat);
  kasagi.position.set(0, 22, 0);
  torii.add(kasagi);

  // Kasagi Glow Accent Line
  const kasagiGlow = new THREE.Mesh(new THREE.BoxGeometry(32.4, 0.3, 2.6), glowMat);
  kasagiGlow.position.set(0, 22.8, 0);
  torii.add(kasagiGlow);

  // Shimaki (Secondary Under-Beam)
  const shimakiGeo = new THREE.BoxGeometry(28, 1.2, 1.8);
  const shimaki = new THREE.Mesh(shimakiGeo, beamMat);
  shimaki.position.set(0, 20.2, 0);
  torii.add(shimaki);

  // Nuki (Lower Tie-Beam)
  const nukiGeo = new THREE.BoxGeometry(26, 1.0, 1.4);
  const nuki = new THREE.Mesh(nukiGeo, beamMat);
  nuki.position.set(0, 16.5, 0);
  torii.add(nuki);

  // Gakuzuka (Center Tablet / Sigil Crest)
  const gakuzukaGeo = new THREE.BoxGeometry(2.4, 3.2, 0.8);
  const gakuzuka = new THREE.Mesh(gakuzukaGeo, beamMat);
  gakuzuka.position.set(0, 18.3, 0);
  torii.add(gakuzuka);

  // Suspended Chakra Lanterns on both sides
  [-9, 9].forEach((lanternX) => {
    const lanternGeo = new THREE.OctahedronGeometry(0.9, 0);
    const lanternMat = new THREE.MeshBasicMaterial({ color: glowColor });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(lanternX, 15.2, 0);
    torii.add(lantern);

    // Subtle localized point light
    const lanternLight = new THREE.PointLight(glowColor, 0.8, 25);
    lanternLight.position.set(lanternX, 15.2, 1);
    torii.add(lanternLight);
  });

  return torii;
}

/**
 * 3. Japanese-Inspired Pagoda Shrine Silhouettes
 * Multi-tiered architectural silhouettes resting on distant stone precipices.
 */
export function createPagodaShrine(x, y, z, scale = 1.0) {
  const pagoda = new THREE.Group();
  pagoda.position.set(x, y, z);
  pagoda.scale.set(scale, scale, scale);

  const stoneMat = new THREE.MeshBasicMaterial({ color: 0x0d031c, fog: true });
  const roofMat = new THREE.MeshBasicMaterial({ color: 0x1f073d, fog: true });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.6 });

  // Base platform
  const base = new THREE.Mesh(new THREE.BoxGeometry(16, 4, 16), stoneMat);
  base.position.y = 2;
  pagoda.add(base);

  // 3-Tiered Roof Structures
  const tiers = [
    { y: 6, bodySize: 10, roofW: 18, roofH: 1.8 },
    { y: 12, bodySize: 7.5, roofW: 14, roofH: 1.5 },
    { y: 17, bodySize: 5.5, roofW: 10.5, roofH: 1.3 },
  ];

  tiers.forEach((t) => {
    // Body / Room
    const body = new THREE.Mesh(new THREE.BoxGeometry(t.bodySize, 4, t.bodySize), stoneMat);
    body.position.y = t.y;
    pagoda.add(body);

    // Curved Pagoda Eaves (approximated with flared flat pyramid/box)
    const roof = new THREE.Mesh(new THREE.BoxGeometry(t.roofW, t.roofH, t.roofW), roofMat);
    roof.position.y = t.y + 2.2;
    pagoda.add(roof);

    // Eave edge neon rim
    const edge = new THREE.Mesh(new THREE.BoxGeometry(t.roofW + 0.4, 0.2, t.roofW + 0.4), glowMat);
    edge.position.y = t.y + 2.2;
    pagoda.add(edge);
  });

  // Sorin (Finial Spire Spire atop the pagoda)
  const spireGeo = new THREE.ConeGeometry(0.6, 7, 8);
  const spire = new THREE.Mesh(spireGeo, glowMat);
  spire.position.y = 23;
  pagoda.add(spire);

  return pagoda;
}

/**
 * 4. Chibaku Tensei Floating Monoliths (Organic Suspended Rocks)
 * Organic faceted boulders with glowing purple chakra fractures and harmonic levitation.
 */
export function createFloatingMonoliths(scene, count = 12) {
  const monolithGroup = new THREE.Group();
  monolithGroup.name = 'floatingMonoliths';

  const monolithData = [];
  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0x140a26,
    roughness: 0.85,
    metalness: 0.2,
    flatShading: true,
  });

  const veinMat = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  });

  const configs = [
    { x: -32, y: 16, z: -40, radius: 4.8 },
    { x: 34, y: 22, z: -70, radius: 6.2 },
    { x: -38, y: -12, z: -90, radius: 5.4 },
    { x: 42, y: -8, z: -140, radius: 7.0 },
    { x: -44, y: 26, z: -170, radius: 5.8 },
    { x: 36, y: 18, z: -210, radius: 8.2 },
    { x: -30, y: -14, z: -250, radius: 6.5 },
    { x: 28, y: 24, z: -280, radius: 5.0 },
    { x: -35, y: 12, z: -320, radius: 7.5 },
    { x: 38, y: -10, z: -350, radius: 6.0 },
    { x: 0, y: 35, z: -110, radius: 9.0 },
    { x: -15, y: -22, z: -180, radius: 5.5 },
  ];

  const actualCount = Math.min(count, configs.length);

  for (let i = 0; i < actualCount; i++) {
    const cfg = configs[i];
    const rockGroup = new THREE.Group();
    rockGroup.position.set(cfg.x, cfg.y, cfg.z);

    // Faceted jagged rock geometry
    const geo = new THREE.DodecahedronGeometry(cfg.radius, 1);
    
    // Vertex perturbation to ensure organic non-uniform craggy shape
    const pos = geo.attributes.position;
    for (let v = 0; v < pos.count; v++) {
      const vx = pos.getX(v);
      const vy = pos.getY(v);
      const vz = pos.getZ(v);
      const noise = 1 + (Math.sin(vx * 2.1) + Math.cos(vy * 1.8) + Math.sin(vz * 2.7)) * 0.14;
      pos.setXYZ(v, vx * noise, vy * noise, vz * noise);
    }
    geo.computeVertexNormals();

    const rockMesh = new THREE.Mesh(geo, stoneMat);
    rockGroup.add(rockMesh);

    // Glowing Chakra Vein overlay (slightly larger wireframe)
    const veinMesh = new THREE.Mesh(geo, veinMat);
    veinMesh.scale.set(1.02, 1.02, 1.02);
    rockGroup.add(veinMesh);

    // Satellite micro-shards orbiting the monolith
    const shardCount = 2 + (i % 3);
    const shards = [];
    for (let s = 0; s < shardCount; s++) {
      const shardGeo = new THREE.TetrahedronGeometry(0.6 + Math.random() * 0.7, 0);
      const shardMesh = new THREE.Mesh(shardGeo, stoneMat);
      const sAngle = (s / shardCount) * Math.PI * 2;
      const sDist = cfg.radius * (1.5 + Math.random() * 0.5);
      shardMesh.position.set(
        Math.cos(sAngle) * sDist,
        (Math.random() - 0.5) * cfg.radius,
        Math.sin(sAngle) * sDist
      );
      rockGroup.add(shardMesh);
      shards.push({ mesh: shardMesh, angle: sAngle, dist: sDist, speed: 0.008 + s * 0.004 });
    }

    monolithGroup.add(rockGroup);

    monolithData.push({
      group: rockGroup,
      baseY: cfg.y,
      baseX: cfg.x,
      speed: 0.4 + (i % 5) * 0.15,
      amplitude: 1.2 + (i % 3) * 0.8,
      phase: i * 0.75,
      rotX: 0.002 * (i % 2 === 0 ? 1 : -1),
      rotY: 0.003 * (i % 3 === 0 ? 1 : -1),
      shards,
    });
  }

  scene.add(monolithGroup);
  return { group: monolithGroup, data: monolithData, monolithData };
}

/**
 * 5. Curved Chakra Energy Streams
 * 3D Catmull-Rom splines weaving through the cosmos like chakra ley-lines.
 */
export function createChakraStreams(scene) {
  const streamGroup = new THREE.Group();
  streamGroup.name = 'chakraStreams';

  const curveDefinitions = [
    [
      new THREE.Vector3(-60, -10, 20),
      new THREE.Vector3(-35, 18, -60),
      new THREE.Vector3(-10, 5, -140),
      new THREE.Vector3(-25, 22, -220),
      new THREE.Vector3(-5, 8, -320),
    ],
    [
      new THREE.Vector3(55, 12, 10),
      new THREE.Vector3(30, -14, -80),
      new THREE.Vector3(15, 20, -160),
      new THREE.Vector3(35, -5, -240),
      new THREE.Vector3(10, 18, -340),
    ],
    [
      new THREE.Vector3(0, -25, -20),
      new THREE.Vector3(-20, -18, -100),
      new THREE.Vector3(25, -22, -180),
      new THREE.Vector3(-15, -26, -260),
      new THREE.Vector3(0, -20, -350),
    ],
  ];

  const streamLines = [];

  curveDefinitions.forEach((pts, idx) => {
    const curve = new THREE.CatmullRomCurve3(pts);
    const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.45, 8, false);

    const tubeMat = new THREE.MeshBasicMaterial({
      color: idx === 0 ? 0x9333ea : idx === 1 ? 0x06b6d4 : 0xc084fc,
      transparent: true,
      opacity: 0.42,
      wireframe: true,
      blending: THREE.AdditiveBlending,
    });

    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    streamGroup.add(tubeMesh);
    streamLines.push({ mesh: tubeMesh, baseOpacity: 0.42, idx });
  });

  scene.add(streamGroup);
  return { group: streamGroup, streams: streamLines };
}

/**
 * 6. Drifting Fog & Mist Sheets
 * Translucent ground planes with procedural noise textures drifting along X/Z.
 */
export function createMistSheets(scene) {
  const mistGroup = new THREE.Group();
  mistGroup.name = 'mistSheets';

  const mistTex = createMistTexture();
  const mistSheets = [];

  const configs = [
    { y: -22, z: -60, size: 260, opacity: 0.38, speedX: 0.08, speedZ: 0.02 },
    { y: -26, z: -160, size: 360, opacity: 0.45, speedX: -0.06, speedZ: 0.03 },
    { y: -28, z: -270, size: 480, opacity: 0.52, speedX: 0.05, speedZ: -0.02 },
  ];

  configs.forEach((c) => {
    const geo = new THREE.PlaneGeometry(c.size, c.size);
    const mat = new THREE.MeshBasicMaterial({
      map: mistTex,
      transparent: true,
      opacity: c.opacity,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(0, c.y, c.z);
    mistGroup.add(mesh);

    mistSheets.push({ mesh, speedX: c.speedX, speedZ: c.speedZ, size: c.size });
  });

  scene.add(mistGroup);
  return { group: mistGroup, sheets: mistSheets };
}

/**
 * 7. Adaptive Floating Chakra Embers
 * BufferGeometry with device-budget particle count.
 */
export function createAdaptiveEmbers(scene, particleBudget = 1800) {
  const count = Math.max(300, Math.min(3000, particleBudget));
  const emberGeo = new THREE.BufferGeometry();

  const pos = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);
  const bounds = { x: 90, y: 55, zMin: -380, zMax: 80 };

  const palette = [
    new THREE.Color('#9333ea'), // Vivid Purple
    new THREE.Color('#c084fc'), // Radiant Lilac
    new THREE.Color('#06b6d4'), // Chidori Cyan
    new THREE.Color('#38bdf8'), // Electric Sky Blue
    new THREE.Color('#e9d5ff'), // Soft White-Violet
  ];

  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * bounds.x * 2;
    pos[i * 3 + 1] = (Math.random() - 0.5) * bounds.y * 2;
    pos[i * 3 + 2] = bounds.zMin + Math.random() * (bounds.zMax - bounds.zMin);

    velocities[i * 3] = (Math.random() - 0.5) * 0.04;
    velocities[i * 3 + 1] = 0.02 + Math.random() * 0.07; // Gentle upward drift
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

    const col = palette[Math.floor(Math.random() * palette.length)];
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }

  emberGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  emberGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const emberMat = new THREE.PointsMaterial({
    size: 2.5,
    map: createEmberTexture(),
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const emberPoints = new THREE.Points(emberGeo, emberMat);
  emberPoints.name = 'chakraEmbers';
  scene.add(emberPoints);

  return { points: emberPoints, count, velocities, bounds };
}

/**
 * 8. Atmospheric Environmental Lighting
 */
export function createAtmosphericLighting(scene) {
  const lightGroup = new THREE.Group();
  lightGroup.name = 'atmosphericLighting';

  // Ambient Moonlight
  const ambient = new THREE.AmbientLight(0x180938, 1.4);
  lightGroup.add(ambient);

  // Celestial Moon Directional Light
  const moonLight = new THREE.DirectionalLight(0x8b5cf6, 1.8);
  moonLight.position.set(40, 80, -200);
  lightGroup.add(moonLight);

  // Distant cyan fill accent
  const cyanFill = new THREE.DirectionalLight(0x06b6d4, 0.6);
  cyanFill.position.set(-60, -30, -100);
  lightGroup.add(cyanFill);

  // Pulsing central beacon light
  const beaconLight = new THREE.PointLight(0xa855f7, 2.0, 140, 1.8);
  beaconLight.position.set(0, 10, -80);
  lightGroup.add(beaconLight);

  scene.add(lightGroup);
  return { group: lightGroup, beaconLight };
}
