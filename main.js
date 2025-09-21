const rutas = [
  "Juegos/Ajedrez/metadata.json",
  "Juegos/3-en-raya/metadata.json",
  "Juegos/pac-man/metadata.json",
  "Juegos/Tetris/metadata.json",
  "Juegos/ping-pong/metadata.json",
];

const contenedor = document.getElementById("juegos-container");
const inputBusqueda = document.getElementById("busqueda");
const selectTags = document.getElementById("filtro-tags");
const selectAutor = document.getElementById("filtro-autor");

let todosLosJuegos = [];
let todosLosTags = new Set();
let todosLosAutores = new Set();

const coloresTags = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];

function obtenerColorTag(tag, index) {
  return coloresTags[index % coloresTags.length];
}

async function cargarJuegos() {
  for (const ruta of rutas) {
    try {
      const res = await fetch(ruta);
      if (!res.ok) throw new Error(`Error cargando ${ruta}`);
      const juego = await res.json();
      todosLosJuegos.push(juego);

      // Agregar tags y autores a los sets
      if (juego.tags) juego.tags.forEach(tag => todosLosTags.add(tag));
      if (juego.autor) todosLosAutores.add(juego.autor);

    } catch (error) {
      console.error(error);
    }
  }

  // Llenar dropdown de tags
  todosLosTags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    selectTags.appendChild(option);
  });

  // Llenar dropdown de autores
  todosLosAutores.forEach(autor => {
    const option = document.createElement('option');
    option.value = autor;
    option.textContent = autor;
    selectAutor.appendChild(option);
  });

  mostrarJuegos(todosLosJuegos);
}

function mostrarJuegos(juegos) {
  contenedor.innerHTML = '';
  juegos.forEach(juego => mostrarJuego(juego));
}

function mostrarJuego(juego) {
  const card = document.createElement("div");
  card.className = "juego-card";

  const tagsHTML = juego.tags
    ? juego.tags.map((tag, index) => {
        return `<span class="tag" style="background-color: ${obtenerColorTag(tag, index)}; color: white;">${tag}</span>`;
      }).join('')
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

function filtrarJuegos() {
  const texto = inputBusqueda.value.toLowerCase();
  const tagSeleccionado = selectTags.value;
  const autorSeleccionado = selectAutor.value;

  const filtrados = todosLosJuegos.filter(juego => {
    const nombreCoincide = juego.nombre.toLowerCase().includes(texto);
    const tagCoincide = !tagSeleccionado || juego.tags?.includes(tagSeleccionado);
    const autorCoincide = !autorSeleccionado || juego.autor === autorSeleccionado;
    return nombreCoincide && tagCoincide && autorCoincide;
  });

  mostrarJuegos(filtrados);
}

// Eventos de filtrado
inputBusqueda.addEventListener('input', filtrarJuegos);
selectTags.addEventListener('change', filtrarJuegos);
selectAutor.addEventListener('change', filtrarJuegos);

// Cargar los juegos al inicio
cargarJuegos();
