/**
 * MAIN.JS
 * Orquestador principal de la aplicación: Navegación, Audio, Estela de purpurina, Haptics y Ciclo de vida.
 */
import { CONFIG } from './config.js';
import { initPetals, lanzarCelebracion, detenerCelebracion } from './petals.js';
import { initEnvelope, resetEnvelope } from './envelope.js';
import { initGarden, resetGarden } from './garden.js';
import { initHeartsGame, startHeartsGame, stopHeartsGame, resetHeartsGame } from './hearts-game.js';
import { initQuestion, resetQuestion } from './question.js';

/* ==========================================================================
   1. VIBRACIÓN HÁPTICA PARA CELULARES
   ========================================================================== */
export function vibrar(patron = 25) {
  if (navigator.vibrate) {
    try {
      navigator.vibrate(patron);
    } catch (e) {}
  }
}

/* ==========================================================================
   2. SISTEMA DE AUDIO (AUDIO REAL MP3 O SINTETIZADOR DULCE INTEGRADO)
   ========================================================================== */
let audioCtx = null;
let audioHtml = null;
let isPlaying = false;
let synthInterval = null;
let btnMusica = null;

const notasRomanticas = [261.63, 329.63, 392.00, 440.00, 523.25, 659.25, 587.33, 493.88];

function initAudioSystem() {
  btnMusica = document.getElementById('btn-musica');
  audioHtml = new Audio(CONFIG.archivoMusica);
  audioHtml.loop = true;

  audioHtml.addEventListener('error', () => {
    audioHtml = null;
  });
}

export function playCutePop(freq = 780) {
  if (!audioCtx || !isPlaying) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, audioCtx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.12);
  } catch (e) {}
}

function playSynthesizedNote(freq, dur = 1.3) {
  if (!audioCtx || !isPlaying) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.07, audioCtx.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + dur);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  } catch (err) {}
}

function toggleAudio() {
  vibrar(20);
  isPlaying = !isPlaying;

  const btn = btnMusica || document.getElementById('btn-musica');
  if (isPlaying) {
    if (btn) {
      btn.classList.add('playing');
      btn.textContent = '💖';
    }

    if (audioHtml) {
      audioHtml.play().catch(() => {
        startSynthesizer();
      });
    } else {
      startSynthesizer();
    }
  } else {
    if (btn) {
      btn.classList.remove('playing');
      btn.textContent = '🎵';
    }
    if (audioHtml) audioHtml.pause();
    if (synthInterval) clearInterval(synthInterval);
  }
}

function startSynthesizer() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  let notaIdx = 0;
  const patron = [0, 2, 4, 1, 3, 5, 2, 4, 6, 3, 5, 7];
  synthInterval = setInterval(() => {
    if (!isPlaying) return;
    const f = notasRomanticas[patron[notaIdx % patron.length]];
    playSynthesizedNote(f, 1.4);
    notaIdx++;
  }, 480);
}

/* ==========================================================================
   3. ESTELA TÁCTIL (PURPURINA Y ESTRELLITAS AL DESLIZAR EL DEDO)
   ========================================================================== */
function initTouchSparkles() {
  const container = document.getElementById('app-container');
  if (!container) return;

  let lastSparkleTime = 0;
  const simbolos = ['✨', '⭐', '💖', '🌸', '💫'];

  function spawnSparkle(clientX, clientY) {
    const now = performance.now();
    if (now - lastSparkleTime < 50) return; // 60fps respetuoso con el procesador
    lastSparkleTime = now;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const sparkle = document.createElement('div');
    sparkle.className = 'touch-sparkle';
    sparkle.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 650);
  }

  container.addEventListener('pointermove', (e) => {
    if (e.buttons > 0 || e.pointerType === 'touch') {
      spawnSparkle(e.clientX, e.clientY);
    }
  }, { passive: true });

  container.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      spawnSparkle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
}

/* ==========================================================================
   4. GESTOR DE NAVEGACIÓN ENTRE PANTALLAS
   ========================================================================== */
let pantallaActual = 'portada';
const nombresPantallas = ['portada', 'carta', 'jardin', 'juego', 'pregunta', 'final'];

export function irAPantalla(nombre) {
  vibrar(28);
  playCutePop(820);

  nombresPantallas.forEach(key => {
    const el = document.getElementById(`screen-${key}`);
    if (el) el.classList.remove('active');
  });

  const targetEl = document.getElementById(`screen-${nombre}`);
  if (targetEl) {
    targetEl.classList.add('active');
    pantallaActual = nombre;
  }

  if (nombre === 'juego') {
    startHeartsGame();
  } else {
    stopHeartsGame();
  }

  if (nombre === 'final') {
    document.body.classList.add('menu-desbloqueado');
    lanzarCelebracion();
  } else {
    detenerCelebracion();
  }
}

