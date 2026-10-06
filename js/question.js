/**
 * QUESTION.JS
 * Lógica de la pregunta imposible:
 * El botón "No" huye a cualquier parte de la pantalla visible del celular
 * (arriba, abajo, izquierda, derecha, esquinas), sin salirse de los límites
 * y verificando estrictamente que JAMÁS se solape con el botón "Sí" (con margen de seguridad).
 */
import { CONFIG } from './config.js';

let intentosNo = 0;
let escalaBtnSi = 1;

export function initQuestion(onYesCallback, onNoAttemptCallback) {
  const btnSi = document.getElementById('btn-si');
  const btnNo = document.getElementById('btn-no');
  const screenPregunta = document.getElementById('screen-pregunta');

  if (!btnSi || !btnNo || !screenPregunta) return;

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

    // Hacer crecer el botón SÍ de manera gradual
    escalaBtnSi = Math.min(2.1, escalaBtnSi + 0.12);
    btnSi.style.transform = `scale(${escalaBtnSi})`;
    btnSi.style.boxShadow = `0 ${8 + intentosNo * 2}px ${24 + intentosNo * 4}px rgba(255, 77, 109, ${0.4 + intentosNo * 0.05})`;

    // Obtener dimensiones de la pantalla completa del celular y del botón Sí
    const screenRect = screenPregunta.getBoundingClientRect();
    const siRect = btnSi.getBoundingClientRect();
    const btnRect = btnNo.getBoundingClientRect();

    // Coordenadas relativas del botón Sí dentro de la pantalla completa
    const siRelLeft = siRect.left - screenRect.left;
    const siRelTop = siRect.top - screenRect.top;
    const siRelRight = siRelLeft + siRect.width;
    const siRelBottom = siRelTop + siRect.height;

    // Margen de seguridad estricto para que en ningún momento se toquen o solapen
    const MARGEN = 34;

    // Límites para abarcar TODA la pantalla visible del celular
    const minLeft = 14;
    const maxLeft = Math.max(minLeft, screenRect.width - btnRect.width - 14);
    
    // Evitar barra superior extrema (para no tapar notch o botón volver)
    const minTop = 65;
    const maxTop = Math.max(minTop, screenRect.height - btnRect.height - 30);

    let nuevoLeft = minLeft;
    let nuevoTop = maxTop;
    let encontroPosicion = false;

    // Probar hasta 80 posiciones aleatorias por toda la pantalla
    for (let intento = 0; intento < 80; intento++) {
      const candLeft = minLeft + Math.random() * (maxLeft - minLeft);
      const candTop = minTop + Math.random() * (maxTop - minTop);
      const candRight = candLeft + btnRect.width;
      const candBottom = candTop + btnRect.height;

      // Comprobar que NO haya colisión con el botón Sí (+ margen de seguridad)
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

    // Si no encontró por azar, enviarlo a la esquina más opuesta a la ubicación del botón Sí
    if (!encontroPosicion) {
      nuevoTop = (siRelTop > screenRect.height / 2) ? minTop : maxTop;
      nuevoLeft = (siRelLeft > screenRect.width / 2) ? minLeft : maxLeft;
    }

    // Cinnamoroll Cupido se inclina y sacude sorprendido
    const cinnaCupido = document.getElementById('cinnamoroll-cupido');
    if (cinnaCupido) {
      cinnaCupido.classList.remove('cupido-surprised');
      void cinnaCupido.offsetWidth; // reiniciar animación
      cinnaCupido.classList.add('cupido-surprised');
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

    // Cinnamoroll Cupido salta y lanza corazones
    const cinnaCupido = document.getElementById('cinnamoroll-cupido');
    if (cinnaCupido) {
      cinnaCupido.classList.remove('cupido-surprised');
      cinnaCupido.classList.add('cupido-celebrate');
    }
    lanzarCorazonesCupido();

    if (onYesCallback) onYesCallback();
  });
}

function lanzarCorazonesCupido() {
  const container = document.getElementById('screen-pregunta');
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const h = document.createElement('div');
    h.className = 'mini-pop';
    h.textContent = ['💘', '💖', '💕', '✨'][Math.floor(Math.random() * 4)];
    h.style.left = '50%';
    h.style.top = '36%';

    const angulo = (Math.PI / 6) + Math.random() * (Math.PI * 2 / 3);
    const dist = 50 + Math.random() * 90;
    h.style.setProperty('--dx', `${Math.cos(angulo) * dist}px`);
    h.style.setProperty('--dy', `${-Math.sin(angulo) * dist}px`);

    container.appendChild(h);
    setTimeout(() => h.remove(), 700);
  }
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
    btnNo.style.bottom = '45px';
    btnNo.style.left = '50%';
    btnNo.style.top = 'auto';
    btnNo.style.transform = 'translateX(-50%)';
  }
}
