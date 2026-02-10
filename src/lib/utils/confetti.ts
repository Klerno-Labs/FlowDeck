/**
 * Elite Confetti Celebration Effects
 * Canva-style celebrations for publishing success
 */

import confetti from 'canvas-confetti';

/**
 * Celebrate with confetti explosion
 */
export function celebrateSuccess() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Multi-burst effect
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#00B4D8', '#1E5AA8', '#8DC63F'],
  });

  fire(0.2, {
    spread: 60,
    colors: ['#F17A2C', '#4169E1', '#00B4D8'],
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#1E5AA8', '#8DC63F', '#F17A2C'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#00B4D8', '#4169E1'],
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#8DC63F', '#F17A2C'],
  });
}

/**
 * Celebrate with fireworks
 */
export function celebratePublish() {
  const duration = 2000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // Fireworks from different positions
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#00B4D8', '#1E5AA8', '#8DC63F', '#F17A2C', '#4169E1'],
    });

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#00B4D8', '#1E5AA8', '#8DC63F', '#F17A2C', '#4169E1'],
    });
  }, 250);
}

/**
 * Quick burst celebration
 */
export function celebrateQuick() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#00B4D8', '#1E5AA8', '#8DC63F', '#F17A2C'],
    zIndex: 9999,
  });
}

/**
 * Subtle success celebration
 */
export function celebrateSubtle() {
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#00B4D8', '#1E5AA8'],
    zIndex: 9999,
  });

  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#8DC63F', '#F17A2C'],
    zIndex: 9999,
  });
}
