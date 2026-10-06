/**
 * PETALS.JS
 * Fondo de pétalos suaves flotantes y sistema de confeti para la celebración final.
 */

let petalsCanvas = null;
let ctxPetals = null;
let floatingPetals = [];
let petalsAnimId = null;

let celebCanvas = null;
let ctxCeleb = null;
let celebParticles = [];
let celebAnimId = null;

export function initPetals() {
  petalsCanvas = document.getElementById('petals-canvas');
  if (!petalsCanvas) return;
  ctxPetals = petalsCanvas.getContext('2d');

  celebCanvas = document.getElementById('celebration-canvas');
  if (celebCanvas) {
    ctxCeleb = celebCanvas.getContext('2d');
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  crearPetalos();
  animarPetalos();
}

function resizeCanvas() {
  if (petalsCanvas) {
    petalsCanvas.width = petalsCanvas.clientWidth || window.innerWidth;
    petalsCanvas.height = petalsCanvas.clientHeight || window.innerHeight;
  }
  if (celebCanvas) {
    celebCanvas.width = celebCanvas.clientWidth || window.innerWidth;
    celebCanvas.height = celebCanvas.clientHeight || window.innerHeight;
  }
}

function crearPetalos() {
  floatingPetals = [];
  const cantidad = 22; // Cantidad ligera para rendimiento óptimo en celulares
  const colores = ['#fda4af', '#fecdd3', '#fbcfe8', '#ffe4e6'];

  for (let i = 0; i < cantidad; i++) {
    floatingPetals.push({
      x: Math.random() * petalsCanvas.width,
      y: Math.random() * petalsCanvas.height,
      size: 5 + Math.random() * 7,
      speedY: 0.5 + Math.random() * 1.0,
      speedX: (Math.random() - 0.5) * 0.5,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 1.8,
      opacity: 0.25 + Math.random() * 0.45,
      color: colores[Math.floor(Math.random() * colores.length)]
    });
  }
}

function animarPetalos() {
  if (!ctxPetals || !petalsCanvas) return;
  ctxPetals.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);

  floatingPetals.forEach(p => {
    p.y += p.speedY;
    p.x += Math.sin(p.y * 0.015) * 0.6;
    p.rot += p.rotSpeed;

    if (p.y > petalsCanvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * petalsCanvas.width;
    }

    ctxPetals.save();
    ctxPetals.translate(p.x, p.y);
    ctxPetals.rotate((p.rot * Math.PI) / 180);
    ctxPetals.globalAlpha = p.opacity;
    ctxPetals.fillStyle = p.color;

    ctxPetals.beginPath();
    ctxPetals.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
    ctxPetals.fill();

    ctxPetals.restore();
  });

  petalsAnimId = requestAnimationFrame(animarPetalos);
}

/**
 * Lanza la lluvia de pétalos y corazones dorados/rosados en la pantalla final
 */
export function lanzarCelebracion() {
  if (!celebCanvas || !ctxCeleb) return;
  resizeCanvas();
  celebParticles = [];

  const colores = ['#f43f5e', '#ec4899', '#fb7185', '#f59e0b', '#fbbf24', '#ffffff', '#c084fc'];

  for (let i = 0; i < 110; i++) {
    celebParticles.push({
      x: Math.random() * celebCanvas.width,
      y: -20 - Math.random() * 200,
      size: 6 + Math.random() * 9,
      color: colores[Math.floor(Math.random() * colores.length)],
      vx: (Math.random() - 0.5) * 3.8,
      vy: 2.2 + Math.random() * 4.2,
      rot: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 8,
      tipo: Math.random() > 0.4 ? 'petalo' : 'corazon'
    });
  }

  function animarCeleb() {
    ctxCeleb.clearRect(0, 0, celebCanvas.width, celebCanvas.height);

    celebParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vRot;

      if (p.y > celebCanvas.height + 30) {
        p.y = -20;
        p.x = Math.random() * celebCanvas.width;
      }

      ctxCeleb.save();
      ctxCeleb.translate(p.x, p.y);
      ctxCeleb.rotate((p.rot * Math.PI) / 180);
      ctxCeleb.fillStyle = p.color;

      if (p.tipo === 'petalo') {
        ctxCeleb.beginPath();
        ctxCeleb.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctxCeleb.fill();
      } else {
        const s = p.size * 0.7;
        ctxCeleb.beginPath();
        ctxCeleb.moveTo(0, s * 0.3);
        ctxCeleb.bezierCurveTo(-s, -s * 0.5, -s * 0.5, -s, 0, -s * 0.3);
        ctxCeleb.bezierCurveTo(s * 0.5, -s, s, -s * 0.5, 0, s * 0.3);
        ctxCeleb.fill();
      }

      ctxCeleb.restore();
    });

    celebAnimId = requestAnimationFrame(animarCeleb);
  }

  if (celebAnimId) cancelAnimationFrame(celebAnimId);
  animarCeleb();
}

export function detenerCelebracion() {
  if (celebAnimId) cancelAnimationFrame(celebAnimId);
  if (ctxCeleb && celebCanvas) {
    ctxCeleb.clearRect(0, 0, celebCanvas.width, celebCanvas.height);
  }
}
