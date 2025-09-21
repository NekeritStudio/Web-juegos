// Lista de rutas donde buscar metadata.json
const rutas = [
  "Juegos/Ajedrez/metadata.json"
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

// Función para pintar cada juego en la galería
function mostrarJuego(juego) {
  const card = document.createElement("div");
  card.className = "juego-card";

  card.innerHTML = `
    <img src="${juego.miniatura}" alt="${juego.nombre}">
    <h2>${juego.nombre}</h2>
    <p>${juego.descripcion}</p>
    <p><strong>Categoría:</strong> ${juego.categoria}</p>
    <button onclick="location.href='${juego.url}'">Jugar</button>
  `;

  contenedor.appendChild(card);
}

// Iniciar carga
cargarJuegos();
