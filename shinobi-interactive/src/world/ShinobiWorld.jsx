import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ShinobiWorld({ 
  currentStage, 
  setStage, 
  hoveredNode, 
  setHoveredNode, 
  onSelectProject,
  triggerShockwave
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ==================== SCENE, CAMERA, RENDERER ====================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05020c, 0.006);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1200
    );
    camera.position.set(0, 0, 75);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactableObjects = [];

    // ==================== 1. CHAKRA PARTICLE VORTEX (3000 Particles) ====================
    const particleCount = 3000;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const chakraPalette = [
      new THREE.Color('#9333ea'), // Purple
      new THREE.Color('#c084fc'), // Violet
      new THREE.Color('#06b6d4'), // Cyan
      new THREE.Color('#38bdf8'), // Electric blue
      new THREE.Color('#f43f5e'), // Crimson
      new THREE.Color('#ffffff'), // White Spark
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 10 + Math.random() * 160;
      const angle = Math.random() * Math.PI * 2;
      const depth = (Math.random() - 0.5) * 450;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = depth;

      velocities[i * 3] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;

      const col = chakraPalette[Math.floor(Math.random() * chakraPalette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleVortex = new THREE.Points(particleGeo, particleMat);
    scene.add(particleVortex);

    // ==================== 2. REALM 0: GIANT 3D RINNEGAN & AVATAR (Z: 0) ====================
    const rinneganOrigin = new THREE.Group();
    rinneganOrigin.position.set(0, 0, 0);

    // Avatar Texture onto a Circular 3D Portal Disc
    const textureLoader = new THREE.TextureLoader();
    const avatarTexture = textureLoader.load('./avatar.png');
    avatarTexture.generateMipmaps = true;

    const avatarGeo = new THREE.CircleGeometry(9, 64);
    const avatarMat = new THREE.MeshBasicMaterial({
      map: avatarTexture,
      side: THREE.DoubleSide,
    });
    const avatarMesh = new THREE.Mesh(avatarGeo, avatarMat);
    avatarMesh.position.z = 0.5;
    rinneganOrigin.add(avatarMesh);

    // Glowing Avatar Rim Frame
    const avatarRimGeo = new THREE.RingGeometry(9, 9.6, 64);
    const avatarRimMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const avatarRim = new THREE.Mesh(avatarRimGeo, avatarRimMat);
    avatarRim.position.z = 0.6;
    rinneganOrigin.add(avatarRim);

    // 6 Concentric 3D Rinnegan Wireframe Ripple Rings
    const ringRadii = [13, 21, 30, 40, 52, 65];
    const rinneganRings = [];
    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.TorusGeometry(r, 0.28, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xc084fc : 0x9333ea,
        wireframe: true,
        transparent: true,
        opacity: 0.65 - idx * 0.08,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.z = -idx * 1.5;
      rinneganOrigin.add(ringMesh);
      rinneganRings.push(ringMesh);
    });

    // 6 Rotating 3D Tomoe Spheres around Avatar
    const tomoeGroup = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const tomoeAngle = (i / 6) * Math.PI * 2;
      const tGeo = new THREE.SphereGeometry(1.2, 16, 16);
      const tMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const tMesh = new THREE.Mesh(tGeo, tMat);
      tMesh.position.set(Math.cos(tomoeAngle) * 30, Math.sin(tomoeAngle) * 30, 0);
      tomoeGroup.add(tMesh);
    }
    rinneganOrigin.add(tomoeGroup);
    scene.add(rinneganOrigin);

    // ==================== 3. REALM 1: 3D PLANETARY TECH ORBIT (Z: -60) ====================
    const techOrbitGroup = new THREE.Group();
    techOrbitGroup.position.set(20, 5, -60);

    const techCatalog = [
      { id: 'react', name: 'React', color: 0x06b6d4, icon: '⚛️', category: 'Frontend Architecture' },
      { id: 'js', name: 'JavaScript', color: 0xfacc15, icon: 'JS', category: 'ES6+ & Async Core' },
      { id: 'three', name: 'Three.js', color: 0xc084fc, icon: '▲', category: 'WebGL & 3D Shaders' },
      { id: 'gsap', name: 'GSAP', color: 0x22c55e, icon: '⚡', category: 'Cinematic Motion Engine' },
      { id: 'java', name: 'Java', color: 0xf97316, icon: '☕', category: 'Enterprise OOP' },
      { id: 'flutter', name: 'Flutter', color: 0x38bdf8, icon: '📱', category: 'Cross-Platform Native' },
      { id: 'ai', name: 'AI Engineering', color: 0xec4899, icon: '🧠', category: 'Local LLMs & Agents' },
      { id: 'git', name: 'Git & GitHub', color: 0xf43f5e, icon: '🐙', category: 'DevOps & CI/CD Actions' },
    ];

    const techNodes = [];
    techCatalog.forEach((t, i) => {
      const radius = 22 + (i % 3) * 6;
      const angle = (i / techCatalog.length) * Math.PI * 2;

      const sphereGeo = new THREE.SphereGeometry(2.5, 24, 24);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: t.color,
        emissive: t.color,
        emissiveIntensity: 0.6,
        wireframe: true,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.userData = { type: 'tech', ...t };

      sphere.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, (i - 4) * 4);
      techOrbitGroup.add(sphere);
      interactableObjects.push(sphere);

      // Orbital trajectory ring
      const orbitRingGeo = new THREE.TorusGeometry(radius, 0.1, 4, 64);
      const orbitRingMat = new THREE.MeshBasicMaterial({ color: 0x581c87, transparent: true, opacity: 0.35 });
      const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
      techOrbitGroup.add(orbitRing);

      techNodes.push({ mesh: sphere, radius, angle, speed: 0.006 + i * 0.002 });
    });
    scene.add(techOrbitGroup);

    // ==================== 4. REALM 2: 3D CHARACTER CONSTELLATION (Z: -130) ====================
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
      const starGeo = new THREE.OctahedronGeometry(3.2, 0);
      const starMat = new THREE.MeshStandardMaterial({
        color: f.color,
        emissive: f.color,
        emissiveIntensity: 0.8,
        wireframe: true,
      });
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.set(f.x, f.y, 0);
      star.userData = { type: 'faction', ...f };

      characterGroup.add(star);
      interactableObjects.push(star);
    });

    // Constellation connecting lines
    const lineMat = new THREE.LineBasicMaterial({ color: 0x7c3aed, transparent: true, opacity: 0.45 });
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-18, 12, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(18, 12, 0),
      new THREE.Vector3(16, -14, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-16, -14, 0),
      new THREE.Vector3(-18, 12, 0),
    ]);
    const constellationLines = new THREE.Line(lineGeo, lineMat);
    characterGroup.add(constellationLines);

    scene.add(characterGroup);

    // ==================== 5. REALM 3: 3D PROJECT SCROLLS (Z: -200) ====================
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
      const scrollGeo = new THREE.CylinderGeometry(1.6, 1.6, 9, 16);
      const scrollMat = new THREE.MeshStandardMaterial({
        color: p.color,
        emissive: p.color,
        emissiveIntensity: 0.7,
        wireframe: true,
      });
      const scrollMesh = new THREE.Mesh(scrollGeo, scrollMat);
      scrollMesh.rotation.z = Math.PI / 4;
      scrollMesh.position.set((idx - 2) * 11, ((idx % 2) - 0.5) * 6, (idx - 2) * 4);
      scrollMesh.userData = { type: 'project', ...p };

      projectGroup.add(scrollMesh);
      interactableObjects.push(scrollMesh);
    });

    scene.add(projectGroup);

    // ==================== 6. REALM 4: HOLOGRAPHIC INTELLIGENCE TERMINAL (Z: -270) ====================
    const terminalGroup = new THREE.Group();
    terminalGroup.position.set(0, 8, -270);

    // Floating Holographic Frame
    const frameGeo = new THREE.BoxGeometry(42, 24, 1.5);
    const frameMat = new THREE.MeshBasicMaterial({
      color: 0x6b21a8,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    terminalGroup.add(frameMesh);

    scene.add(terminalGroup);

    // ==================== 7. REALM 5: SUMMONING SEAL ARRAY (Z: -340) ====================
    const sealGroup = new THREE.Group();
    sealGroup.position.set(0, 0, -340);

    const sealRings = [14, 24, 35, 48];
    sealRings.forEach((r, i) => {
      const sRingGeo = new THREE.RingGeometry(r, r + 0.35, 64);
      const sRingMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x9333ea : 0x06b6d4,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75 - i * 0.1,
      });
      const sRing = new THREE.Mesh(sRingGeo, sRingMat);
      sRing.rotation.x = Math.PI / 2.5; // Tilted cosmic floor array
      sealGroup.add(sRing);
    });

    // Central Summoning Stone / Button
    const sealCoreGeo = new THREE.CylinderGeometry(5.5, 5.5, 1.5, 32);
    const sealCoreMat = new THREE.MeshStandardMaterial({
      color: 0x2e1065,
      emissive: 0xa855f7,
      emissiveIntensity: 0.9,
    });
    const sealCore = new THREE.Mesh(sealCoreGeo, sealCoreMat);
    sealCore.rotation.x = Math.PI / 2.5;
    sealCore.userData = { type: 'summoning', action: 'summon' };
    sealGroup.add(sealCore);
    interactableObjects.push(sealCore);

    scene.add(sealGroup);

    // ==================== CAMERA STAGE TARGETS ====================
    const stageTargets = [
      { x: 0, y: 0, z: 65, lookZ: 0 },       // Stage 0: Awakening
      { x: 20, y: 5, z: -25, lookZ: -60 },    // Stage 1: Tech Orbit
      { x: -25, y: -5, z: -95, lookZ: -130 }, // Stage 2: Character Realm
      { x: 15, y: -8, z: -165, lookZ: -200 }, // Stage 3: Missions
      { x: 0, y: 8, z: -235, lookZ: -270 },   // Stage 4: Telemetry
      { x: 0, y: 0, z: -305, lookZ: -340 },   // Stage 5: Summoning Seal
    ];

    // ==================== MOUSE & PARALLAX TRACKING ====================
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 14;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 14;

      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Raycast detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        setHoveredNode(hit.userData);
        document.body.style.cursor = 'pointer';
      } else {
        setHoveredNode(null);
        document.body.style.cursor = 'default';
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    // Click handler for 3D objects
    const onClick = (e) => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactableObjects);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData.type === 'project' && onSelectProject) {
          onSelectProject(hit.userData);
        }
        if (hit.userData.type === 'summoning' && triggerShockwave) {
          triggerShockwave();
        }
      }
    };
    window.addEventListener('click', onClick);

    // ==================== ANIMATION LOOP ====================
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Swirl Particle Vortex
      particleVortex.rotation.z = elapsed * 0.035;

      // Rotate Rinnegan concentric rings
      rinneganRings.forEach((ring, idx) => {
        ring.rotation.z = elapsed * (idx % 2 === 0 ? 0.05 : -0.05);
      });
      tomoeGroup.rotation.z = elapsed * 0.2;

      // Orbit tech planets
      techNodes.forEach((t) => {
        t.angle += t.speed;
        t.mesh.position.x = Math.cos(t.angle) * t.radius;
        t.mesh.position.y = Math.sin(t.angle) * t.radius;
        t.mesh.rotation.y = elapsed;
      });

      // Rotate Character Stars & Projects
      characterGroup.rotation.y = Math.sin(elapsed * 0.5) * 0.2;
      projectGroup.rotation.y = Math.cos(elapsed * 0.4) * 0.2;
      sealGroup.rotation.z = -elapsed * 0.08;

      // Smooth Camera Glide Lerp
      const target = stageTargets[currentStage] || stageTargets[0];
      camera.position.x += (target.x + mouseX - camera.position.x) * 0.045;
      camera.position.y += (target.y - mouseY - camera.position.y) * 0.045;
      camera.position.z += (target.z - camera.position.z) * 0.045;

      camera.lookAt(target.x, target.y, target.lookZ);

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [currentStage]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 overflow-hidden select-none bg-[#05020c]"
    />
  );
}

