/**
 * GARDEN.JS
 * Jardín botánico interactivo donde nacen flores en el punto exacto de la pantalla donde ella toca.
 */
import { CONFIG } from './config.js';

let floresPlantadas = 0;
let jardinCompleto = false;

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

  function plantarRamilleteDeFlores(centroX, centroY) {
    // Generar entre 15 y 25 flores por cada toque según lo solicitado
    const cantidad = Math.floor(Math.random() * 11) + 15; // 15 a 25 flores

    if (onPlantCallback) onPlantCallback();

    const areaWidth = jardinArea.clientWidth || 360;
    const areaHeight = jardinArea.clientHeight || 640;

    for (let i = 0; i < cantidad; i++) {
      // Pequeño escalonamiento temporal para una animación fluida en cascada
      setTimeout(() => {
        floresPlantadas++;

        // Dispersión radial suave alrededor del punto de toque
        const radio = Math.pow(Math.random(), 0.7) * 125;
        const angulo = Math.random() * Math.PI * 2;
        
        const fx = Math.min(Math.max(25, centroX + Math.cos(angulo) * radio), areaWidth - 28);
        const fy = Math.min(Math.max(85, centroY + Math.sin(angulo) * radio), areaHeight - 35);

        // Crear elemento contenedor para la flor
        const flowerDiv = document.createElement('div');
        flowerDiv.className = 'spawned-flower';
        flowerDiv.style.left = `${Math.round(fx)}px`;
        flowerDiv.style.top = `${Math.round(fy)}px`;

        // Escoger una flor aleatoria de las 5 disponibles en SVG
        const svgSrc = rutasFlores[Math.floor(Math.random() * rutasFlores.length)];
        const imgEl = document.createElement('img');
        imgEl.src = svgSrc;
        imgEl.alt = 'Flor';
        imgEl.style.width = '48px';
        imgEl.style.height = '68px';
        imgEl.draggable = false;

        // Variación de escala aleatoria para dinamismo natural
        const scale = 0.75 + Math.random() * 0.45;
        flowerDiv.style.transform = `scale(${scale})`;

        flowerDiv.appendChild(imgEl);
        jardinArea.appendChild(flowerDiv);

        // Actualizar marcador y barra de progreso
        if (flowerCounter) {
          flowerCounter.textContent = `${floresPlantadas}/${CONFIG.metaFlores} 🌸`;
        }
        if (flowerProgress) {
          const pct = Math.min(100, (floresPlantadas / CONFIG.metaFlores) * 100);
          flowerProgress.style.width = `${pct}%`;
        }

        // Comprobar si se alcanzó la meta
        if (floresPlantadas >= CONFIG.metaFlores && !jardinCompleto) {
          jardinCompleto = true;
          iluminarJardin();

          if (onCompleteCallback) onCompleteCallback();

          setTimeout(() => {
            if (jardinModal) jardinModal.classList.add('active');
          }, 600);
        }
      }, i * 30);
    }
  }

  // Soporte táctil estricto con pointerdown
  jardinArea.addEventListener('pointerdown', (e) => {
    const rect = jardinArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Evitar plantar dentro del encabezado superior
    if (y > 75) {
      plantarRamilleteDeFlores(x, y);
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

  const jardinArea = document.getElementById('jardin-interactive-area');
  const flowerCounter = document.getElementById('flower-counter');
  const flowerProgress = document.getElementById('flower-progress-fill');
  const jardinModal = document.getElementById('jardin-modal');

  if (jardinArea) jardinArea.innerHTML = '';
  if (flowerCounter) flowerCounter.textContent = `0/${CONFIG.metaFlores} 🌸`;
  if (flowerProgress) flowerProgress.style.width = '0%';
  if (jardinModal) jardinModal.classList.remove('active');
}
