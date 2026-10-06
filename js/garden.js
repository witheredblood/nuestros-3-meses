/**
 * GARDEN.JS
 * Jardín botánico interactivo:
 * Con un solo toque brotan ~100 flores a la vez llenando toda la pantalla
 * con animación escalonada fluida, sin trabar el celular y sin mostrar contadores.
 */
import { CONFIG } from './config.js';

let floresPlantadas = 0;
let jardinCompleto = false;
let timeoutIds = [];

const rutasFlores = [
  'assets/img/flower-rose.svg',
  'assets/img/flower-tulip.svg',
  'assets/img/flower-daisy.svg',
  'assets/img/flower-sunflower.svg',
  'assets/img/flower-cherry.svg'
];

export function initGarden(onPlantCallback, onCompleteCallback) {
  const jardinArea = document.getElementById('jardin-interactive-area');
  const jardinModal = document.getElementById('jardin-modal');

  if (!jardinArea) return;

  function armarJardinCompleto(toqueX, toqueY) {
    if (jardinCompleto) return;
    if (onPlantCallback) onPlantCallback();

    const areaWidth = jardinArea.clientWidth || 360;
    const areaHeight = jardinArea.clientHeight || 640;

    // 80 flores optimizadas y más frondosas para máxima fluidez y belleza
    const cantidadTotal = 80; 

    // Distribución orgánica por la pantalla (8 filas x 10 columnas)
    const posiciones = [];
    const filas = 8;
    const columnas = 10;

    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < columnas; c++) {
        const celdaW = (areaWidth - 24) / columnas;
        const celdaH = (areaHeight - 110) / filas;

        const posX = 12 + c * celdaW + (Math.random() * 0.82 + 0.09) * celdaW;
        const posY = 80 + r * celdaH + (Math.random() * 0.82 + 0.09) * celdaH;

        posiciones.push({ x: posX, y: posY });
      }
    }

    // Ordenar desde el punto de toque (onda expansiva)
    posiciones.sort((a, b) => {
      const distA = Math.hypot(a.x - toqueX, a.y - toqueY);
      const distB = Math.hypot(b.x - toqueX, b.y - toqueY);
      return distA - distB;
    });

    // Florecimiento escalonado optimizado a 60fps (en lotes de 4 flores cada 26ms)
    for (let i = 0; i < cantidadTotal; i++) {
      const delay = Math.floor(i / 4) * 26; // ~520ms en total

      const tid = setTimeout(() => {
        floresPlantadas++;

        const pos = posiciones[i];
        const flowerDiv = document.createElement('div');
        flowerDiv.className = 'spawned-flower';
        flowerDiv.style.left = `${Math.round(pos.x)}px`;
        flowerDiv.style.top = `${Math.round(pos.y)}px`;

        // Flor aleatoria SVG
        const svgSrc = rutasFlores[Math.floor(Math.random() * rutasFlores.length)];
        const imgEl = document.createElement('img');
        imgEl.src = svgSrc;
        imgEl.alt = 'Flor';
        imgEl.style.width = '48px';
        imgEl.style.height = '66px';
        imgEl.draggable = false;

        // Escalas más grandes y frondosas
        const scale = 0.78 + Math.random() * 0.42;
        flowerDiv.style.transform = `scale(${scale})`;

        flowerDiv.appendChild(imgEl);
        jardinArea.appendChild(flowerDiv);

        // Al terminar de florecer las 80 flores
        if (i === cantidadTotal - 1 && !jardinCompleto) {
          jardinCompleto = true;

          if (onCompleteCallback) onCompleteCallback();

          setTimeout(() => {
            if (jardinModal) jardinModal.classList.add('active');
          }, 400);
        }
      }, delay);

      timeoutIds.push(tid);
    }
  }

  // Soporte táctil con pointerdown (un solo toque crea las 100 flores)
  jardinArea.addEventListener('pointerdown', (e) => {
    const rect = jardinArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y > 75) {
      armarJardinCompleto(x, y);
    }
  });
}

export function resetGarden() {
  floresPlantadas = 0;
  jardinCompleto = false;

  timeoutIds.forEach(id => clearTimeout(id));
  timeoutIds = [];

  const jardinArea = document.getElementById('jardin-interactive-area');
  const jardinModal = document.getElementById('jardin-modal');

  if (jardinArea) jardinArea.innerHTML = '';
  if (jardinModal) jardinModal.classList.remove('active');
}
