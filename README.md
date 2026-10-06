# 💖 3 Meses Juntos — Página Web Romántica Personalizada

Una experiencia web interactiva, moderna y diseñada **mobile-first** para celebrar 3 meses de novios. No requiere Node.js, librerías externas ni herramientas de compilación: está construida con **HTML5, CSS3 y JavaScript ES6 puro**.

---

## 📁 Estructura del Proyecto

```text
amor-3-meses/
├── index.html            # Estructura principal y enlace a módulos
├── README.md             # Guía de edición y publicación
├── css/
│   ├── base.css          # Variables, reset, tipografías y colores
│   ├── layout.css        # Pantallas, loader, rotación y canvas
│   ├── components.css    # Botones, tarjetas, sobre, carta y modales
│   └── animations.css    # Keyframes fluidos y prefers-reduced-motion
├── js/
│   ├── config.js         # TODOS los textos, nombres, metas y frases editables
│   ├── main.js           # Orquestador: navegación, audio, haptics e inicio
│   ├── petals.js         # Pétalos flotantes de fondo y confeti de celebración
│   ├── envelope.js       # Sobre interactivo y máquina de escribir
│   ├── garden.js         # Jardín botánico táctil con flores en SVG
│   ├── hearts-game.js    # Minijuego de atrapar corazones cayendo
│   └── question.js       # Pregunta imposible con botón "No" evasivo
└── assets/
    ├── img/              # Favicon, ramo, anillo y flores vectoriales
    │   ├── favicon.svg
    │   ├── bouquet.svg
    │   ├── ring.svg
    │   ├── flower-rose.svg
    │   ├── flower-tulip.svg
    │   ├── flower-daisy.svg
    │   ├── flower-sunflower.svg
    │   └── flower-cherry.svg
    └── audio/            # Música de fondo
        └── README.txt    # Instrucciones para añadir tu propio MP3
```

---

## ✏️ Cómo personalizar los textos y detalles

Todos los textos, nombres y cantidades están en un solo lugar: **`js/config.js`**.

Abre `js/config.js` con cualquier editor de texto o bloc de notas y modifica los campos:

```javascript
export const CONFIG = {
  // 1. Datos personales
  nombreElla: "Valentina",       // <-- Nombre de tu novia
  tuNombre: "Carlos",            // <-- Tu nombre
  
  // 2. Frase de la portada
  frasePortada: "Tres meses contigo y mi corazón ya no quiere otra cosa 💗",

  // 3. Tu carta de amor (\n añade un salto de línea)
  cartaMensaje: 
    "Parece que fue ayer cuando empezamos a hablar...\n\n" +
    "Gracias por cada risa compartida...\n\n" +
    "Te amo con todo mi corazón.",

  // 4. Metas numéricas y mensajes de sorpresa
  metaFlores: 30,                // Cuántas flores deben brotar en el jardín
  mensajeJardin: "Así como este jardín, tú haces florecer lo más bonito de mi vida 🌸",

  metaCorazones: 15,             // Cuántos corazones atrapar en el minijuego
  mensajeJuego: "¡Atrapaste cada latido de mi corazón! 🎁💖",

  // 5. Frases divertidas cuando intenta presionar "No"
  frasesBotonNo: [
    "¿Segura? 🥺",
    "Piénsalo bien 😏",
    "¡Casi me atrapas! 😂",
    "Mejor di que sí 🙈"
  ],

  // 6. Mensaje de cierre
  mensajeFinal: "Gracias por estos 3 meses mágicos. Prometo seguir haciéndote sonreír...",
  firmaFinal: "Por muchos meses más juntos ❤️"
};
```

---

## 🎵 Música de Fondo

1. **Sintetizador integrado (sin descargar nada)**:  
   La página incluye un sintetizador Web Audio API que genera una suave melodía romántica acústica de arpegios sin necesitar ningún archivo de audio.
2. **Tu propia canción (Opcional)**:  
   Si tienes una canción favorita en formato `.mp3`, cópiala dentro de la carpeta `assets/audio/` con el nombre `musica.mp3`. Al pulsar el botón flotante 🎵 se reproducirá tu canción.

---

## 🚀 Cómo publicar gratis y obtener un link para el celular

### Opción 1: Netlify Drop (La más rápida — en menos de 1 minuto)

1. Ingresa a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Si no tienes cuenta, puedes iniciar sesión gratis con tu correo o cuenta de Google.
3. Arrastra la carpeta completa (`ella` o `amor-3-meses`) directamente al círculo punteado de la página web.
4. En 5 segundos se creará tu sitio web y te dará un enlace público (ejemplo: `https://mi-amor-3meses.netlify.app`).
5. Abre el link desde el celular de ella o envíaselo por WhatsApp.

---

### Opción 2: GitHub Pages (Gratis y permanente)

1. Ve a [github.com](https://github.com) y crea un nuevo repositorio (por ejemplo: `nuestros-3-meses`), marcándolo como **Public**.
2. Sube todos los archivos y carpetas del proyecto (`index.html`, carpetas `css/`, `js/`, `assets/`).
3. En tu repositorio, entra a **Settings** > pestaña **Pages** (en el menú lateral izquierdo).
4. En **Build and deployment** > **Branch**, selecciona `main` (o `master`) y la carpeta `/ (root)`. Haz clic en **Save**.
5. En unos 2 minutos, GitHub te dará un link: `https://tu-usuario.github.io/nuestros-3-meses/`.

---

## 📱 Funcionalidades adaptadas para celulares

- **Mobile-First nativo**: Optimizado para pantallas de 360 px a 430 px de ancho y `100dvh`.
- **Previene zoom accidental y scrolls molestos**: `touch-action: manipulation`, `user-scalable=no`.
- **Efecto háptico**: Vibración suave en botones principales mediante la API `navigator.vibrate`.
- **Aviso de rotación**: Si gira el celular a modo horizontal, aparece un cartel amable: *"Gírame de vuelta 💕"*.
- **Preloader delicado**: Flor que brota mientras cargan las tipografías y el diseño.
- **Botón evasivo inteligente anti-solapamiento**: El botón "No" detecta `pointerdown` y `touchstart`, verificando con margen de seguridad que jamás quede encima del botón "Sí" y se mantenga 100% visible dentro de la pantalla.
- **Ramilletes en el jardín**: Con un solo toque nacen entre 15 y 25 flores a la vez con dispersión y animación escalonada.
- **Lluvia masiva de corazones**: Salen muchos corazones continuos al mismo tiempo, requiriendo solo 10 para ganar el minijuego.
- **Menú interactivo de actividades**: En la pantalla final se muestra una cuadrícula de tarjetas para revivir cualquiera de las actividades (Carta, Jardín, Juego, Pregunta), con botones *"⬅ Menú"* en cada pantalla para regresar fácilmente.
