/**
 * HEARTS-GAME.JS
 * Minijuego táctil: Caída masiva de corazones suaves para atrapar con el dedo.
 * Funciona internamente sin mostrar números, contadores ni barras de progreso.
 * Se gana al atrapar 10 corazones.
 */
import { CONFIG } from './config.js';

let score = 0;
let juegoActivo = false;
let spawnInterval = null;
let animFrames = [];

const simbolosCorazones = ['💖', '💕', '💗', '💓', '💘', '💝', '🌸', '✨'];

export function initHeartsGame(onCatchCallback, onWinCallback) {
  window._heartsCallbacks = { onCatchCallback, onWinCallback };
}

export function startHeartsGame() {
  if (juegoActivo || score >= CONFIG.metaCorazones) return;
  juegoActivo = true;

  const gameArea = document.getElementById('juego-area');
  if (gameArea) gameArea.innerHTML = '';

  // Oleada inicial masiva distribuida verticalmente para poblar la pantalla de inmediato
  for (let i = 0; i < 8; i++) {
    const yInicial = (i * 65) - 15;
    crearCorazonCayendo(yInicial);
  }

  // Intervalo rápido arrojando oleadas de 2 a 3 corazones simultáneos
  spawnInterval = setInterval(() => {
    if (!juegoActivo) return;
    const lote = Math.floor(Math.random() * 2) + 2; // 2 a 3 corazones simultáneos
    for (let k = 0; k < lote; k++) {
      crearCorazonCayendo(-60 - (k * 25));
    }
  }, 360);
}

export function stopHeartsGame() {
  juegoActivo = false;
  if (spawnInterval) clearInterval(spawnInterval);
  animFrames.forEach(id => cancelAnimationFrame(id));
  animFrames = [];

  const gameArea = document.getElementById('juego-area');
  if (gameArea) gameArea.innerHTML = '';
}

function crearCorazonCayendo(initialY = -60) {
  const gameArea = document.getElementById('juego-area');
  if (!gameArea || !juegoActivo) return;

  const heart = document.createElement('div');
  heart.className = 'falling-heart';
  
  const emoji = simbolosCorazones[Math.floor(Math.random() * simbolosCorazones.length)];
  heart.textContent = emoji;

  // Tamaño optimizado para la pantalla táctil de celular (46px - 60px)
  const size = 46 + Math.random() * 16;
  heart.style.fontSize = `${size}px`;

  const maxX = (gameArea.clientWidth || 360) - size - 20;
  const startX = 12 + Math.random() * Math.max(10, maxX);
  heart.style.left = `${startX}px`;
  heart.style.top = `${initialY}px`;

  // Velocidad de caída fluida
  const totalDist = (gameArea.clientHeight || 640) + 80 - initialY;
  const duration = 3000 + Math.random() * 1400;
  const startTime = performance.now();

  gameArea.appendChild(heart);

  let frameId;
  function animar(now) {
    if (!juegoActivo || !heart.parentElement) return;
    const progress = (now - startTime) / duration;

    if (progress < 1) {
      const currentY = initialY + progress * totalDist;
      const sway = Math.sin(progress * Math.PI * 4) * 14;
      heart.style.top = `${currentY}px`;
      heart.style.left = `${startX + sway}px`;
      frameId = requestAnimationFrame(animar);
      animFrames.push(frameId);
    } else {
      if (heart.parentElement) heart.remove();
    }
  }
  frameId = requestAnimationFrame(animar);
  animFrames.push(frameId);

  // Evento táctil
  function tocar(e) {
    e.stopPropagation();
    e.preventDefault();
    cancelAnimationFrame(frameId);
    atrapar(heart, startX, parseFloat(heart.style.top) || 120);
  }

  heart.addEventListener('pointerdown', tocar);
}

function atrapar(heartElement, x, y) {
  if (!heartElement.parentElement) return;
  heartElement.remove();

  score++;

  if (window._heartsCallbacks?.onCatchCallback) {
    window._heartsCallbacks.onCatchCallback();
  }

  explotarParticulas(x, y);

  // Se gana silenciosamente al alcanzar 10 corazones
  if (score >= CONFIG.metaCorazones) {
    stopHeartsGame();

    if (window._heartsCallbacks?.onWinCallback) {
      window._heartsCallbacks.onWinCallback();
    }

    const juegoModal = document.getElementById('juego-modal');
    setTimeout(() => {
      if (juegoModal) juegoModal.classList.add('active');
    }, 450);
  }
}

function explotarParticulas(x, y) {
  const gameArea = document.getElementById('juego-area');
  if (!gameArea) return;

  const particulas = ['✨', '💕', '🌸', '💖'];
  for (let i = 0; i < 6; i++) {
    const p = document.createElement('div');
    p.className = 'mini-pop';
    p.textContent = particulas[Math.floor(Math.random() * particulas.length)];
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;

    const angulo = Math.random() * Math.PI * 2;
    const dist = 32 + Math.random() * 45;
    p.style.setProperty('--dx', `${Math.cos(angulo) * dist}px`);
    p.style.setProperty('--dy', `${Math.sin(angulo) * dist}px`);

    gameArea.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

export function resetHeartsGame() {
  score = 0;
  stopHeartsGame();

  const juegoModal = document.getElementById('juego-modal');
  if (juegoModal) juegoModal.classList.remove('active');
}