/* ==========================================================================
   5. APLICAR CONFIGURACIÓN AL DOM
   ========================================================================== */
function renderTextos() {
  // Portada
  const txtParaPortada = document.getElementById('txt-para-portada');
  const txtFrasePortada = document.getElementById('txt-frase-portada');
  if (txtParaPortada) txtParaPortada.textContent = `Para: ${CONFIG.nombreElla}`;
  if (txtFrasePortada) txtFrasePortada.textContent = `"${CONFIG.frasePortada}"`;

  // Carta
  const txtParaCarta = document.getElementById('txt-para-carta');
  const txtDeCarta = document.getElementById('txt-de-carta');
  if (txtParaCarta) txtParaCarta.textContent = `Para: ${CONFIG.nombreElla}`;
  if (txtDeCarta) txtDeCarta.textContent = `Con todo mi amor, ${CONFIG.tuNombre} ❤️`;

  // Jardín
  const txtJardinModal = document.getElementById('txt-jardin-modal');
  if (txtJardinModal) txtJardinModal.textContent = `"${CONFIG.mensajeJardin}"`;

  // Juego
  const txtJuegoModal = document.getElementById('txt-juego-modal');
  if (txtJuegoModal) txtJuegoModal.textContent = `"${CONFIG.mensajeJuego}"`;

  // Final
  const txtFinalMensaje = document.getElementById('txt-final-mensaje');
  const txtFinalFirma = document.getElementById('txt-final-firma');
  if (txtFinalMensaje) txtFinalMensaje.textContent = CONFIG.mensajeFinal;
  if (txtFinalFirma) txtFinalFirma.textContent = `${CONFIG.tuNombre} — ${CONFIG.firmaFinal}`;
}

/* ==========================================================================
   6. INICIALIZACIÓN
   ========================================================================== */
window.addEventListener('DOMContentLoaded', () => {
  renderTextos();
  initAudioSystem();
  initPetals();
  initTouchSparkles();

  // Ocultar pantalla de carga suavemente tras 1000ms
  setTimeout(() => {
    const loader = document.getElementById('loader-screen');
    if (loader) loader.classList.add('hidden');
  }, 1000);

  // Botón flotante de música
  if (btnMusica) {
    btnMusica.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      toggleAudio();
    });
  }

  // Inicializar Sobre y Carta
  initEnvelope(() => {
    playCutePop(900);
    if (!isPlaying) toggleAudio();
  });

  // Inicializar Jardín
  initGarden(
    () => {
      vibrar(20);
      playCutePop(720 + Math.random() * 200);
    },
    () => {
      vibrar([50, 40, 100, 40, 150]);
    }
  );

  // Inicializar Minijuego de corazones
  initHeartsGame(
    () => {
      vibrar(25);
      playCutePop(850 + Math.random() * 250);
    },
    () => {
      vibrar([60, 40, 100, 40, 150]);
    }
  );

  // Inicializar Pregunta
  initQuestion(
    () => {
      vibrar([100, 50, 100, 50, 200]);
      playCutePop(1020);
      irAPantalla('final');
    },
    () => {
      vibrar(22);
      playCutePop(540); // Toque divertido de sorpresa al escapar el No
    }
  );

  // Enlazar botones de avance del flujo lineal
  const setupNav = (id, target) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        irAPantalla(target);
      });
    }
  };

  setupNav('btn-ir-carta', 'carta');
  setupNav('btn-ir-jardin', 'jardin');
  setupNav('btn-ir-juego', 'juego');
  setupNav('btn-ir-pregunta', 'pregunta');

  // Enlazar tarjetas del menú y botones de regreso (reiniciando cada actividad desde cero)
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      const target = el.getAttribute('data-nav');
      if (target) {
        if (target === 'carta') {
          resetEnvelope();
        } else if (target === 'jardin') {
          resetGarden();
        } else if (target === 'juego') {
          resetHeartsGame();
        } else if (target === 'pregunta') {
          resetQuestion();
        }

        irAPantalla(target);
      }
    });
  });

  // Botón de reiniciar experiencia completa
  const btnReiniciar = document.getElementById('btn-reiniciar');
  if (btnReiniciar) {
    btnReiniciar.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      document.body.classList.remove('menu-desbloqueado');
      resetEnvelope();
      resetGarden();
      resetHeartsGame();
      resetQuestion();
      irAPantalla('portada');
    });
  }
});
