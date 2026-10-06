/**
 * GARDEN.JS
 * Jardín botánico interactivo:
 * Con un solo toque brota un jardín completo llenando toda la pantalla con muchísimas flores
 * animadas de forma escalonada.
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
  const flowerCounter = document.getElementById('flower-counter');
  const flowerProgress = document.getElementById('flower-progress-fill');
  const jardinModal = document.getElementById('jardin-modal');

  if (!jardinArea) return;

  function armarJardinCompleto(toqueX, toqueY) {
    if (onPlantCallback) onPlantCallback();

    const areaWidth = jardinArea.clientWidth || 360;
    const areaHeight = jardinArea.clientHeight || 640;

    // Cantidad masiva de flores para llenar toda la pantalla del celular
    const cantidadTotal = 40; 

    // Coordenadas distribuidas por toda la pantalla (rejilla suave con aleatoriedad)
    const posiciones = [];
    const filas = 8;
    const columnas = 5;

    for (let r = 0; r < filas; r++) {
      for (let c = 0; c < columnas; c++) {
        const celdaW = (areaWidth - 40) / columnas;
        const celdaH = (areaHeight - 140) / filas;

        const posX = 20 + c * celdaW + (Math.random() * 0.8 + 0.1) * celdaW;
        const posY = 90 + r * celdaH + (Math.random() * 0.8 + 0.1) * celdaH;

        posiciones.push({ x: posX, y: posY });
      }
    }

    // Ordenar las posiciones por distancia al punto donde ella tocó para un efecto de onda expansiva
    posiciones.sort((a, b) => {
      const distA = Math.hypot(a.x - toqueX, a.y - toqueY);
      const distB = Math.hypot(b.x - toqueX, b.y - toqueY);
      return distA - distB;
    });

    // Florecer de manera escalonada en toda la pantalla
    for (let i = 0; i < Math.min(cantidadTotal, posiciones.length); i++) {
      const tid = setTimeout(() => {
        floresPlantadas++;

        const pos = posiciones[i];
        const flowerDiv = document.createElement('div');
        flowerDiv.className = 'spawned-flower';
        flowerDiv.style.left = `${Math.round(pos.x)}px`;
        flowerDiv.style.top = `${Math.round(pos.y)}px`;

        // Flor SVG aleatoria
        const svgSrc = rutasFlores[Math.floor(Math.random() * rutasFlores.length)];
        const imgEl = document.createElement('img');
        imgEl.src = svgSrc;
        imgEl.alt = 'Flor';
        imgEl.style.width = '48px';
        imgEl.style.height = '68px';
        imgEl.draggable = false;

        // Escala variada para sensación de profundidad
        const scale = 0.72 + Math.random() * 0.46;
        flowerDiv.style.transform = `scale(${scale})`;

        flowerDiv.appendChild(imgEl);
        jardinArea.appendChild(flowerDiv);

        // Actualizar contador y barra de progreso
        if (flowerCounter) {
          flowerCounter.textContent = `${Math.min(floresPlantadas, CONFIG.metaFlores)}/${CONFIG.metaFlores} 🌸`;
        }
        if (flowerProgress) {
          const pct = Math.min(100, (floresPlantadas / CONFIG.metaFlores) * 100);
          flowerProgress.style.width = `${pct}%`;
        }

        // Al alcanzar la meta
        if (floresPlantadas >= CONFIG.metaFlores && !jardinCompleto) {
          jardinCompleto = true;
          iluminarJardin();

          if (onCompleteCallback) onCompleteCallback();

          setTimeout(() => {
            if (jardinModal) jardinModal.classList.add('active');
          }, 600);
        }
      }, i * 28); // 28ms entre cada flor para florecimiento rápido y espectacular

      timeoutIds.push(tid);
    }
  }

  // Soporte táctil con pointerdown (un solo toque crea el jardín entero)
  jardinArea.addEventListener('pointerdown', (e) => {
    const rect = jardinArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Solo si no es en la barra superior
    if (y > 75) {
      armarJardinCompleto(x, y);
    }
  });
}

function iluminarJardin() {
  const flowers = document.querySelectorAll('.spawned-flower');
  flowers.forEach(fl => {
    fl.style.filter = 'drop-shadow(0 0 14px rgba(251, 191, 36, 0.95))';
  });
}

export function resetGarden() {
  floresPlantadas = 0;
  jardinCompleto = false;

  // Cancelar timeouts pendientes
  timeoutIds.forEach(id => clearTimeout(id));
  timeoutIds = [];

  const jardinArea = document.getElementById('jardin-interactive-area');
  const flowerCounter = document.getElementById('flower-counter');
  const flowerProgress = document.getElementById('flower-progress-fill');
  const jardinModal = document.getElementById('jardin-modal');

  if (jardinArea) jardinArea.innerHTML = '';
  if (flowerCounter) flowerCounter.textContent = `0/${CONFIG.metaFlores} 🌸`;
  if (flowerProgress) flowerProgress.style.width = '0%';
  if (jardinModal) jardinModal.classList.remove('active');
}
