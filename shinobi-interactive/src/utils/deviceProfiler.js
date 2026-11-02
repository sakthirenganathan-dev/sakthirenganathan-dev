// Adaptive Hardware & Device Profiler
// Dynamically adjusts 3D WebGL quality, particle counts, and power efficiency based on client hardware.

export function getDeviceProfile() {
  const isBrowser = typeof window !== 'undefined';
  if (!isBrowser) {
    return {
      tier: 'desktop',
      particleCount: 3000,
      maxPixelRatio: 2.0,
      reducedMotion: false,
      isMobile: false,
    };
  }

  const width = window.innerWidth;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Mobile Tier (< 768px or touch phone)
  if (width < 768 || (isTouch && width < 900)) {
    return {
      tier: 'mobile',
      particleCount: 800, // Safe GPU memory target for mobile
      maxPixelRatio: Math.min(window.devicePixelRatio, 1.5),
      reducedMotion,
      isMobile: true,
      shadowQuality: 'low',
    };
  }

  // Laptop / Tablet Tier (768px - 1200px)
  if (width < 1200) {
    return {
      tier: 'laptop',
      particleCount: 1800,
      maxPixelRatio: Math.min(window.devicePixelRatio, 1.75),
      reducedMotion,
      isMobile: false,
      shadowQuality: 'medium',
    };
  }

  // High-End Desktop Tier (> 1200px)
  return {
    tier: 'desktop',
    particleCount: 3000,
    maxPixelRatio: Math.min(window.devicePixelRatio, 2.0),
    reducedMotion,
    isMobile: false,
    shadowQuality: 'high',
  };
}

// Observes Page Visibility to suspend WebGL animations and save battery when tab is backgrounded
export function setupVisibilityObserver(onHidden, onVisible) {
  if (typeof document === 'undefined') return () => {};

  const handleVisibility = () => {
    if (document.hidden) {
      if (onHidden) onHidden();
    } else {
      if (onVisible) onVisible();
    }
  };

  document.addEventListener('visibilitychange', handleVisibility);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
  };
}

