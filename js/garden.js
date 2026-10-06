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

    // 100 flores llenando por completo la pantalla del celular
    const cantidadTotal = 100; 

    // Distribución por toda la superficie (10 x 10 con variación orgánica)
    const posiciones = [];
    const filas = 10;
    const columnas = 10;

    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < columnas; c++) {
        const celdaW = (areaWidth - 30) / columnas;
        const celdaH = (areaHeight - 120) / filas;

        const posX = 15 + c * celdaW + (Math.random() * 0.85 + 0.08) * celdaW;
        const posY = 85 + r * celdaH + (Math.random() * 0.85 + 0.08) * celdaH;

        posiciones.push({ x: posX, y: posY });
      }
    }

    // Ordenar de adentro hacia afuera desde el punto de toque (efecto onda floral)
    posiciones.sort((a, b) => {
      const distA = Math.hypot(a.x - toqueX, a.y - toqueY);
      const distB = Math.hypot(b.x - toqueX, b.y - toqueY);
      return distA - distB;
    });

    // Florecimiento escalonado optimizado para rendimiento en móviles (en micro-lotes de 2-3 flores)
    for (let i = 0; i < cantidadTotal; i++) {
      const delay = Math.floor(i / 3) * 26; // 3 flores por lote cada 26ms = ~850ms en total

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
        imgEl.style.width = '44px';
        imgEl.style.height = '62px';
        imgEl.draggable = false;

        // Escalas orgánicas
        const scale = 0.65 + Math.random() * 0.45;
        flowerDiv.style.transform = `scale(${scale})`;

        flowerDiv.appendChild(imgEl);
        jardinArea.appendChild(flowerDiv);

        // Al terminar de florecer las 100 flores
        if (i === cantidadTotal - 1 && !jardinCompleto) {
          jardinCompleto = true;
          iluminarJardin();

          if (onCompleteCallback) onCompleteCallback();

          setTimeout(() => {
            if (jardinModal) jardinModal.classList.add('active');
          }, 650);
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

function iluminarJardin() {
  const flowers = document.querySelectorAll('.spawned-flower');
  flowers.forEach(fl => {
    fl.style.filter = 'drop-shadow(0 0 10px rgba(251, 191, 36, 0.9))';
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
