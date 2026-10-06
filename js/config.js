/**
 * CONFIG.JS
 * Configuración central y editable de todo el proyecto.
 * Modifica estos valores para personalizar nombres, frases, metas y mensajes.
 */
export const CONFIG = {
  // Datos personales
  nombreElla: "Mi Amor",        // <-- Cambia aquí por el nombre de ella (ej. "Valentina", "Sofía", etc.)
  tuNombre: "Tu Novio",         // <-- Cambia aquí por tu nombre (ej. "Carlos", "Mateo", etc.)
  
  // Frase principal de portada
  frasePortada: "Tres meses contigo y mi corazón ya no quiere otra cosa 💗",

  // Mensaje de la carta de amor (los saltos de línea se respetan con \n)
  cartaMensaje: 
    "Parece que fue ayer cuando empezamos a hablar, y hoy ya cumplimos tres meses caminando de la mano.\n\n" +
    "Gracias por cada risa compartida, por tus abrazos que me devuelven la calma y por convertir los días normales en momentos inolvidables.\n\n" +
    "Te elijo hoy, te elegiré mañana y todos los días que la vida nos regale juntos.",

  // Jardín botánico interactivo
  metaFlores: 30,               // Número de flores necesarias para completar el jardín
  mensajeJardin: "Así como este jardín, tú haces florecer lo más bonito y puro de mi vida. Gracias por iluminar mi mundo 🌸",

  // Minijuego de corazones
  metaCorazones: 10,            // Número de corazones necesarios para ganar (actualizado a 10)
  mensajeJuego: "¡Atrapaste cada latido de mi corazón! Eres el regalo más lindo que me ha dado la vida 🎁💖",

  // Frases divertidas cuando intenta presionar el botón "No"
  frasesBotonNo: [
    "¿Segura? 🥺",
    "Piénsalo bien 😏",
    "¡Casi me atrapas! 😂",
    "Mejor di que sí 🙈",
    "¡No se vale huir! 😜",
    "El destino dice Sí ✨",
    "Mira el botón grande 💕",
    "¡Imposible decir no! 💖"
  ],

  // Pantalla final de celebración
  mensajeFinal: "Gracias por estos 3 meses mágicos. Prometo seguir cuidándote, haciéndote sonreír y amándote con cada pedacito de mi alma.",
  firmaFinal: "Por muchos meses más juntos ❤️",

  // Archivo de música opcional (si existe en assets/audio/musica.mp3, se reproducirá; sino, usa el sintetizador dulce)
  archivoMusica: "assets/audio/musica.mp3"
};
