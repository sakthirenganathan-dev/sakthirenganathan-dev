import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function UniverseCanvas({ currentStage, setStageProgress }) {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene & Camera setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05020c, 0.008);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 70);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // ==================== 1. CHAKRA PARTICLE VORTEX ====================
    const particleCount = 2000;
    const particleGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color('#9333ea'),
      new THREE.Color('#c084fc'),
      new THREE.Color('#06b6d4'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#f43f5e'),
      new THREE.Color('#ffffff'),
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 8 + Math.random() * 140;
      const angle = Math.random() * Math.PI * 2;
      const depth = (Math.random() - 0.5) * 350;

      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = Math.sin(angle) * radius;
      pos[i * 3 + 2] = depth;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // ==================== 2. 3D RINNEGAN RINGS IN SPACE ====================
    const rinneganGroup = new THREE.Group();
    const ringRadii = [12, 20, 29, 39, 50, 62];
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });

    ringRadii.forEach((r, idx) => {
      const torusGeo = new THREE.TorusGeometry(r, 0.25, 8, 64);
      const torus = new THREE.Mesh(torusGeo, ringMaterial);
      torus.position.z = -idx * 2;
      rinneganGroup.add(torus);
    });

    // Center Core Sphere
    const coreGeo = new THREE.SphereGeometry(4.5, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      wireframe: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    rinneganGroup.add(core);

    scene.add(rinneganGroup);

    // ==================== 3. ORBITING TECH PLANET SPHERES ====================
    const planetsGroup = new THREE.Group();
    const techColors = [0x06b6d4, 0xfacc15, 0xc084fc, 0x22c55e, 0xf97316, 0x38bdf8, 0xec4899];
    const planetMeshes = [];

    techColors.forEach((color, i) => {
      const pGeo = new THREE.SphereGeometry(2.2, 16, 16);
      const pMat = new THREE.MeshBasicMaterial({ color, wireframe: true });
      const mesh = new THREE.Mesh(pGeo, pMat);
      const dist = 32 + (i % 3) * 12;
      const theta = (i / techColors.length) * Math.PI * 2;
      mesh.position.set(Math.cos(theta) * dist, Math.sin(theta) * dist, (i - 3) * 6);
      planetsGroup.add(mesh);
      planetMeshes.push({ mesh, dist, speed: 0.008 + i * 0.003, theta });
    });

    scene.add(planetsGroup);

    // ==================== 4. CAMERA FLIGHT / STAGE NAVIGATION ====================
    // Stage camera coordinates (Smooth continuous camera flight path)
    const stageCameraPositions = [
      { x: 0, y: 0, z: 70, targetZ: 0 },    // Stage 0: Awakening
      { x: 12, y: 8, z: 42, targetZ: -10 },  // Stage 1: Tech Orbit
      { x: -16, y: -6, z: 24, targetZ: -30 },// Stage 2: Character Realm
      { x: 14, y: -10, z: 5, targetZ: -60 }, // Stage 3: Missions
      { x: 0, y: 12, z: -15, targetZ: -90 }, // Stage 4: Live Telemetry
      { x: 0, y: 0, z: -35, targetZ: -120 }, // Stage 5: Summoning
    ];

    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 12;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 12;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Render loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Continuous vortex motion
      particleSystem.rotation.z = elapsed * 0.04;
      rinneganGroup.rotation.z = -elapsed * 0.03;

      // Orbit tech planets
      planetMeshes.forEach((p) => {
        p.theta += p.speed;
        p.mesh.position.x = Math.cos(p.theta) * p.dist;
        p.mesh.position.y = Math.sin(p.theta) * p.dist;
        p.mesh.rotation.x = elapsed;
        p.mesh.rotation.y = elapsed * 1.5;
      });

      // Camera lerp towards current stage
      const targetPos = stageCameraPositions[currentStage] || stageCameraPositions[0];
      camera.position.x += (targetPos.x + mouseX - camera.position.x) * 0.04;
      camera.position.y += (targetPos.y - mouseY - camera.position.y) * 0.04;
      camera.position.z += (targetPos.z - camera.position.z) * 0.04;

      camera.lookAt(0, 0, targetPos.targetZ);

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
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [currentStage]);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
    />
  );
}

