// Lista de rutas donde buscar metadata.json
const rutas = [
  "Juegos/Ajedrez/metadata.json",
  "Juegos/3-en-raya/metadata.json",
  "Juegos/pac-man/metadata.json",
  "Juegos/Tetris/metadata.json",
  // 👉 Cuando tengas más juegos, añade más rutas aquí
];

// Contenedor principal
const contenedor = document.getElementById("juegos-container");

// Función para cargar todos los juegos
async function cargarJuegos() {
  for (const ruta of rutas) {
    try {
      const res = await fetch(ruta);
      if (!res.ok) throw new Error(`Error cargando ${ruta}`);
      const juego = await res.json();
      mostrarJuego(juego);
    } catch (error) {
      console.error(error);
    }
  }
}

// Colores para los tags
const coloresTags = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
];

// Función para obtener color del tag
function obtenerColorTag(tag, index) {
  return coloresTags[index % coloresTags.length];
}

// Función para pintar cada juego en la galería
function mostrarJuego(juego) {
  const card = document.createElement("div");
  card.className = "juego-card";

  // Formatear tags como etiquetas con colores
  const tagsHTML = juego.tags 
    ? juego.tags.map((tag, index) => 
        `<span class="tag" style="background-color: ${obtenerColorTag(tag, index)}; color: white;">${tag}</span>`
      ).join('') 
    : '';

  card.innerHTML = `
    <img src="${juego.miniatura}" alt="${juego.nombre}">
    <h2>${juego.nombre}</h2>
    <p>${juego.descripcion}</p>
    <p><strong>Categoría:</strong> ${juego.categoria}</p>
    ${juego.autor ? `<p><strong>Autor:</strong> ${juego.autor}</p>` : ''}
    ${tagsHTML ? `<div class="tags-container">${tagsHTML}</div>` : ''}
    <button onclick="location.href='${juego.url}'">Jugar</button>
  `;

  contenedor.appendChild(card);
}

// Iniciar carga
cargarJuegos();