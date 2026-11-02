import * as THREE from 'three';

/**
 * CameraDirector
 * Manages cinematic spring-damper camera smoothing, mouse parallax,
 * mobile touch-drag interaction, boundary clamping, and reduced-motion handling.
 */
export class CameraDirector {
  constructor(camera, options = {}) {
    this.camera = camera;
    this.reducedMotion = options.reducedMotion || false;
    this.isMobile = options.isMobile || false;

    // Base position and look-at target
    this.basePosition = new THREE.Vector3(0, 0, 75);
    this.baseLookAt = new THREE.Vector3(0, 0, 0);

    // Current and target parallax offsets
    this.targetParallax = new THREE.Vector3(0, 0, 0);
    this.currentParallax = new THREE.Vector3(0, 0, 0);

    // Spring-damper constants
    this.lerpSpeed = this.isMobile ? 0.06 : 0.045;
    this.lookLerpSpeed = 0.05;

    // Strict boundary limits to prevent clipping or disorientation
    this.maxParallaxX = this.isMobile ? 4.5 : 7.0;
    this.maxParallaxY = this.isMobile ? 2.5 : 4.0;
    this.maxParallaxZ = 3.0;

    // Touch tracking state
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchActive = false;

    // Internal lookAt vector
    this.currentLookAt = new THREE.Vector3(0, 0, 0);

    // Bind event handlers
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  setBaseTarget(position, lookAt) {
    if (position) {
      this.basePosition.copy(position);
    }
    if (lookAt) {
      this.baseLookAt.copy(lookAt);
    }
  }

  setReducedMotion(reduced) {
    this.reducedMotion = reduced;
    if (reduced) {
      this.targetParallax.set(0, 0, 0);
      this.currentParallax.set(0, 0, 0);
    }
  }

  handleMouseMove(event) {
    if (this.reducedMotion) return;

    const normX = (event.clientX / window.innerWidth - 0.5) * 2; // [-1, 1]
    const normY = (event.clientY / window.innerHeight - 0.5) * 2; // [-1, 1]

    // Natural inverted camera parallax with strict bounds
    this.targetParallax.x = THREE.MathUtils.clamp(
      normX * this.maxParallaxX,
      -this.maxParallaxX,
      this.maxParallaxX
    );
    this.targetParallax.y = THREE.MathUtils.clamp(
      -normY * this.maxParallaxY,
      -this.maxParallaxY,
      this.maxParallaxY
    );
    // Subtle depth response (leaning forward slightly when centered)
    const distFromCenter = Math.sqrt(normX * normX + normY * normY);
    this.targetParallax.z = (1 - THREE.MathUtils.clamp(distFromCenter, 0, 1)) * this.maxParallaxZ;
  }

  handleTouchStart(event) {
    if (this.reducedMotion || event.touches.length === 0) return;
    this.touchActive = true;
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  handleTouchMove(event) {
    if (this.reducedMotion || !this.touchActive || event.touches.length === 0) return;

    const touchX = event.touches[0].clientX;
    const touchY = event.touches[0].clientY;
    const deltaX = (touchX - this.touchStartX) / window.innerWidth;
    const deltaY = (touchY - this.touchStartY) / window.innerHeight;

    this.targetParallax.x = THREE.MathUtils.clamp(
      deltaX * this.maxParallaxX * 2.2,
      -this.maxParallaxX,
      this.maxParallaxX
    );
    this.targetParallax.y = THREE.MathUtils.clamp(
      -deltaY * this.maxParallaxY * 2.2,
      -this.maxParallaxY,
      this.maxParallaxY
    );
  }

  handleTouchEnd() {
    this.touchActive = false;
    // Smoothly return target to center when touch releases
    this.targetParallax.set(0, 0, 0);
  }

  attachListeners() {
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });
    window.addEventListener('touchstart', this.handleTouchStart, { passive: true });
    window.addEventListener('touchmove', this.handleTouchMove, { passive: true });
    window.addEventListener('touchend', this.handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', this.handleTouchEnd, { passive: true });
  }

  detachListeners() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('touchstart', this.handleTouchStart);
    window.removeEventListener('touchmove', this.handleTouchMove);
    window.removeEventListener('touchend', this.handleTouchEnd);
    window.removeEventListener('touchcancel', this.handleTouchEnd);
  }

  /**
   * Called every frame in the Three.js RAF loop.
   * Performs spring-damper camera interpolation.
   */
  update(delta) {
    // Parallax damping
    this.currentParallax.lerp(this.targetParallax, this.lerpSpeed);

    // Compute final target camera position
    const targetCamX = this.basePosition.x + this.currentParallax.x;
    const targetCamY = this.basePosition.y + this.currentParallax.y;
    const targetCamZ = this.basePosition.z + this.currentParallax.z;

    this.camera.position.x += (targetCamX - this.camera.position.x) * this.lerpSpeed;
    this.camera.position.y += (targetCamY - this.camera.position.y) * this.lerpSpeed;
    this.camera.position.z += (targetCamZ - this.camera.position.z) * this.lerpSpeed;

    // Smooth Look-At with subtle parallax shift
    const targetLookX = this.baseLookAt.x + this.currentParallax.x * 0.35;
    const targetLookY = this.baseLookAt.y + this.currentParallax.y * 0.35;
    const targetLookZ = this.baseLookAt.z;

    this.currentLookAt.x += (targetLookX - this.currentLookAt.x) * this.lookLerpSpeed;
    this.currentLookAt.y += (targetLookY - this.currentLookAt.y) * this.lookLerpSpeed;
    this.currentLookAt.z += (targetLookZ - this.currentLookAt.z) * this.lookLerpSpeed;

    this.camera.lookAt(this.currentLookAt);
  }
}

