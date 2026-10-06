/**
 * ENVELOPE.JS
 * Control del sobre interactivo, apertura y efecto de máquina de escribir para la carta.
 */
import { CONFIG } from './config.js';

let sobreAbierto = false;
let mecanografiaIniciada = false;
let typewriterTimeout = null;

export function initEnvelope(onOpenCallback) {
  const sobreContainer = document.getElementById('envelope-trigger');
  const btnIrJardin = document.getElementById('btn-ir-jardin');
  const hintText = document.getElementById('envelope-hint-text');

  if (!sobreContainer) return;

  sobreContainer.addEventListener('pointerdown', () => {
    if (sobreAbierto) return;
    sobreAbierto = true;
    sobreContainer.classList.add('open');

    if (hintText) {
      hintText.textContent = 'Desliza hacia abajo para leer 📜';
    }

    if (onOpenCallback) onOpenCallback();

    setTimeout(() => {
      iniciarMecanografia(btnIrJardin);
    }, 700);
  });
}

function iniciarMecanografia(btnContinuar) {
  if (mecanografiaIniciada) return;
  mecanografiaIniciada = true;

  const typedTextEl = document.getElementById('typed-text');
  if (!typedTextEl) return;

  const texto = CONFIG.cartaMensaje;
  let i = 0;
  typedTextEl.textContent = '';

  function escribir() {
    if (i < texto.length) {
      typedTextEl.textContent += texto.charAt(i);
      i++;
      const char = texto.charAt(i - 1);
      const delay = char === '\n' ? 220 : (Math.random() * 20 + 22);
      typewriterTimeout = setTimeout(escribir, delay);
    } else {
      if (btnContinuar) {
        btnContinuar.style.opacity = '1';
        btnContinuar.style.pointerEvents = 'auto';
      }
    }
  }

  escribir();
}

export function resetEnvelope() {
  sobreAbierto = false;
  mecanografiaIniciada = false;
  if (typewriterTimeout) clearTimeout(typewriterTimeout);

  const sobreContainer = document.getElementById('envelope-trigger');
  const typedTextEl = document.getElementById('typed-text');
  const hintText = document.getElementById('envelope-hint-text');
  const btnIrJardin = document.getElementById('btn-ir-jardin');

  if (sobreContainer) sobreContainer.classList.remove('open');
  if (typedTextEl) typedTextEl.textContent = '';
  if (hintText) hintText.textContent = '👇 Toca el sobre para abrirlo';
  if (btnIrJardin) {
    btnIrJardin.style.opacity = '0.3';
    btnIrJardin.style.pointerEvents = 'none';
  }
}
