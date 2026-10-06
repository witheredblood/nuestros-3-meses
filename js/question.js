/**
 * QUESTION.JS
 * Lógica de la pregunta imposible:
 * El botón "No" huye a posiciones aleatorias seguras dentro de la pantalla del celular
 * mientras el botón "Sí" crece de tamaño con cada intento.
 */
import { CONFIG } from './config.js';

let intentosNo = 0;
let escalaBtnSi = 1;

export function initQuestion(onYesCallback, onNoAttemptCallback) {
  const btnSi = document.getElementById('btn-si');
  const btnNo = document.getElementById('btn-no');
  const container = document.getElementById('pregunta-container');

  if (!btnSi || !btnNo || !container) return;

  function escaparBotonNo(e) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    intentosNo++;

    if (onNoAttemptCallback) onNoAttemptCallback();

    // Cambiar por una frase divertida de la configuración
    const frases = CONFIG.frasesBotonNo;
    const frase = frases[intentosNo % frases.length];
    btnNo.textContent = frase;

    // Hacer crecer el botón SÍ de manera gradual y atractiva
    escalaBtnSi = Math.min(2.1, escalaBtnSi + 0.12);
    btnSi.style.transform = `scale(${escalaBtnSi})`;
    btnSi.style.boxShadow = `0 ${8 + intentosNo * 2}px ${24 + intentosNo * 4}px rgba(255, 77, 109, ${0.4 + intentosNo * 0.05})`;

    // Calcular dimensiones y coordenadas del botón SÍ dentro del contenedor
    const contRect = container.getBoundingClientRect();
    const siRect = btnSi.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    const siRelLeft = siRect.left - contRect.left;
    const siRelTop = siRect.top - contRect.top;
    const siRelRight = siRelLeft + siRect.width;
    const siRelBottom = siRelTop + siRect.height;

    // Margen de seguridad estricto para evitar cualquier roce o solapamiento
    const MARGEN = 28;

    // Límites seguros dentro del contenedor para no desbordar la pantalla del celular
    const maxLeft = Math.max(10, contRect.width - btnRect.width - 15);
    const maxTop = Math.max(10, contRect.height - btnRect.height - 15);

    let nuevoLeft = 10;
    let nuevoTop = 10;
    let encontroPosicion = false;

    // Intentar hasta 70 combinaciones aleatorias que respeten el margen
    for (let intento = 0; intento < 70; intento++) {
      const candLeft = 10 + Math.random() * maxLeft;
      const candTop = 10 + Math.random() * maxTop;
      const candRight = candLeft + btnRect.width;
      const candBottom = candTop + btnRect.height;

      // Comprobar si hay solapamiento con la caja ampliada del botón SÍ
      const solapado = !(
        candRight < (siRelLeft - MARGEN) ||
        candLeft > (siRelRight + MARGEN) ||
        candBottom < (siRelTop - MARGEN) ||
        candTop > (siRelBottom + MARGEN)
      );

      if (!solapado) {
        nuevoLeft = candLeft;
        nuevoTop = candTop;
        encontroPosicion = true;
        break;
      }
    }

    // Si por el tamaño del botón SÍ no se halló por azar, enviarlo a la zona más despejada
    if (!encontroPosicion) {
      if (siRelTop > contRect.height / 2) {
        nuevoTop = 10;
      } else {
        nuevoTop = maxTop;
      }
      nuevoLeft = (siRelLeft > contRect.width / 2) ? 10 : maxLeft;
    }

    btnNo.style.bottom = 'auto';
    btnNo.style.transform = 'none';
    btnNo.style.left = `${Math.round(nuevoLeft)}px`;
    btnNo.style.top = `${Math.round(nuevoTop)}px`;
  }

  // Capturar eventos táctiles antes del clic
  btnNo.addEventListener('pointerdown', escaparBotonNo);
  btnNo.addEventListener('touchstart', escaparBotonNo, { passive: false });
  btnNo.addEventListener('mouseover', escaparBotonNo);

  // Al pulsar Sí
  btnSi.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    if (onYesCallback) onYesCallback();
  });
}

export function resetQuestion() {
  intentosNo = 0;
  escalaBtnSi = 1;

  const btnSi = document.getElementById('btn-si');
  const btnNo = document.getElementById('btn-no');

  if (btnSi) {
    btnSi.style.transform = 'scale(1)';
    btnSi.style.boxShadow = '';
  }
  if (btnNo) {
    btnNo.textContent = 'No 🙈';
    btnNo.style.bottom = '25px';
    btnNo.style.left = '50%';
    btnNo.style.top = 'auto';
    btnNo.style.transform = 'translateX(-50%)';
  }
}
