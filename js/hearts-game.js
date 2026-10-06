/**
 * HEARTS-GAME.JS
 * Minijuego táctil: Caída masiva de corazones suaves acelerada por GPU.
 * Funciona internamente sin contadores visibles. Se gana al atrapar 10 corazones.
 */
import { CONFIG } from './config.js';

let score = 0;
let juegoActivo = false;
let spawnInterval = null;

const simbolosCorazones = ['💖', '💕', '💗', '💓', '💘', '💝', '🌸', '✨'];

export function initHeartsGame(onCatchCallback, onWinCallback) {
  window._heartsCallbacks = { onCatchCallback, onWinCallback };
}

export function startHeartsGame() {
  if (juegoActivo || score >= CONFIG.metaCorazones) return;
  juegoActivo = true;

  const gameArea = document.getElementById('juego-area');
  if (gameArea) gameArea.innerHTML = '';

  // Oleada inicial distribuida verticalmente
  for (let i = 0; i < 6; i++) {
    crearCorazonCayendo(i * 450);
  }

  // Intervalo continuo de caída de corazones
  spawnInterval = setInterval(() => {
    if (!juegoActivo) return;
    const lote = Math.floor(Math.random() * 2) + 1;
    for (let k = 0; k < lote; k++) {
      crearCorazonCayendo(k * 180);
    }
  }, 480);
}

export function stopHeartsGame() {
  juegoActivo = false;
  if (spawnInterval) clearInterval(spawnInterval);
  spawnInterval = null;

  const gameArea = document.getElementById('juego-area');
  if (gameArea) gameArea.innerHTML = '';
}

function crearCorazonCayendo(delayMs = 0) {
  const gameArea = document.getElementById('juego-area');
  if (!gameArea || !juegoActivo) return;

  const heart = document.createElement('div');
  heart.className = 'falling-heart';
  
  const emoji = simbolosCorazones[Math.floor(Math.random() * simbolosCorazones.length)];
  heart.textContent = emoji;

  const size = 46 + Math.random() * 16;
  heart.style.fontSize = `${size}px`;

  const maxX = (gameArea.clientWidth || 360) - size - 24;
  const startX = 14 + Math.random() * Math.max(10, maxX);
  heart.style.left = `${startX}px`;
  heart.style.top = `0px`;

  const dur = (3.4 + Math.random() * 1.4).toFixed(2);
  const sway = ((Math.random() - 0.5) * 40).toFixed(1);
  heart.style.setProperty('--fall-duration', `${dur}s`);
  heart.style.setProperty('--sway-x', `${sway}px`);
  if (delayMs > 0) {
    heart.style.animationDelay = `${delayMs}ms`;
  }

  heart.addEventListener('animationend', () => {
    if (heart.parentElement) heart.remove();
  });

  // Evento táctil instantáneo
  function tocar(e) {
    e.stopPropagation();
    e.preventDefault();
    const rect = heart.getBoundingClientRect();
    const areaRect = gameArea.getBoundingClientRect();
    const x = rect.left - areaRect.left + rect.width / 2;
    const y = rect.top - areaRect.top + rect.height / 2;
    atrapar(heart, x, y);
  }

  heart.addEventListener('pointerdown', tocar);

  gameArea.appendChild(heart);
}

function atrapar(heartElement, x, y) {
  if (!heartElement.parentElement) return;
  heartElement.remove();

  score++;

  // Cinnamoroll da un saltito o giro en su avioncito
  const cinnaAvion = document.getElementById('cinnamoroll-avion');
  if (cinnaAvion) {
    cinnaAvion.classList.remove('avion-jump');
    void cinnaAvion.offsetWidth;
    cinnaAvion.classList.add('avion-jump');
  }

  if (window._heartsCallbacks?.onCatchCallback) {
    window._heartsCallbacks.onCatchCallback();
  }

  explotarParticulas(x, y);

  // Al alcanzar la meta
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
    const dist = 30 + Math.random() * 40;
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
