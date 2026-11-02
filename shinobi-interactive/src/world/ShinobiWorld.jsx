import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { getDeviceProfile, setupVisibilityObserver } from '../utils/deviceProfiler.js';
import { CameraDirector } from './CameraDirector.js';
import {
  createDistantMountains,
  createToriiGate,
  createPagodaShrine,
  createFloatingMonoliths,
  createChakraStreams,
  createMistSheets,
  createAdaptiveEmbers,
  createAtmosphericLighting,
} from './EnvironmentArchitect.js';

export default function ShinobiWorld({
  currentStage = 0,
  setStage,
  hoveredNode,
  setHoveredNode,
  onSelectProject,
  triggerShockwave,
}) {
  const mountRef = useRef(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // Keep latest props in refs to avoid re-mounting Three.js scene
  const stageRef = useRef(currentStage);
  stageRef.current = currentStage;

  const onSelectProjectRef = useRef(onSelectProject);
  onSelectProjectRef.current = onSelectProject;

  const triggerShockwaveRef = useRef(triggerShockwave);
  triggerShockwaveRef.current = triggerShockwave;

  const setHoveredNodeRef = useRef(setHoveredNode);
  setHoveredNodeRef.current = setHoveredNode;

  useEffect(() => {
    if (!mountRef.current) return;

    // ==================== 0. HARDWARE PROFILER & ACCESSIBILITY ====================
    const device = getDeviceProfile();

    // ==================== 1. WEBGL DETECTION & INITIALIZATION ====================
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: device.tier !== 'mobile',
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(device.maxPixelRatio);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      mountRef.current.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL is not available:', e);
      setWebglSupported(false);
      return;
    }

    // ==================== 2. SCENE & ATMOSPHERIC FOG ====================
    const scene = new THREE.Scene();
    // Midnight purple void exponential fog
    scene.fog = new THREE.FogExp2(0x04010a, 0.0055);

    // ==================== 3. CAMERA & CINEMATIC DIRECTOR ====================
    const camera = new THREE.PerspectiveCamera(
      58,
      window.innerWidth / window.innerHeight,
      0.1,
      1400
    );
    camera.position.set(0, 0, 75);

    const cameraDirector = new CameraDirector(camera, {
      reducedMotion: device.reducedMotion,
      isMobile: device.isMobile,
    });
    cameraDirector.attachListeners();

    // Define 6-Stage Spatial Waypoints across the continuous universe
    const stageWaypoints = [
      { pos: new THREE.Vector3(0, 0, 75), look: new THREE.Vector3(0, 0, 0) },          // 0: Awakening
      { pos: new THREE.Vector3(20, 5, -25), look: new THREE.Vector3(20, 5, -60) },     // 1: Tech Orbit
      { pos: new THREE.Vector3(-25, -5, -95), look: new THREE.Vector3(-25, -5, -130) },// 2: Characters
      { pos: new THREE.Vector3(15, -8, -165), look: new THREE.Vector3(15, -8, -200) }, // 3: Missions
      { pos: new THREE.Vector3(0, 8, -235), look: new THREE.Vector3(0, 8, -270) },     // 4: Telemetry
      { pos: new THREE.Vector3(0, 0, -305), look: new THREE.Vector3(0, 0, -340) },     // 5: Summoning
    ];

    cameraDirector.setBaseTarget(stageWaypoints[0].pos, stageWaypoints[0].look);

    // Raycasting & Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const interactableObjects = [];

    // ==================== 4. PROCEDURAL SHINOBI REALM ARCHITECTURE ====================
    // A. Distant Mountain Silhouette Ranges
    createDistantMountains(scene);

    // B. Atmospheric Lighting
    const { beaconLight } = createAtmosphericLighting(scene);

    // C. Japanese-Inspired Torii Gates
    const toriiGate1 = createToriiGate(0, -6, -35, 1.15, 0x240742, 0xc084fc);
    scene.add(toriiGate1);

    const toriiGate2 = createToriiGate(0, -4, -185, 1.35, 0x1d0536, 0x06b6d4);
    scene.add(toriiGate2);

    // D. Pagoda Shrine Silhouettes on distant shelves
    const pagoda1 = createPagodaShrine(-55, -2, -230, 0.9);
    scene.add(pagoda1);

    const pagoda2 = createPagodaShrine(52, 6, -310, 0.85);
    scene.add(pagoda2);

    // E. Chibaku Tensei Floating Monoliths with glowing purple chakra fractures
    const { monolithData = [] } = createFloatingMonoliths(scene, device.tier === 'mobile' ? 6 : 12) || {};

    // F. Curved Chakra Energy Streams
    const { streams = [] } = createChakraStreams(scene) || {};

    // G. Drifting Mist & Fog Sheets
    const { sheets: mistSheets = [] } = createMistSheets(scene) || {};

    // H. Adaptive Chakra Embers (BufferGeometry with device profile particle cap)
    const embers = createAdaptiveEmbers(scene, device.particleCount);

    // ==================== 5. PRESERVED INTERACTIVE ARTIFACTS ====================
    // Realm 0: Central Rinnegan Avatar & Concentric Rings
    const rinneganGroup = new THREE.Group();
    rinneganGroup.position.set(0, 0, 0);

    const textureLoader = new THREE.TextureLoader();
    const avatarTexture = textureLoader.load('./avatar.png');
    avatarTexture.generateMipmaps = true;

    const avatarMesh = new THREE.Mesh(
      new THREE.CircleGeometry(9, 64),
      new THREE.MeshBasicMaterial({ map: avatarTexture, side: THREE.DoubleSide })
    );
    avatarMesh.position.z = 0.5;
    rinneganGroup.add(avatarMesh);

    const avatarRim = new THREE.Mesh(
      new THREE.RingGeometry(9, 9.6, 64),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.9 })
    );
    avatarRim.position.z = 0.6;
    rinneganGroup.add(avatarRim);

    const rinneganRings = [];
    [13, 21, 30, 40, 52, 65].forEach((r, idx) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, 0.28, 8, 64),
        new THREE.MeshBasicMaterial({
          color: idx % 2 === 0 ? 0xc084fc : 0x9333ea,
          wireframe: true,
          transparent: true,
          opacity: 0.65 - idx * 0.08,
        })
      );
      ring.position.z = -idx * 1.5;
      rinneganGroup.add(ring);
      rinneganRings.push(ring);
    });

    const tomoeGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const tomoe = new THREE.Mesh(
        new THREE.SphereGeometry(1.2, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      tomoe.position.set(Math.cos(angle) * 30, Math.sin(angle) * 30, 0);
      tomoeGroup.add(tomoe);
    }
    rinneganGroup.add(tomoeGroup);
    scene.add(rinneganGroup);

    // Realm 1: Planetary Tech Orbit (Z: -60)
    const techOrbitGroup = new THREE.Group();
    techOrbitGroup.position.set(20, 5, -60);

    const techCatalog = [
      { id: 'react', name: 'React', color: 0x06b6d4, category: 'Frontend Architecture' },
      { id: 'js', name: 'JavaScript', color: 0xfacc15, category: 'ES6+ & Async Core' },
      { id: 'three', name: 'Three.js', color: 0xc084fc, category: 'WebGL & 3D Shaders' },
      { id: 'gsap', name: 'GSAP', color: 0x22c55e, category: 'Cinematic Motion Engine' },
      { id: 'java', name: 'Java', color: 0xf97316, category: 'Enterprise OOP' },
      { id: 'flutter', name: 'Flutter', color: 0x38bdf8, category: 'Cross-Platform Native' },
      { id: 'ai', name: 'AI Engineering', color: 0xec4899, category: 'Local LLMs & Agents' },
      { id: 'git', name: 'Git & GitHub', color: 0xf43f5e, category: 'DevOps & CI/CD Actions' },
    ];

    const techNodes = [];
    techCatalog.forEach((t, i) => {
      const radius = 22 + (i % 3) * 6;
      const angle = (i / techCatalog.length) * Math.PI * 2;

      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(2.5, 24, 24),
        new THREE.MeshStandardMaterial({
          color: t.color,
          emissive: t.color,
          emissiveIntensity: 0.6,
          wireframe: true,
        })
      );
      sphere.userData = { type: 'tech', ...t };
      sphere.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (i - 4) * 4);
      techOrbitGroup.add(sphere);
      interactableObjects.push(sphere);

      const orbitRing = new THREE.Mesh(
        new THREE.TorusGeometry(radius, 0.1, 4, 64),
        new THREE.MeshBasicMaterial({ color: 0x581c87, transparent: true, opacity: 0.35 })
      );
      techOrbitGroup.add(orbitRing);

      techNodes.push({ mesh: sphere, radius, angle, speed: 0.006 + i * 0.002 });
    });
    scene.add(techOrbitGroup);

    // Realm 2: Character Factions (Z: -130)
    const characterGroup = new THREE.Group();
    characterGroup.position.set(-25, -5, -130);

    const factions = [
      { id: 'team7', name: 'Team 7 (Will of Fire)', color: 0xf97316, x: -18, y: 12, roster: 'Naruto, Sasuke, Sakura, Kakashi' },
      { id: 'uchiha', name: 'Uchiha Clan (Doujutsu)', color: 0xc084fc, x: 18, y: 12, roster: 'Madara, Itachi, Obito, Shisui' },
      { id: 'akatsuki', name: 'Akatsuki Order (Peace)', color: 0xef4444, x: -16, y: -14, roster: 'Pain, Konan, Kisame, Deidara' },
      { id: 'hokage', name: 'Hokage & Sannin (Legends)', color: 0x10b981, x: 16, y: -14, roster: 'Hashirama, Minato, Jiraiya, Tsunade' },
      { id: 'allied', name: 'Allied Forces (Five Nations)', color: 0x06b6d4, x: 0, y: 0, roster: 'Gaara, Killer B, Might Guy, Rock Lee' },
    ];

    factions.forEach((f) => {
      const star = new THREE.Mesh(
        new THREE.OctahedronGeometry(3.2, 0),
        new THREE.MeshStandardMaterial({
          color: f.color,
          emissive: f.color,
          emissiveIntensity: 0.8,
          wireframe: true,
        })
      );
      star.position.set(f.x, f.y, 0);
      star.userData = { type: 'faction', ...f };
      characterGroup.add(star);
      interactableObjects.push(star);
    });

    const constellationLines = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-18, 12, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(18, 12, 0),
        new THREE.Vector3(16, -14, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-16, -14, 0),
        new THREE.Vector3(-18, 12, 0),
      ]),
      new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.45 })
    );
    characterGroup.add(constellationLines);
    scene.add(characterGroup);

    // Realm 3: Project Scrolls (Z: -200)
    const projectGroup = new THREE.Group();
    projectGroup.position.set(15, -8, -200);

    const projectList = [
      { id: 'vm', title: 'VisionMate AI', rank: 'S-RANK // AI', color: 0x06b6d4, url: 'https://github.com/sakthirenganathan-dev/VisionMate-AI' },
      { id: 'sm', title: 'SafeMeds AI', rank: 'A-RANK // HEALTH', color: 0x10b981, url: 'https://github.com/sakthirenganathan-dev/safeMedesAi' },
      { id: 'isl', title: 'ISL Healthcare', rank: 'S-RANK // INCLUSION', color: 0xf97316, url: 'https://github.com/sakthirenganathan-dev/isl-healthcare' },
      { id: 'ry', title: 'RYVEN', rank: 'S-RANK // AGENT', color: 0xa855f7, url: 'https://github.com/sakthirenganathan-dev/RYVEN' },
      { id: 'sg', title: 'StudyGen AI', rank: 'A-RANK // EDTECH', color: 0xf59e0b, url: 'https://github.com/sakthirenganathan-dev/StudyGenAi' },
    ];

    projectList.forEach((p, idx) => {
      const scroll = new THREE.Mesh(
        new THREE.CylinderGeometry(1.6, 1.6, 9, 16),
        new THREE.MeshStandardMaterial({
          color: p.color,
          emissive: p.color,
          emissiveIntensity: 0.7,
          wireframe: true,
        })
      );
      scroll.rotation.z = Math.PI / 4;
      scroll.position.set((idx - 2) * 11, ((idx % 2) - 0.5) * 6, (idx - 2) * 4);
      scroll.userData = { type: 'project', ...p };
      projectGroup.add(scroll);
      interactableObjects.push(scroll);
    });
    scene.add(projectGroup);

    // Realm 4: Telemetry Holographic Frame (Z: -270)
    const terminalGroup = new THREE.Group();
    terminalGroup.position.set(0, 8, -270);
    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(42, 24, 1.5),
      new THREE.MeshBasicMaterial({ color: 0x6b21a8, wireframe: true, transparent: true, opacity: 0.5 })
    );
    terminalGroup.add(frameMesh);
    scene.add(terminalGroup);

    // Realm 5: Summoning Seal Array (Z: -340)
    const sealGroup = new THREE.Group();
    sealGroup.position.set(0, 0, -340);

    [14, 24, 35, 48].forEach((r, i) => {
      const sRing = new THREE.Mesh(
        new THREE.RingGeometry(r, r + 0.35, 64),
        new THREE.MeshBasicMaterial({
          color: i % 2 === 0 ? 0x9333ea : 0x06b6d4,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75 - i * 0.1,
        })
      );
      sRing.rotation.x = Math.PI / 2.5;
      sealGroup.add(sRing);
    });

    const sealCore = new THREE.Mesh(
      new THREE.CylinderGeometry(5.5, 5.5, 1.5, 32),
      new THREE.MeshStandardMaterial({
        color: 0x2e1065,
        emissive: 0xa855f7,
        emissiveIntensity: 0.9,
      })
    );
    sealCore.rotation.x = Math.PI / 2.5;
    sealCore.userData = { type: 'summoning', action: 'summon' };
    sealGroup.add(sealCore);
    interactableObjects.push(sealCore);
    scene.add(sealGroup);

    // ==================== 6. POINTER & CLICK HANDLERS ====================
    const onPointerMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);

      if (intersects.length > 0) {
        setHoveredNodeRef.current(intersects[0].object.userData);
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredNodeRef.current(null);
        document.body.style.cursor = 'default';
      }
    };

    const onClick = () => {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData.type === 'project' && onSelectProjectRef.current) {
          onSelectProjectRef.current(hit.userData);
        }
        if (hit.userData.type === 'summoning' && triggerShockwaveRef.current) {
          triggerShockwaveRef.current();
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('click', onClick, { passive: true });

    // ==================== 7. ANIMATION LOOP & POWER EFFICIENCY ====================
    let animId;
    let isTabVisible = !document.hidden;
    const clock = new THREE.Clock();

    const cleanupVisibility = setupVisibilityObserver(
      () => {
        isTabVisible = false; // Suspend heavy rendering when tab is hidden
      },
      () => {
        isTabVisible = true;
        clock.getDelta(); // Clear time accumulator on tab resume to prevent sudden jumps
      }
    );

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!isTabVisible) return; // Battery saving pause

      const elapsed = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.1);
      const motionFactor = device.reducedMotion ? 0.15 : 1.0;

      // 1. Environmental Light Pulsing (Breathing ambient chakra beacon)
      if (beaconLight) {
        beaconLight.intensity = 1.6 + Math.sin(elapsed * 1.8) * 0.4 * motionFactor;
      }

      // 2. Chibaku Tensei Floating Monolith Harmonic Levitation
      if (monolithData && Array.isArray(monolithData)) {
        monolithData.forEach((m) => {
          if (!device.reducedMotion) {
            m.group.position.y = m.baseY + Math.sin(elapsed * m.speed + m.phase) * m.amplitude;
            m.group.rotation.x += m.rotX;
            m.group.rotation.y += m.rotY;

            // Orbit satellite debris shards
            if (m.shards && Array.isArray(m.shards)) {
              m.shards.forEach((s) => {
                s.angle += s.speed;
                s.mesh.position.x = Math.cos(s.angle) * s.dist;
                s.mesh.position.z = Math.sin(s.angle) * s.dist;
              });
            }
          }
        });
      }

      // 3. Curved Chakra Energy Streams Pulsing
      if (streams && Array.isArray(streams)) {
        streams.forEach((st) => {
          st.mesh.material.opacity =
            st.baseOpacity + Math.sin(elapsed * 2.2 + st.idx) * 0.15 * motionFactor;
        });
      }

      // 4. Drifting Fog & Mist Sheets
      if (mistSheets && Array.isArray(mistSheets)) {
        mistSheets.forEach((s) => {
          if (!device.reducedMotion) {
            s.mesh.position.x += s.speedX * motionFactor;
            s.mesh.position.z += s.speedZ * motionFactor;

            // Seamless boundary wrapping
            if (s.mesh.position.x > s.size * 0.4) s.mesh.position.x = -s.size * 0.4;
            if (s.mesh.position.x < -s.size * 0.4) s.mesh.position.x = s.size * 0.4;
          }
        });
      }

      // 5. Floating Chakra Embers Upward Drift & Wrap
      if (embers && embers.points && !device.reducedMotion) {
        const posAttr = embers.points.geometry.attributes.position;
        const pArray = posAttr.array;
        const vArray = embers.velocities;
        const b = embers.bounds;

        for (let i = 0; i < embers.count; i++) {
          pArray[i * 3] += vArray[i * 3] * motionFactor;
          pArray[i * 3 + 1] += vArray[i * 3 + 1] * motionFactor;
          pArray[i * 3 + 2] += vArray[i * 3 + 2] * motionFactor;

          // Vertical & Horizontal bounds wrapping
          if (pArray[i * 3 + 1] > b.y) {
            pArray[i * 3 + 1] = -b.y;
            pArray[i * 3] = (Math.random() - 0.5) * b.x * 2;
          }
        }
        posAttr.needsUpdate = true;
      }

      // 6. Rinnegan Rings & Tomoe Rotation
      rinneganRings.forEach((ring, idx) => {
        ring.rotation.z = elapsed * (idx % 2 === 0 ? 0.04 : -0.04) * motionFactor;
      });
      tomoeGroup.rotation.z = elapsed * 0.15 * motionFactor;

      // 7. Tech Orbit Rotation
      techNodes.forEach((t) => {
        t.angle += t.speed * motionFactor;
        t.mesh.position.x = Math.cos(t.angle) * t.radius;
        t.mesh.position.y = Math.sin(t.angle) * t.radius;
        t.mesh.rotation.y = elapsed * motionFactor;
      });

      // 8. Character Stars & Summoning Seal
      characterGroup.rotation.y = Math.sin(elapsed * 0.4) * 0.18 * motionFactor;
      projectGroup.rotation.y = Math.cos(elapsed * 0.35) * 0.18 * motionFactor;
      sealGroup.rotation.z = -elapsed * 0.06 * motionFactor;

      // 9. Camera Director Spring-Damper Glide
      const targetWaypoint = stageWaypoints[stageRef.current] || stageWaypoints[0];
      cameraDirector.setBaseTarget(targetWaypoint.pos, targetWaypoint.look);
      cameraDirector.update(delta);

      renderer.render(scene, camera);
    };
    animate();

    // ==================== 8. RESIZE HANDLING ====================
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ==================== 9. CLEANUP & MEMORY DISPOSAL ====================
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      cameraDirector.detachListeners();
      cleanupVisibility();
      cancelAnimationFrame(animId);

      // Deep WebGL Resource Disposal
      scene.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => {
              if (mat.map) mat.map.dispose();
              mat.dispose();
            });
          } else {
            if (obj.material.map) obj.material.map.dispose();
            obj.material.dispose();
          }
        }
      });

      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []); // Mounts once: stage changes glide smoothly via refs

  // WebGL Fallback Screen
  if (!webglSupported) {
    return (
      <div className="fixed inset-0 z-0 flex items-center justify-center bg-[#030008] text-purple-300 p-8 text-center">
        <div className="max-w-md p-6 rounded-2xl border border-purple-800 bg-purple-950/40 backdrop-blur-md">
          <h2 className="text-xl font-bold font-cinzel text-white mb-2">SHINOBI WORLD</h2>
          <p className="text-sm font-mono text-purple-200/80 mb-4">
            WebGL acceleration is unavailable in your browser. Please enable hardware acceleration to experience the 3D chakra cosmos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 overflow-hidden select-none bg-[#030008]"
    />
  );
}
